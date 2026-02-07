import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface BlogPostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null | undefined;
  category: string;
  readingTime: number;
  publishedAt: number;
}

export function BlogPostCard({
  title,
  slug,
  excerpt,
  coverImageUrl,
  coverImageAlt,
  category,
  readingTime,
  publishedAt,
}: BlogPostCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`}>
      <Card className="overflow-hidden border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="flex flex-col md:flex-row">
          {/* Image container */}
          <div className="relative w-full md:w-64 lg:w-72 aspect-video flex-shrink-0 bg-muted">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={coverImageAlt || title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 256px, 288px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>

          {/* Content container */}
          <div className="flex-1 p-lg">
            <Badge variant="secondary" className="mb-sm">
              {category}
            </Badge>

            <h3 className="font-serif text-h4 leading-snug mb-sm">{title}</h3>

            <p className="text-muted-foreground line-clamp-2 mb-md">
              {excerpt}
            </p>

            <div className="flex items-center gap-md text-sm text-muted-foreground">
              <time dateTime={new Date(publishedAt).toISOString()}>
                {formattedDate}
              </time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
