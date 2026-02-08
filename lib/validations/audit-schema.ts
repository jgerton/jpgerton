import { z } from "zod";

export const auditUrlSchema = z.object({
  url: z
    .string()
    .min(1, "Please enter a website URL")
    .refine(
      (val) => {
        try {
          const urlStr = val.startsWith("http") ? val : `https://${val}`;
          const parsed = new URL(urlStr);
          return parsed.hostname.includes(".");
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid website URL (e.g., example.com)" }
    ),
  honeypot: z.string().max(0, "Bot detected"),
});

export type AuditUrlFormData = z.infer<typeof auditUrlSchema>;
