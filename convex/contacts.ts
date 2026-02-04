import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

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
      status: "new",
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
