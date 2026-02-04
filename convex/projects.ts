import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all projects ordered by displayOrder (descending).
 * Resolves screenshot URLs from Convex storage.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("desc")
      .collect();

    // Resolve screenshot URLs
    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        const screenshotUrl = project.screenshotId
          ? await ctx.storage.getUrl(project.screenshotId)
          : null;

        return {
          ...project,
          screenshotUrl,
        };
      })
    );

    return projectsWithUrls;
  },
});

/**
 * Get a single project by slug.
 * Returns null if not found.
 * Resolves screenshot URL from Convex storage.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!project) {
      return null;
    }

    const screenshotUrl = project.screenshotId
      ? await ctx.storage.getUrl(project.screenshotId)
      : null;

    return {
      ...project,
      screenshotUrl,
    };
  },
});

/**
 * Filter projects by technology stack.
 * Returns projects that have at least one matching tech.
 * If techs array is empty, returns all projects.
 * Resolves screenshot URLs from Convex storage.
 */
export const filterByTech = query({
  args: { techs: v.array(v.string()) },
  handler: async (ctx, args) => {
    const allProjects = await ctx.db.query("projects").collect();

    // If no techs specified, return all projects
    if (args.techs.length === 0) {
      const projectsWithUrls = await Promise.all(
        allProjects.map(async (project) => {
          const screenshotUrl = project.screenshotId
            ? await ctx.storage.getUrl(project.screenshotId)
            : null;

          return {
            ...project,
            screenshotUrl,
          };
        })
      );

      return projectsWithUrls;
    }

    // Filter projects that have at least one matching tech
    const filtered = allProjects.filter((project) =>
      project.techStack.some((tech) => args.techs.includes(tech))
    );

    // Resolve screenshot URLs
    const projectsWithUrls = await Promise.all(
      filtered.map(async (project) => {
        const screenshotUrl = project.screenshotId
          ? await ctx.storage.getUrl(project.screenshotId)
          : null;

        return {
          ...project,
          screenshotUrl,
        };
      })
    );

    return projectsWithUrls;
  },
});
