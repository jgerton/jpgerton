import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Placeholder table for infrastructure verification
  healthChecks: defineTable({
    message: v.string(),
    createdAt: v.number(),
  }),

  // Projects table for portfolio display
  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    descriptionLong: v.optional(v.string()),
    screenshotId: v.optional(v.id("_storage")),
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
    displayOrder: v.number(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"])
    .index("by_order", ["displayOrder"]),

  // Contact form submissions
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    message: v.string(),
    honeypot: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("archived")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
});
