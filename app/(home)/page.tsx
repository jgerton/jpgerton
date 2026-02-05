"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocalBusinessSchema } from "@/components/schema";

export default function HomePage() {
  const projects = useQuery(api.projects.list);

  return (
    <main className="min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="fixed top-0 right-0 p-md z-50">
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Projects Showcase */}
      <section className="py-3xl px-md bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-xs text-center">Recent Projects</h2>
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
