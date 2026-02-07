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
    status: v.union(
      v.literal("unread"),
      v.literal("read"),
      v.literal("responded"),
      v.literal("archived")
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // Blog posts for content marketing
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImageId: v.optional(v.id("_storage")),
    coverImageAlt: v.optional(v.string()),
    authorId: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    category: v.union(
      v.literal("Local Business"),
      v.literal("Technical"),
      v.literal("Announcement")
    ),
    displayOrder: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status", "publishedAt"])
    .index("by_order", ["displayOrder"]),

  // Case studies for detailed project narratives
  caseStudies: defineTable({
    title: v.string(),
    slug: v.string(),
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
    authorId: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    displayOrder: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status", "publishedAt"])
    .index("by_order", ["displayOrder"]),

  // Testimonials for social proof
  testimonials: defineTable({
    quote: v.string(),
    name: v.string(),
    title: v.string(),
    company: v.string(),
    photoId: v.optional(v.id("_storage")),
    displayOrder: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
  }).index("by_order", ["displayOrder"]),
});
