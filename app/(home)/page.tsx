"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { LocalBusinessSchema } from "@/components/schema";

export default function HomePage() {
  const projects = useQuery(api.projects.list);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Projects Showcase */}
      <section className="py-3xl px-md bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-medium text-h2 leading-tight mb-xs text-center">Recent Projects</h2>
          <p className="text-muted-foreground text-center mb-xl">
            A selection of indie projects showcasing my work
          </p>
          <ProjectGrid
            projects={projects ?? []}
            loading={projects === undefined}
          />
        </div>
      </section>

      {/* Schema Markup */}
      <LocalBusinessSchema />
    </main>
  );
}
