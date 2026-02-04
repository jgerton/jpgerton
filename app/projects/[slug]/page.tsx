import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          {project.screenshotUrl && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden shadow-lg">
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
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              <p className="text-lg text-muted-foreground">
                {project.descriptionLong ?? project.description}
              </p>
            </div>
            <Badge variant={statusVariant[project.status]} className="shrink-0">
              {project.status}
            </Badge>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
            <div className="space-y-4">
              {Object.entries(project.techCategories).map(([category, techs]) => {
                if (!techs || techs.length === 0) return null;
                return (
                  <div key={category}>
                    <h3 className="font-semibold capitalize mb-2 text-muted-foreground">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-4">
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
