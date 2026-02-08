import { z } from "zod";

export const auditLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected"),
});

export type AuditLeadFormData = z.infer<typeof auditLeadSchema>;
