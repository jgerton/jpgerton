import { mutation } from "./_generated/server";

export const seedProjects = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if projects already exist to avoid duplicates
    const existing = await ctx.db.query("projects").first();
    if (existing) {
      return { status: "skipped", message: "Projects already seeded" };
    }

    const projects = [
      {
        name: "WP Designer",
        slug: "wp-designer",
        description: "Portfolio site showcasing $500 WordPress sites and custom development",
        descriptionLong: "A dual-purpose portfolio platform serving local business owners seeking $500 WordPress sites and custom development clients. Built with Next.js 16, Convex, and Tailwind CSS with full AEO treatment for AI search visibility.",
        status: "in-progress" as const,
        techStack: ["Next.js", "React", "Convex", "Tailwind CSS", "TypeScript", "Vercel"],
        techCategories: {
          frontend: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
          backend: ["Convex"],
          infrastructure: ["Vercel", "GitHub Actions"],
        },
        liveUrl: "https://wp-designer.vercel.app",
        githubUrl: "https://github.com/jgerton/jpgerton",
        featured: true,
        displayOrder: 6,
        createdAt: Date.now(),
      },
      {
        name: "TaskFlow Pro",
        slug: "taskflow-pro",
        description: "AI-powered task management with natural language processing",
        descriptionLong: "A modern task management application featuring AI-powered task parsing from natural language input. Includes smart categorization, deadline detection, and priority inference using OpenAI's GPT-4 API.",
        status: "live" as const,
        techStack: ["React", "Node.js", "PostgreSQL", "OpenAI", "Docker", "AWS"],
        techCategories: {
          frontend: ["React", "TypeScript", "Tailwind CSS"],
          backend: ["Node.js", "Express", "PostgreSQL", "OpenAI API"],
          infrastructure: ["Docker", "AWS ECS", "RDS"],
        },
        liveUrl: "https://taskflow-example.com",
        githubUrl: "https://github.com/jgerton/taskflow-pro",
        featured: true,
        displayOrder: 5,
        createdAt: Date.now() - 86400000 * 30,
      },
      {
        name: "DevMetrics Dashboard",
        slug: "devmetrics-dashboard",
        description: "Real-time developer productivity analytics and insights",
        descriptionLong: "A comprehensive dashboard for engineering teams to track productivity metrics, code review turnaround times, and deployment frequency. Integrates with GitHub, GitLab, and Jira for automated data collection.",
        status: "live" as const,
        techStack: ["Vue.js", "Python", "FastAPI", "TimescaleDB", "Chart.js"],
        techCategories: {
          frontend: ["Vue.js", "Chart.js", "TypeScript"],
          backend: ["Python", "FastAPI", "TimescaleDB"],
          infrastructure: ["Docker", "DigitalOcean", "GitHub Actions"],
        },
        liveUrl: "https://devmetrics-example.com",
        githubUrl: "https://github.com/jgerton/devmetrics",
        featured: true,
        displayOrder: 4,
        createdAt: Date.now() - 86400000 * 60,
      },
      {
        name: "LocalBiz Templates",
        slug: "localbiz-templates",
        description: "WordPress starter templates for local service businesses",
        descriptionLong: "A collection of optimized WordPress starter templates designed for local service businesses. Includes pre-configured SEO settings, contact forms, Google Maps integration, and mobile-first responsive design.",
        status: "live" as const,
        techStack: ["WordPress", "PHP", "MySQL", "Elementor", "ACF"],
        techCategories: {
          frontend: ["WordPress", "Elementor", "CSS"],
          backend: ["PHP", "MySQL", "ACF"],
          infrastructure: ["WP Engine", "Cloudflare"],
        },
        liveUrl: undefined,
        githubUrl: "https://github.com/jgerton/localbiz-templates",
        featured: false,
        displayOrder: 3,
        createdAt: Date.now() - 86400000 * 90,
      },
      {
        name: "CodeReview Bot",
        slug: "codereview-bot",
        description: "Automated code review assistant using LLM analysis",
        descriptionLong: "A GitHub bot that provides automated code review suggestions using large language models. Analyzes PR diffs for bugs, security issues, and code style improvements with contextual explanations.",
        status: "archived" as const,
        techStack: ["TypeScript", "GitHub API", "OpenAI", "Vercel"],
        techCategories: {
          frontend: [],
          backend: ["TypeScript", "GitHub API", "OpenAI API"],
          infrastructure: ["Vercel Functions", "GitHub Apps"],
        },
        liveUrl: undefined,
        githubUrl: "https://github.com/jgerton/codereview-bot",
        featured: false,
        displayOrder: 2,
        createdAt: Date.now() - 86400000 * 180,
      },
      {
        name: "Budget Tracker CLI",
        slug: "budget-tracker-cli",
        description: "Terminal-based personal finance tracking with charts",
        descriptionLong: "A command-line tool for tracking personal finances with ASCII chart visualizations. Supports importing transactions from CSV, categorization rules, and monthly budget tracking with alerts.",
        status: "archived" as const,
        techStack: ["Rust", "SQLite", "CLI"],
        techCategories: {
          frontend: [],
          backend: ["Rust", "SQLite"],
          infrastructure: ["Homebrew", "crates.io"],
        },
        liveUrl: undefined,
        githubUrl: "https://github.com/jgerton/budget-cli",
        featured: false,
        displayOrder: 1,
        createdAt: Date.now() - 86400000 * 365,
      },
    ];

    // Insert all projects
    for (const project of projects) {
      await ctx.db.insert("projects", {
        ...project,
        screenshotId: undefined, // No screenshots yet - will be added via admin
      });
    }

    return { status: "success", message: `Seeded ${projects.length} projects` };
  },
});

// Optional: Clear all projects (for development/testing)
export const clearProjects = mutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      await ctx.db.delete(project._id);
    }
    return { status: "success", message: `Deleted ${projects.length} projects` };
  },
});

