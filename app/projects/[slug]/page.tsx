import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await fetchQuery(api.projects.getBySlug, { slug });

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: project.name,
      description: project.description,
      openGraph: {
        title: `${project.name} | Jon Gerton`,
        description: project.description,
        type: "article",
        images: project.screenshotUrl
          ? [
              {
                url: project.screenshotUrl,
                width: 1200,
                height: 630,
                alt: `${project.name} screenshot`,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Project",
    };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next.js 16 requires await

  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project) {
    notFound();
  }

  const statusVariant = {
    live: "default" as const,
    archived: "secondary" as const,
    "in-progress": "outline" as const,
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Content */}
      <div className="py-2xl px-md">
        <div className="max-w-4xl mx-auto">
          {/* Back navigation */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-xs text-muted-foreground hover:text-foreground transition-colors mb-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          {/* Hero Image */}
          {project.screenshotUrl && (
            <div className="relative aspect-video mb-xl rounded-lg overflow-hidden shadow-lg">
              <Image
                src={project.screenshotUrl}
                alt={`${project.name} screenshot`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Project Header */}
          <div className="flex items-start justify-between gap-md mb-lg">
            <div>
              <h1 className="font-serif font-semibold text-h1 leading-tight mb-xs">{project.name}</h1>
              <p className="text-lg text-muted-foreground">
                {project.descriptionLong ?? project.description}
              </p>
            </div>
            <Badge variant={statusVariant[project.status]} className="shrink-0">
              {project.status}
            </Badge>
          </div>

          {/* Tech Stack */}
          <div className="mb-xl">
            <h2 className="font-serif font-medium text-h2 leading-tight mb-md">Tech Stack</h2>
            <div className="space-y-md">
              {Object.entries(project.techCategories).map(([category, techs]) => {
                if (!techs || techs.length === 0) return null;
                return (
                  <div key={category}>
                    <h3 className="font-semibold capitalize mb-xs text-muted-foreground">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-xs">
                      {techs.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-md">
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Site
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Generate static paths at build time (optional, improves performance)
export async function generateStaticParams() {
  try {
    const projects = await fetchQuery(api.projects.list, {});
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch {
    // Return empty array if Convex not available during build
    return [];
  }
}
