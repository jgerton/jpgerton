import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

/**
 * List all projects ordered by displayOrder (ascending).
 * Resolves screenshot URLs from Convex storage.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("asc")
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
 * Get a single project by ID.
 * Returns null if not found.
 * Resolves screenshot URL from Convex storage.
 * Requires authentication.
 */
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.get(args.id);
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

/**
 * Create a new project.
 * Requires authentication.
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    descriptionLong: v.optional(v.string()),
    status: v.union(
      v.literal("live"),
      v.literal("archived"),
      v.literal("in-progress")
    ),
    techStack: v.array(v.string()),
    techCategories: v.object({
      frontend: v.array(v.string()),
      backend: v.array(v.string()),
      infrastructure: v.array(v.string()),
    }),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    screenshotId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get max displayOrder to set new project at the end
    const projects = await ctx.db.query("projects").collect();
    const maxOrder = projects.reduce(
      (max, p) => Math.max(max, p.displayOrder),
      0
    );

    // Insert new project
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      descriptionLong: args.descriptionLong,
      status: args.status,
      techStack: args.techStack,
      techCategories: args.techCategories,
      liveUrl: args.liveUrl,
      githubUrl: args.githubUrl,
      featured: args.featured,
      screenshotId: args.screenshotId,
      displayOrder: maxOrder + 1,
      createdAt: Date.now(),
    });

    return projectId;
  },
});

/**
 * Update an existing project.
 * Requires authentication.
 */
export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionLong: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("live"),
        v.literal("archived"),
        v.literal("in-progress")
      )
    ),
    techStack: v.optional(v.array(v.string())),
    techCategories: v.optional(
      v.object({
        frontend: v.array(v.string()),
        backend: v.array(v.string()),
        infrastructure: v.array(v.string()),
      })
    ),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    screenshotId: v.optional(v.id("_storage")),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Extract project ID and prepare update fields
    const { id, ...updates } = args;

    // Patch the project
    await ctx.db.patch(id, updates);

    return true;
  },
});

/**
 * Delete a project.
 * Requires authentication.
 */
export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get project to check for screenshot
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Delete associated screenshot if exists
    if (project.screenshotId) {
      await ctx.storage.delete(project.screenshotId);
    }

    // Delete the project
    await ctx.db.delete(args.id);

    return true;
  },
});

/**
 * Reorder projects by updating their displayOrder.
 * Requires authentication.
 */
export const reorder = mutation({
  args: {
    projectIds: v.array(v.id("projects")),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Update displayOrder for each project based on array index
    await Promise.all(
      args.projectIds.map((projectId, index) =>
        ctx.db.patch(projectId, { displayOrder: index + 1 })
      )
    );

    return true;
  },
});

/**
 * Generate an upload URL for project screenshots.
 * Requires authentication.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});
