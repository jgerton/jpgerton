import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import slugify from "slugify";

/**
 * List all case studies ordered by displayOrder (ascending).
 * Includes optional status filter.
 * Returns non-deleted case studies only.
 * Resolves cover image URLs and linked project data.
 * Requires authentication.
 */
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const caseStudies = await ctx.db
      .query("caseStudies")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Filter non-deleted case studies
    let filtered = caseStudies.filter((cs) => !cs.isDeleted);

    // Apply status filter if provided
    if (args.status) {
      filtered = filtered.filter((cs) => cs.status === args.status);
    }

    // Resolve cover image URLs and project data
    const caseStudiesWithUrls = await Promise.all(
      filtered.map(async (caseStudy) => {
        const coverImageUrl = caseStudy.coverImageId
          ? await ctx.storage.getUrl(caseStudy.coverImageId)
          : null;

        // Resolve linked project (safe: null if project deleted)
        const project = caseStudy.projectId
          ? await ctx.db.get(caseStudy.projectId)
          : null;

        return {
          ...caseStudy,
          coverImageUrl,
          project: project
            ? { _id: project._id, name: project.name, slug: project.slug }
            : null,
        };
      })
    );

    return caseStudiesWithUrls;
  },
});

/**
 * List all published case studies ordered by displayOrder (ascending).
 * Public query - no authentication required.
 * Returns non-deleted, published case studies only.
 * Resolves cover image URLs and linked project data.
 */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const caseStudies = await ctx.db.query("caseStudies").collect();

    // Filter non-deleted, published case studies
    const filtered = caseStudies.filter(
      (cs) => !cs.isDeleted && cs.status === "published"
    );

    // Sort by displayOrder ascending
    filtered.sort((a, b) => a.displayOrder - b.displayOrder);

    // Resolve cover image URLs and project data
    const caseStudiesWithUrls = await Promise.all(
      filtered.map(async (caseStudy) => {
        const coverImageUrl = caseStudy.coverImageId
          ? await ctx.storage.getUrl(caseStudy.coverImageId)
          : null;

        // Resolve linked project (safe: null if project deleted)
        const project = caseStudy.projectId
          ? await ctx.db.get(caseStudy.projectId)
          : null;

        return {
          ...caseStudy,
          coverImageUrl,
          project: project
            ? { _id: project._id, name: project.name, slug: project.slug }
            : null,
        };
      })
    );

    return caseStudiesWithUrls;
  },
});

/**
 * Get a single case study by slug.
 * Public query - no authentication required.
 * Returns null if not found, deleted, or not published.
 * Resolves cover image URL and linked project data.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const caseStudy = await ctx.db
      .query("caseStudies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!caseStudy) {
      return null;
    }

    // Return null if deleted or not published (for public access)
    if (caseStudy.isDeleted || caseStudy.status !== "published") {
      return null;
    }

    const coverImageUrl = caseStudy.coverImageId
      ? await ctx.storage.getUrl(caseStudy.coverImageId)
      : null;

    // Resolve linked project (safe: null if project deleted)
    const project = caseStudy.projectId
      ? await ctx.db.get(caseStudy.projectId)
      : null;

    return {
      ...caseStudy,
      coverImageUrl,
      project: project
        ? { _id: project._id, name: project.name, slug: project.slug }
        : null,
    };
  },
});

/**
 * Get all published case studies for a given project.
 * Public query - no authentication required.
 * Returns non-deleted, published case studies only.
 * Resolves cover image URLs.
 */
export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const caseStudies = await ctx.db
      .query("caseStudies")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Filter non-deleted, published case studies
    const filtered = caseStudies.filter(
      (cs) => !cs.isDeleted && cs.status === "published"
    );

    // Sort by displayOrder ascending
    filtered.sort((a, b) => a.displayOrder - b.displayOrder);

    // Resolve cover image URLs
    const caseStudiesWithUrls = await Promise.all(
      filtered.map(async (caseStudy) => {
        const coverImageUrl = caseStudy.coverImageId
          ? await ctx.storage.getUrl(caseStudy.coverImageId)
          : null;

        return {
          ...caseStudy,
          coverImageUrl,
        };
      })
    );

    return caseStudiesWithUrls;
  },
});

/**
 * Get a single case study by ID.
 * Admin query - requires authentication.
 * Returns case study regardless of status.
 * Resolves cover image URL and linked project data.
 */
