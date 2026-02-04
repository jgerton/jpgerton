"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import { ThemeToggle } from "@/components/theme-toggle";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const allProjects = useQuery(api.projects.list);

  const [selectedTechs] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [sortBy] = useQueryState("sort", parseAsString.withDefault("date"));

  // Derive available techs from actual project data
  const availableTechs = useMemo(() => {
    if (!allProjects) return [];
    const techSet = new Set<string>();
    allProjects.forEach((project) => {
      project.techStack.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [allProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    let filtered = allProjects;

    // Filter by selected techs
    if (selectedTechs.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTechs.some((tech) => project.techStack.includes(tech))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // Default: newest first (by displayOrder descending, or createdAt)
      return b.displayOrder - a.displayOrder;
    });

    return sorted;
  }, [allProjects, selectedTechs, sortBy]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Jon Gerton
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">All Projects</h1>
          <p className="text-muted-foreground mb-8">
            Browse my portfolio of indie projects and custom development work.
          </p>

          <ProjectFilters availableTechs={availableTechs} />

          <ProjectGrid
            projects={filteredProjects}
            loading={allProjects === undefined}
          />
        </div>
      </div>
    </main>
  );
}
