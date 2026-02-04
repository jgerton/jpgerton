import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "./auth";

/**
 * Create a new contact submission.
 * Public endpoint - no authentication required.
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    message: v.string(),
    honeypot: v.string(),
  },
  handler: async (ctx, args) => {
    // Honeypot check - reject if filled (bot detection)
    if (args.honeypot !== "") {
      // Silently reject - don't give bots feedback
      return { success: false, error: "submission_rejected" };
    }

    // Basic server-side validation
    if (args.name.length < 2) {
      return { success: false, error: "name_too_short" };
    }
    if (!args.email.includes("@")) {
      return { success: false, error: "invalid_email" };
    }
    if (args.message.length < 10) {
      return { success: false, error: "message_too_short" };
    }

    // Store in database
    const contactId = await ctx.db.insert("contactSubmissions", {
      name: args.name,
      email: args.email,
      projectType: args.projectType,
      message: args.message,
      honeypot: args.honeypot,
      status: "unread",
      createdAt: Date.now(),
    });

    // Schedule email notification (runs after mutation commits)
    await ctx.scheduler.runAfter(0, internal.actions.sendContactNotification, {
      contactId,
      name: args.name,
      email: args.email,
      projectType: args.projectType,
      message: args.message,
    });

    return { success: true, contactId };
  },
});

/**
 * List all non-archived contact submissions.
 * Requires authentication.
 * Sorted by status priority (unread, read, responded) then by createdAt descending.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get all non-archived contacts
    const contacts = await ctx.db
      .query("contactSubmissions")
      .filter((q) => q.neq(q.field("status"), "archived"))
      .collect();

    // Define status priority for sorting
    const statusPriority: Record<string, number> = {
      unread: 1,
      read: 2,
      responded: 3,
    };

    // Sort by status priority, then by createdAt descending
    const sorted = contacts.sort((a, b) => {
      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt - a.createdAt;
    });

    return sorted;
  },
});

/**
 * List archived contact submissions.
 * Requires authentication.
 * Sorted by createdAt descending.
 */
export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get archived contacts
    const contacts = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "archived"))
      .collect();

    // Sort by createdAt descending (newest first)
    return contacts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single contact submission by ID.
 * Requires authentication.
 */
export const getById = query({
  args: {
    id: v.id("contactSubmissions"),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.get(args.id);
  },
});

/**
 * Update the status of a contact submission.
 * Requires authentication.
 */
export const updateStatus = mutation({
  args: {
    id: v.id("contactSubmissions"),
    status: v.union(
      v.literal("read"),
      v.literal("responded"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Update the contact status
    await ctx.db.patch(args.id, { status: args.status });

    return true;
  },
});

/**
 * Archive multiple contact submissions in bulk.
 * Requires authentication.
 */
export const archiveBulk = mutation({
  args: {
    ids: v.array(v.id("contactSubmissions")),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Archive all contacts in parallel
    await Promise.all(
      args.ids.map((id) => ctx.db.patch(id, { status: "archived" }))
    );

    return args.ids.length;
  },
});