export const getById = query({
  args: { id: v.id("caseStudies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const caseStudy = await ctx.db.get(args.id);
    if (!caseStudy) {
      return null;
    }

    const coverImageUrl = caseStudy.coverImageId
      ? await ctx.storage.getUrl(caseStudy.coverImageId)
      : null;

    // Resolve linked project (safe: null if project deleted)
    const project = caseStudy.projectId
      ? await ctx.db.get(caseStudy.projectId)
      : null;

    return {
      ...caseStudy,
      coverImageUrl,
      project: project
        ? { _id: project._id, name: project.name, slug: project.slug }
        : null,
    };
  },
});

/**
 * Create a new case study as draft.
 * Auto-generates slug from title with collision detection.
 * Requires authentication.
 */
export const create = mutation({
  args: {
    title: v.string(),
    projectId: v.optional(v.id("projects")),
    problemHeading: v.string(),
    problemContent: v.string(),
    solutionHeading: v.string(),
    solutionContent: v.string(),
    resultsHeading: v.string(),
    resultsContent: v.string(),
    metrics: v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      })
    ),
    coverImageId: v.optional(v.id("_storage")),
    coverImageAlt: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Generate slug from title or use provided slug
    const baseSlug = args.slug ?? slugify(args.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 2;

    // Check for slug collisions (includes deleted case studies to prevent SEO confusion)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await ctx.db
        .query("caseStudies")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (!existing) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get max displayOrder
    const caseStudies = await ctx.db.query("caseStudies").collect();
    const maxOrder = caseStudies.reduce(
      (max, cs) => Math.max(max, cs.displayOrder),
      0
    );

    // Insert new case study
    const caseStudyId = await ctx.db.insert("caseStudies", {
      title: args.title,
      slug,
      projectId: args.projectId,
      problemHeading: args.problemHeading,
      problemContent: args.problemContent,
      solutionHeading: args.solutionHeading,
      solutionContent: args.solutionContent,
      resultsHeading: args.resultsHeading,
      resultsContent: args.resultsContent,
      metrics: args.metrics,
      coverImageId: args.coverImageId,
      coverImageAlt: args.coverImageAlt,
      authorId: userId,
      status: "draft",
      isDeleted: false,
      displayOrder: maxOrder + 1,
      createdAt: Date.now(),
    });

    return caseStudyId;
  },
});

/**
 * Update an existing case study.
 * Prevents slug changes on published case studies.
 * Requires authentication.
 */
export const update = mutation({
  args: {
    id: v.id("caseStudies"),
    title: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    problemHeading: v.optional(v.string()),
    problemContent: v.optional(v.string()),
    solutionHeading: v.optional(v.string()),
    solutionContent: v.optional(v.string()),
    resultsHeading: v.optional(v.string()),
    resultsContent: v.optional(v.string()),
    metrics: v.optional(
      v.array(
        v.object({
          label: v.string(),
          value: v.string(),
        })
      )
    ),
    coverImageId: v.optional(v.id("_storage")),
    coverImageAlt: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Case study not found");
    }

    // Prevent slug changes on published case studies
    if (
      existing.status === "published" &&
      args.slug &&
      args.slug !== existing.slug
    ) {
      throw new Error("Cannot change slug after publishing");
    }

    // If slug is being changed (and case study is draft), check uniqueness
    if (args.slug && args.slug !== existing.slug) {
      let slug = args.slug;
      let counter = 2;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const collision = await ctx.db
          .query("caseStudies")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first();

        if (!collision) {
          break;
        }

        slug = `${args.slug}-${counter}`;
        counter++;
      }

      args.slug = slug;
    }

    // Extract ID and prepare update fields
    const { id, ...updates } = args;

    // Patch the case study
    await ctx.db.patch(id, updates);

    return true;
  },
});

/**
 * Publish a case study.
 * Validates required fields before publishing.
 * Requires authentication.
 */
export const publish = mutation({
  args: {
    id: v.id("caseStudies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const caseStudy = await ctx.db.get(args.id);
    if (!caseStudy) {
      throw new Error("Case study not found");
    }

    if (caseStudy.isDeleted) {
      throw new Error("Cannot publish deleted case study");
    }

    // Validate required fields
    if (!caseStudy.coverImageId) {
      throw new Error("Cover image required for publishing");
    }

    if (!caseStudy.coverImageAlt || caseStudy.coverImageAlt.trim() === "") {
      throw new Error("Cover image alt text required for publishing");
    }

    if (caseStudy.metrics.length < 1) {
      throw new Error("At least one metric required for publishing");
    }

    // Publish the case study
    await ctx.db.patch(args.id, {
      status: "published",
      // Only set publishedAt if not already set (preserves original publish date)
      publishedAt: caseStudy.publishedAt ?? Date.now(),
    });

    return true;
  },
});

/**
 * Unpublish a case study (transition back to draft).
 * Does not clear publishedAt timestamp.
 * Requires authentication.
 */
export const unpublish = mutation({
  args: {
    id: v.id("caseStudies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: "draft",
    });

    return true;
  },
});

/**
 * Soft delete a case study.
 * Does not delete associated storage files.
 * Requires authentication.
 */
export const remove = mutation({
  args: {
    id: v.id("caseStudies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      isDeleted: true,
    });

    return true;
  },
});

/**
 * Restore a soft-deleted case study.
 * Requires authentication.
 */
export const restore = mutation({
  args: {
    id: v.id("caseStudies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      isDeleted: false,
    });

    return true;
  },
});

/**
 * Reorder case studies by updating their displayOrder.
 * Requires authentication.
 */
export const reorder = mutation({
  args: {
    caseStudyIds: v.array(v.id("caseStudies")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Update displayOrder for each case study based on array index
    await Promise.all(
      args.caseStudyIds.map((caseStudyId, index) =>
        ctx.db.patch(caseStudyId, { displayOrder: index + 1 })
      )
    );

    return true;
  },
});

/**
 * Generate an upload URL for case study cover images.
 * Requires authentication.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});
