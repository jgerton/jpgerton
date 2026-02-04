"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

const resend = new Resend(components.resend);

export const sendContactNotification = internalAction({
  args: {
    contactId: v.id("contactSubmissions"),
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const projectTypeLabels: Record<string, string> = {
      wordpress: "$500 WordPress Site",
      "custom-web-app": "Custom Web App",
      consulting: "Team Growth Accelerator",
      other: "Other Inquiry",
    };

    const projectLabel = projectTypeLabels[args.projectType] || args.projectType;

    try {
      await resend.sendEmail(ctx, {
        from: "JPGerton Portfolio <notifications@jpgerton.com>",
        to: ["jon@jpgerton.com"], // Replace with actual email
        subject: `New ${projectLabel} inquiry from ${args.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(args.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(args.email)}">${escapeHtml(args.email)}</a></p>
          <p><strong>Project Type:</strong> ${escapeHtml(projectLabel)}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(args.message)}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            Submission ID: ${args.contactId}<br />
            Sent from jpgerton.com contact form
          </p>
        `,
      });

      console.log(`Email sent for contact ${args.contactId}`);
    } catch (error) {
      console.error(`Failed to send email for contact ${args.contactId}:`, error);
      // Don't throw - email failure shouldn't fail the contact submission
    }
  },
});

// Simple HTML escaping to prevent XSS in email
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
