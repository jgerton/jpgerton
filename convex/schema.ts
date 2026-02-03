import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Placeholder table for infrastructure verification
  // Real tables (projects, contacts) added in later phases
  healthChecks: defineTable({
    message: v.string(),
    createdAt: v.number(),
  }),
});
