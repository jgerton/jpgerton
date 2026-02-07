import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTAButton } from "@/components/portfolio/cta-button";
import { CaseStudyVisual } from "@/components/portfolio/case-study-visual";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
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

  // Fetch linked case study data
  const caseStudies = await fetchQuery(api.caseStudies.getByProject, {
    projectId: project._id,
  });
  const caseStudy = caseStudies[0]; // Show only the first (most recent) one

  // Use linked case study data if available, otherwise derive from project fields
  const caseStudyData = caseStudy
    ? {
        problem: {
          heading: caseStudy.problemHeading,
          content: caseStudy.problemContent,
        },
        solution: {
          heading: caseStudy.solutionHeading,
          content: caseStudy.solutionContent,
        },
        results: {
          heading: caseStudy.resultsHeading,
          content: caseStudy.resultsContent,
          metrics: caseStudy.metrics.map((m) => `${m.label}: ${m.value}`),
        },
      }
    : {
        problem: {
          heading: "The Challenge",
          content: project.descriptionLong || project.description,
        },
        solution: {
          heading: "The Approach",
          content:
            "Built with a modern tech stack focused on performance, maintainability, and great user experience.",
        },
        results: {
          heading: "The Result",
          content:
            "A polished application that demonstrates professional web development capabilities.",
          metrics: project.techStack.slice(0, 3).map((tech) => `Built with ${tech}`),
        },
      };

  return (
    <main className="min-h-screen bg-background">
      {/* Back navigation + Hero image */}
      <SectionBackground variant="neutral">
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
        <div className="flex items-start justify-between gap-md">
          <div>
            <h1 className="font-serif font-semibold text-h1 leading-tight mb-xs">
              {project.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {project.descriptionLong ?? project.description}
            </p>
          </div>
          <Badge variant={statusVariant[project.status]} className="shrink-0">
            {project.status}
          </Badge>
        </div>
      </SectionBackground>

      {/* Case Study section */}
      <SectionBackground variant="gradient">
        <h2 className="font-serif font-medium text-h2 leading-tight mb-lg">
          {caseStudy ? "Case Study" : "Project Highlights"}
        </h2>
        <CaseStudyVisual
          problem={caseStudyData.problem}
          solution={caseStudyData.solution}
          results={caseStudyData.results}
        />
      </SectionBackground>

      {/* Tech Stack section */}
      <SectionBackground variant="neutral">
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
      </SectionBackground>

      {/* Links section */}
      <SectionBackground variant="neutral" className="py-xl">
        <div className="flex flex-wrap gap-md">
          {project.liveUrl && (
            <Button asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                View Live Site
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                View Source
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </Button>
          )}
        </div>
      </SectionBackground>

      {/* End-page CTA - lighter treatment */}
      <SectionBackground variant="muted">
        <div className="text-center">
          <p className="text-muted-foreground mb-md">
            Interested in working together?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-md">
            <Link href="/services">
              <CTAButton intent="warm" size="lg">
                Get Your Business Online
              </CTAButton>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </SectionBackground>
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
