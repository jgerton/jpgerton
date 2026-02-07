"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
      {/* Hero area */}
      <SectionBackground variant="neutral">
        <h1 className="font-serif font-semibold text-h1 leading-tight mb-xs">All Projects</h1>
        <p className="text-muted-foreground mb-0">
          Browse my portfolio of web development and custom application work.
        </p>
      </SectionBackground>

      {/* Filter + grid area */}
      <SectionBackground variant="muted">
        <ProjectFilters availableTechs={availableTechs} />

        <ProjectGrid
          projects={filteredProjects}
          loading={allProjects === undefined}
        />

        {/* Subtle CTA - lighter presence for browsing page */}
        <div className="mt-2xl text-center">
          <p className="text-muted-foreground mb-md">Have a project in mind?</p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Let&apos;s Talk
            </Button>
          </Link>
        </div>
      </SectionBackground>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <SectionBackground variant="neutral">
          <h1 className="font-serif font-semibold text-h1 leading-tight mb-xs">All Projects</h1>
          <p className="text-muted-foreground">Loading...</p>
        </SectionBackground>
      </main>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
