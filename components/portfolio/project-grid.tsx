"use client";

import { ProjectCard } from "./project-card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

type Project = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  screenshotUrl: string | null;
  status: "live" | "archived" | "in-progress";
};

type ProjectGridProps = {
  projects: Project[];
  loading?: boolean;
};

export function ProjectGrid({ projects, loading }: ProjectGridProps) {
  const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-2xl text-muted-foreground">
        No projects found
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg"
    >
      {projects.map((project, index) => (
        <div
          key={project._id}
          className={cn(
            "opacity-0 translate-y-5",
            "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
            isVisible && "opacity-100 translate-y-0"
          )}
          style={{
            transitionDelay: isVisible
              ? `${Math.min(index, 9) * 50}ms`
              : "0ms",
          }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
