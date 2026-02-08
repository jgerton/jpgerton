import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "./auth";

/**
 * Normalize a URL for dedup: lowercase, strip trailing slash, strip www.
 */
function normalizeUrl(url: string): string {
  try {
    let normalized = url.trim().toLowerCase();
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "https://" + normalized;
    }
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./, "");
    return `${parsed.protocol}//${host}${parsed.pathname.replace(/\/$/, "")}`;
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * Start a new site audit. Public endpoint.
 * Checks 24h dedup cache, then schedules the audit action.
 */
export const startAudit = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const normalized = normalizeUrl(args.url);

    // Check for existing audit in last 24 hours
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const existing = await ctx.db
      .query("siteAudits")
      .withIndex("by_url", (q) => q.eq("normalizedUrl", normalized))
      .collect();

    const recentAudit = existing.find(
      (a) => a.createdAt >= dayAgo && a.status !== "failed"
    );

    if (recentAudit) {
      return { auditId: recentAudit._id, cached: true };
    }

    // Create new audit record
    const auditId = await ctx.db.insert("siteAudits", {
      url: args.url.trim(),
      normalizedUrl: normalized,
      status: "pending",
      createdAt: Date.now(),
    });

    // Schedule the audit action
    await ctx.scheduler.runAfter(0, internal.auditActions.runAudit, {
      auditId,
      url: normalized,
    });

    return { auditId, cached: false };
  },
});

/**
 * Get audit results by ID. Public query for frontend polling.
 * Convex reactivity auto-updates the frontend when data changes.
 */
export const getAudit = query({
  args: {
    auditId: v.id("siteAudits"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.auditId);
  },
});

/**
 * List all audits. Admin-only.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const audits = await ctx.db
      .query("siteAudits")
      .withIndex("by_created")
      .collect();

    return audits.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Audit stats for admin dashboard.
 */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const allAudits = await ctx.db.query("siteAudits").collect();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      total: allAudits.length,
      thisWeek: allAudits.filter((a) => a.createdAt >= weekAgo).length,
      completed: allAudits.filter((a) => a.status === "complete").length,
      partial: allAudits.filter((a) => a.status === "partial").length,
      failed: allAudits.filter((a) => a.status === "failed").length,
    };
  },
});
