import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Internal mutation to save audit results back to the database.
 * Separated from auditActions.ts because "use node" files can only export actions.
 */
export const updateAuditResults = internalMutation({
  args: {
    auditId: v.id("siteAudits"),
    status: v.union(
      v.literal("complete"),
      v.literal("partial"),
      v.literal("failed")
    ),
    performance: v.optional(
      v.object({
        score: v.number(),
        grade: v.string(),
        lcp: v.optional(v.number()),
        fid: v.optional(v.number()),
        cls: v.optional(v.number()),
        fcp: v.optional(v.number()),
      })
    ),
    accessibility: v.optional(
      v.object({
        score: v.number(),
        grade: v.string(),
      })
    ),
    seo: v.optional(
      v.object({
        score: v.number(),
        grade: v.string(),
      })
    ),
    bestPractices: v.optional(
      v.object({
        score: v.number(),
        grade: v.string(),
      })
    ),
    security: v.optional(
      v.object({
        score: v.number(),
        grade: v.string(),
        headersPresent: v.array(v.string()),
        headersMissing: v.array(v.string()),
      })
    ),
    overallGrade: v.optional(v.string()),
    topIssues: v.optional(v.array(v.string())),
    errors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { auditId, ...updates } = args;
    await ctx.db.patch(auditId, {
      ...updates,
      completedAt: Date.now(),
    });
  },
});
