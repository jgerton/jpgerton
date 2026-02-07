import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  projectType: z.enum(["wordpress", "custom-web-app", "consulting", "other"], {
    message: "Please select a project type",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detected"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
