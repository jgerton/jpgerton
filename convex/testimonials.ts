import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./auth";

/**
 * List all testimonials ordered by displayOrder (ascending).
 * Public query - no authentication required.
 * Returns non-deleted testimonials only.
 * Resolves photo URLs.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Filter non-deleted testimonials
    const filtered = testimonials.filter((t) => !t.isDeleted);

    // Resolve photo URLs
    const testimonialsWithUrls = await Promise.all(
      filtered.map(async (testimonial) => {
        const photoUrl = testimonial.photoId
          ? await ctx.storage.getUrl(testimonial.photoId)
          : null;

        return {
          ...testimonial,
          photoUrl,
        };
      })
    );

    return testimonialsWithUrls;
  },
});

/**
 * Seed the testimonials table with initial data.
 * Idempotent - only inserts if table is empty.
 * Requires authentication.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if already seeded
    const existing = await ctx.db.query("testimonials").first();
    if (existing) {
      return "Testimonials already seeded";
    }

    // Insert the 2 existing hardcoded testimonials
    await ctx.db.insert("testimonials", {
      quote:
        "Jon delivered our website ahead of schedule and it looks incredible. Our phone started ringing the week we launched.",
      name: "Sarah Mitchell",
      title: "Owner",
      company: "Northern Lights Bakery",
      displayOrder: 1,
      isDeleted: false,
      createdAt: Date.now(),
    });

    await ctx.db.insert("testimonials", {
      quote:
        "Finally, a developer who speaks plain English. Jon explained everything clearly and the site does exactly what we need.",
      name: "Marcus Chen",
      title: "Manager",
      company: "Anchorage Auto Detail",
      displayOrder: 2,
      isDeleted: false,
      createdAt: Date.now(),
    });

    return "Inserted 2 testimonials";
  },
});
