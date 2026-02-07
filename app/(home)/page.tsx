"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { HeroWithGradient } from "@/components/portfolio/sections/hero-with-gradient";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
import { CTABanner } from "@/components/portfolio/sections/cta-banner";
import { MidPageCTA } from "@/components/portfolio/sections/mid-page-cta";
import { SocialProofDisplay } from "@/components/portfolio/social-proof-display";
import { TestimonialCard } from "@/components/portfolio/testimonial-card";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocalBusinessSchema } from "@/components/schema";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "$500 WordPress Sites",
    description:
      "Get online in 5 business days with a professional, mobile-friendly site built to attract local customers.",
  },
  {
    title: "Custom Web Applications",
    description:
      "Tailored solutions with modern tech for businesses with unique needs that off-the-shelf can't solve.",
  },
  {
    title: "Team Growth Mentoring",
    description:
      "Help your developers level up with code review, architecture guidance, and engineering culture coaching.",
  },
];

const metrics = [
  { value: "18+", label: "Years Web Development" },
  { value: "5 Days", label: "Average WordPress Delivery" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function HomePage() {
  const projects = useQuery(api.projects.list);
  const blogPosts = useQuery(api.blogPosts.listPublished, {});
  const testimonials = useQuery(api.testimonials.list);

  // Scroll entrance animations for each major section
  const servicesAnim = useIntersectionObserver<HTMLDivElement>();
  const projectsAnim = useIntersectionObserver<HTMLDivElement>();
  const blogAnim = useIntersectionObserver<HTMLDivElement>();
  const socialProofAnim = useIntersectionObserver<HTMLDivElement>();

  return (
    <main className="min-h-screen bg-background">
      {/* Section 1: Hero */}
      <HeroWithGradient />

      {/* Section 2: Services Overview */}
      <SectionBackground variant="gradient">
        <div
          ref={servicesAnim.elementRef}
          className={cn(
            "opacity-0 translate-y-5",
            "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
            servicesAnim.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <h2 className="font-serif font-medium text-h2 leading-tight text-center mb-xs">
            What I Offer
          </h2>
          <p className="text-muted-foreground text-center mb-xl">
            The right solution for your business, from quick sites to custom
            apps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {services.map((service, index) => (
              <Card
                key={service.title}
                elevation="sm"
                className={cn(
                  "p-lg text-center",
                  "opacity-0 translate-y-5",
                  "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
                  servicesAnim.isVisible && "opacity-100 translate-y-0"
                )}
                style={{
                  transitionDelay: servicesAnim.isVisible
                    ? `${(index + 1) * 100}ms`
                    : "0ms",
                }}
              >
                <h3 className="font-semibold text-lg mb-sm">{service.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-xl">
            <Button asChild variant="link">
              <Link href="/services">View Pricing &amp; Details</Link>
            </Button>
          </div>
        </div>
      </SectionBackground>

      {/* Section 3: Featured Projects - hidden when no projects available */}
      {(projects === undefined || (projects && projects.length > 0)) && (
        <SectionBackground variant="neutral">
          <div
            ref={projectsAnim.elementRef}
            className={cn(
              "opacity-0 translate-y-5",
              "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
              projectsAnim.isVisible && "opacity-100 translate-y-0"
            )}
          >
            <h2 className="font-serif font-medium text-h2 leading-tight text-center mb-xs">
              Recent Work
            </h2>
            <p className="text-muted-foreground text-center mb-xl">
              A selection of projects showcasing my approach
            </p>
          </div>
          <ProjectGrid
            projects={(projects ?? []).slice(0, 3)}
            loading={projects === undefined}
          />
          <MidPageCTA
            variant="simple"
            headline="Like What You See?"
            cta={{
              text: "Start Your Project",
              href: "/services",
              intent: "warm",
            }}
          />
        </SectionBackground>
      )}

      {/* Section 3.5: Blog Posts - hidden when no posts */}
      {blogPosts && blogPosts.length > 0 && (
        <SectionBackground variant="gradient">
          <div
            ref={blogAnim.elementRef}
            className={cn(
              "opacity-0 translate-y-5",
              "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
              blogAnim.isVisible && "opacity-100 translate-y-0"
            )}
          >
            <h2 className="font-serif font-medium text-h2 leading-tight text-center mb-xs">
              Insights &amp; Updates
            </h2>
            <p className="text-muted-foreground text-center mb-xl">
              Tips and stories for local businesses getting online
            </p>
            <div className="grid grid-cols-1 gap-lg">
              {blogPosts.slice(0, 3).map((post) => (
                <BlogPostCard
                  key={post._id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImageUrl={post.coverImageUrl}
                  coverImageAlt={post.coverImageAlt}
                  category={post.category}
                  readingTime={post.readingTime}
                  publishedAt={post.publishedAt ?? 0}
                />
              ))}
            </div>
            <div className="text-center mt-xl">
              <Button asChild variant="link">
                <Link href="/blog">Read More</Link>
              </Button>
            </div>
          </div>
        </SectionBackground>
      )}

      {/* Section 4: Social Proof & Testimonials */}
      <SectionBackground variant="muted">
        <div
          ref={socialProofAnim.elementRef}
          className={cn(
            "opacity-0 translate-y-5",
            "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
            socialProofAnim.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <SocialProofDisplay metrics={metrics} />

          {(testimonials === undefined ||
            (testimonials && testimonials.length > 0)) && (
            <>
              <h2 className="font-serif text-h3 leading-snug text-center mt-2xl mb-lg">
                What Clients Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {(testimonials ?? []).map((testimonial) => (
                  <TestimonialCard
                    key={testimonial._id}
                    quote={testimonial.quote}
                    name={testimonial.name}
                    title={testimonial.title}
                    company={testimonial.company}
                    photo={testimonial.photoUrl ?? undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </SectionBackground>

      {/* Section 5: End-Page CTA Banner */}
      <CTABanner
        headline="Let's Build Something Great Together"
        description="Whether you need a quick WordPress site or a custom solution, I'll help you get online and start growing."
        primaryCta={{
          text: "Get Your Business Online",
          href: "/services",
          intent: "warm",
        }}
        secondaryCta={{
          text: "See My Work",
          href: "/projects",
        }}
      />

      {/* Schema Markup */}
      <LocalBusinessSchema />
    </main>
  );
}
