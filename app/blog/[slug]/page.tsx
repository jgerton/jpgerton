import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTAButton } from "@/components/portfolio/cta-button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { BlogReadTracker } from "@/components/blog/blog-read-tracker";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await fetchQuery(api.blogPosts.getBySlug, { slug });

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: `${post.title} | Jon Gerton`,
        description: post.excerpt,
        type: "article",
        publishedTime: post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : undefined,
        authors: [siteConfig.author.name],
        images: [
          {
            url: `/blog/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return {
      title: "Blog Post",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await fetchQuery(api.blogPosts.getBySlug, { slug });

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ? [post.coverImageUrl] : [],
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    author: [
      {
        "@type": "Person",
        name: siteConfig.author.name,
        url: siteConfig.url,
      },
    ],
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover image hero */}
      <div className="w-full">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            width={1200}
            height={400}
            className="w-full aspect-[2/1] md:aspect-[3/1] object-cover"
            priority
          />
        ) : (
          <div className="w-full aspect-[2/1] md:aspect-[3/1] bg-gradient-to-br from-[#003F75] to-[#2884BD]" />
        )}
      </div>

      {/* Content area */}
      <article className="max-w-prose mx-auto px-md py-xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-xs text-muted-foreground hover:text-foreground transition-colors mb-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Title */}
        <h1 className="font-serif font-semibold text-h1 leading-tight mb-sm">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap gap-sm text-sm text-muted-foreground mb-xl">
          <Badge variant="secondary">{post.category}</Badge>
          <span>
            {new Date(post.publishedAt || post._creationTime).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </span>
          <span aria-hidden="true">•</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Markdown content */}
        <BlogPostContent content={post.content} />

        {/* Read completion tracker */}
        <BlogReadTracker slug={slug} readTimeMinutes={post.readingTime} />

        {/* Bottom CTA */}
        <div className="mt-2xl pt-xl border-t border-border">
          <h2 className="font-serif text-h3 leading-snug mb-sm">
            Want a website like this for your business?
          </h2>
          <p className="text-muted-foreground mb-lg">
            I build professional WordPress sites for local businesses, starting
            at $500. Let&apos;s talk about getting your business online.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link href="/services">
              <CTAButton intent="warm">Get Your Business Online</CTAButton>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Book a Free Call</Button>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await fetchQuery(api.blogPosts.listPublished, {});
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}
