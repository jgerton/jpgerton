import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "./auth";

/**
 * Create a new audit lead. Public endpoint.
 * Called when user submits email to get detailed report.
 */
export const create = mutation({
  args: {
    auditId: v.id("siteAudits"),
    name: v.string(),
    email: v.string(),
    businessName: v.optional(v.string()),
    phone: v.optional(v.string()),
    honeypot: v.string(),
  },
  handler: async (ctx, args) => {
    // Honeypot check - silently reject bots
    if (args.honeypot !== "") {
      return { success: false, error: "submission_rejected" };
    }

    // Basic validation
    if (args.name.length < 2) {
      return { success: false, error: "name_too_short" };
    }
    if (!args.email.includes("@")) {
      return { success: false, error: "invalid_email" };
    }

    // Check audit exists
    const audit = await ctx.db.get(args.auditId);
    if (!audit) {
      return { success: false, error: "audit_not_found" };
    }

    // Dedup: check if lead already exists for this audit
    const existingLeads = await ctx.db
      .query("auditLeads")
      .withIndex("by_audit", (q) => q.eq("auditId", args.auditId))
      .collect();

    if (existingLeads.length > 0) {
      return { success: true, leadId: existingLeads[0]._id, existing: true };
    }

    // Insert lead
    const leadId = await ctx.db.insert("auditLeads", {
      auditId: args.auditId,
      name: args.name,
      email: args.email,
      businessName: args.businessName,
      phone: args.phone,
      honeypot: args.honeypot,
      status: "new",
      createdAt: Date.now(),
    });

    // Schedule email notification to Jon
    await ctx.scheduler.runAfter(
      0,
      internal.auditActions.sendAuditLeadNotification,
      {
        leadId,
        name: args.name,
        email: args.email,
        businessName: args.businessName,
        url: audit.url,
        overallGrade: audit.overallGrade,
      }
    );

    return { success: true, leadId };
  },
});

/**
 * List all leads. Admin-only.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const leads = await ctx.db
      .query("auditLeads")
      .withIndex("by_created")
      .collect();

    // Enrich with audit data
    const enriched = await Promise.all(
      leads.map(async (lead) => {
        const audit = await ctx.db.get(lead.auditId);
        return {
          ...lead,
          auditUrl: audit?.url,
          auditGrade: audit?.overallGrade,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Update lead status. Admin-only.
 */
export const updateStatus = mutation({
  args: {
    id: v.id("auditLeads"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("converted"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { status: args.status });
    return true;
  },
});

/**
 * Lead stats for admin dashboard.
 */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const allLeads = await ctx.db.query("auditLeads").collect();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      total: allLeads.length,
      thisWeek: allLeads.filter((l) => l.createdAt >= weekAgo).length,
      new: allLeads.filter((l) => l.status === "new").length,
      contacted: allLeads.filter((l) => l.status === "contacted").length,
      converted: allLeads.filter((l) => l.status === "converted").length,
    };
  },
});
