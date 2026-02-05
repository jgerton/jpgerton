"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useMemo, Suspense } from "react";

function ProjectsContent() {
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
      {/* Content */}
      <div className="py-2xl px-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-xs">All Projects</h1>
          <p className="text-muted-foreground mb-xl">
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <div className="py-2xl px-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-xs">All Projects</h1>
            <p className="text-muted-foreground mb-xl">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
