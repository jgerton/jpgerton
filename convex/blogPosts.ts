import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import slugify from "slugify";

/**
 * Calculate reading time in minutes based on word count.
 * Assumes 200 words per minute average reading speed.
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * List all blog posts ordered by displayOrder (ascending).
 * Includes optional status filter.
 * Returns non-deleted posts only.
 * Resolves cover image URLs and calculates reading time.
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

    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Filter non-deleted posts
    let filtered = posts.filter((post) => !post.isDeleted);

    // Apply status filter if provided
    if (args.status) {
      filtered = filtered.filter((post) => post.status === args.status);
    }

    // Resolve cover image URLs and add reading time
    const postsWithUrls = await Promise.all(
      filtered.map(async (post) => {
        const coverImageUrl = post.coverImageId
          ? await ctx.storage.getUrl(post.coverImageId)
          : null;

        return {
          ...post,
          coverImageUrl,
          readingTime: calculateReadingTime(post.content),
        };
      })
    );

    return postsWithUrls;
  },
});

/**
 * List all published blog posts ordered by publishedAt (descending).
 * Public query - no authentication required.
 * Includes optional category filter.
 * Returns non-deleted, published posts only.
 * Resolves cover image URLs and calculates reading time.
 */
export const listPublished = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("Local Business"),
        v.literal("Technical"),
        v.literal("Announcement")
      )
    ),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("blogPosts").collect();

    // Filter non-deleted, published posts
    let filtered = posts.filter(
      (post) => !post.isDeleted && post.status === "published"
    );

    // Apply category filter if provided
    if (args.category) {
      filtered = filtered.filter((post) => post.category === args.category);
    }

    // Sort by publishedAt descending (newest first)
    filtered.sort((a, b) => {
      const aTime = a.publishedAt ?? 0;
      const bTime = b.publishedAt ?? 0;
      return bTime - aTime;
    });

    // Resolve cover image URLs and add reading time
    const postsWithUrls = await Promise.all(
      filtered.map(async (post) => {
        const coverImageUrl = post.coverImageId
          ? await ctx.storage.getUrl(post.coverImageId)
          : null;

        return {
          ...post,
          coverImageUrl,
          readingTime: calculateReadingTime(post.content),
        };
      })
    );

    return postsWithUrls;
  },
});

/**
 * Get a single blog post by slug.
 * Public query - no authentication required.
 * Returns null if not found, deleted, or not published.
 * Resolves cover image URL and calculates reading time.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!post) {
      return null;
    }

    // Return null if deleted or not published (for public access)
    if (post.isDeleted || post.status !== "published") {
      return null;
    }

    const coverImageUrl = post.coverImageId
      ? await ctx.storage.getUrl(post.coverImageId)
      : null;

    return {
      ...post,
      coverImageUrl,
      readingTime: calculateReadingTime(post.content),
    };
  },
});

/**
 * Get a single blog post by ID.
 * Admin query - requires authentication.
 * Returns post regardless of status.
 * Resolves cover image URL and calculates reading time.
 */
export const getById = query({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(args.id);
    if (!post) {
      return null;
    }

    const coverImageUrl = post.coverImageId
      ? await ctx.storage.getUrl(post.coverImageId)
      : null;

    return {
      ...post,
      coverImageUrl,
      readingTime: calculateReadingTime(post.content),
    };
  },
});

/**
 * Create a new blog post as draft.
 * Auto-generates slug from title with collision detection.
 * Requires authentication.
 */
export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("Local Business"),
      v.literal("Technical"),
      v.literal("Announcement")
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

    // Check for slug collisions (includes deleted posts to prevent SEO confusion)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (!existing) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get max displayOrder
    const posts = await ctx.db.query("blogPosts").collect();
    const maxOrder = posts.reduce((max, p) => Math.max(max, p.displayOrder), 0);

    // Insert new blog post
    const postId = await ctx.db.insert("blogPosts", {
      title: args.title,
      slug,
      excerpt: args.excerpt,
      content: args.content,
      category: args.category,
      coverImageId: args.coverImageId,
      coverImageAlt: args.coverImageAlt,
      authorId: userId,
      status: "draft",
      isDeleted: false,
      displayOrder: maxOrder + 1,
      createdAt: Date.now(),
    });

    return postId;
  },
});

/**
 * Update an existing blog post.
 * Prevents slug changes on published posts.
 * Requires authentication.
 */
export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("Local Business"),
        v.literal("Technical"),
        v.literal("Announcement")
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
      throw new Error("Blog post not found");
    }

    // Prevent slug changes on published posts
    if (
      existing.status === "published" &&
      args.slug &&
      args.slug !== existing.slug
    ) {
      throw new Error("Cannot change slug after publishing");
    }

    // If slug is being changed (and post is draft), check uniqueness
    if (args.slug && args.slug !== existing.slug) {
      let slug = args.slug;
      let counter = 2;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const collision = await ctx.db
          .query("blogPosts")
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

    // Patch the blog post
    await ctx.db.patch(id, updates);

    return true;
  },
});

/**
 * Publish a blog post.
 * Validates required fields before publishing.
 * Requires authentication.
 */
export const publish = mutation({
  args: {
    id: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    if (post.isDeleted) {
      throw new Error("Cannot publish deleted post");
    }

    // Validate required fields
    if (!post.coverImageId) {
      throw new Error("Cover image required for publishing");
    }

    if (!post.coverImageAlt || post.coverImageAlt.trim() === "") {
      throw new Error("Cover image alt text required for publishing");
    }

    if (post.content.length < 100) {
      throw new Error("Content too short for publishing");
    }

    // Publish the post
    await ctx.db.patch(args.id, {
      status: "published",
      // Only set publishedAt if not already set (preserves original publish date)
      publishedAt: post.publishedAt ?? Date.now(),
    });

    return true;
  },
});

/**
 * Unpublish a blog post (transition back to draft).
 * Does not clear publishedAt timestamp.
 * Requires authentication.
 */
export const unpublish = mutation({
  args: {
    id: v.id("blogPosts"),
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
 * Soft delete a blog post.
 * Does not delete associated storage files.
 * Requires authentication.
 */
export const remove = mutation({
  args: {
    id: v.id("blogPosts"),
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
 * Restore a soft-deleted blog post.
 * Requires authentication.
 */
export const restore = mutation({
  args: {
    id: v.id("blogPosts"),
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
 * Reorder blog posts by updating their displayOrder.
 * Requires authentication.
 */
export const reorder = mutation({
  args: {
    postIds: v.array(v.id("blogPosts")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Update displayOrder for each post based on array index
    await Promise.all(
      args.postIds.map((postId, index) =>
        ctx.db.patch(postId, { displayOrder: index + 1 })
      )
    );

    return true;
  },
});

/**
 * Generate an upload URL for blog post cover images.
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
