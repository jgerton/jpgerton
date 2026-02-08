"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import {
  auditLeadSchema,
  type AuditLeadFormData,
} from "@/lib/validations/audit-lead-schema";
import { trackFormSubmit } from "@/lib/analytics";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/portfolio/cta-button";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { CheckCircle2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface AuditLeadFormProps {
  auditId: Id<"siteAudits">;
  overallGrade?: string;
  onSuccess: () => void;
}

const valueProps = [
  "Specific fix recommendations for your site",
  "Priority action items ranked by impact",
  "Performance optimization checklist",
  "Security hardening steps",
];

export function AuditLeadForm({
  auditId,
  overallGrade,
  onSuccess,
}: AuditLeadFormProps) {
  const { toast } = useToast();
  const createLead = useMutation(api.auditLeads.create);

  const form = useForm<AuditLeadFormData>({
    resolver: zodResolver(auditLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      phone: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: AuditLeadFormData) {
    try {
      const result = await createLead({
        auditId,
        name: data.name,
        email: data.email,
        businessName: data.businessName || undefined,
        phone: data.phone || undefined,
        honeypot: data.honeypot,
      });

      if (result.success) {
        trackFormSubmit("audit_lead", {
          project_type: `grade_${overallGrade || "unknown"}`,
        });
        onSuccess();
      } else {
        toast({
          title: "Submission failed",
          description: "Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Audit lead form error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-lg">
      {/* Value props */}
      <Card elevation="flat" className="p-lg">
        <h3 className="font-semibold text-base mb-md">
          Your full report includes:
        </h3>
        <ul className="space-y-sm">
          {valueProps.map((prop) => (
            <li key={prop} className="flex items-start gap-sm text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>{prop}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Form */}
      <Card elevation="sm" className="p-lg">
        <h3 className="font-semibold text-lg mb-xs text-center">
          Get Your Full Report
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-lg">
          We&apos;ll email you a detailed analysis with actionable
          recommendations.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-md"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@business.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Business Name{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <HoneypotField control={form.control} />

            <CTAButton
              type="submit"
              intent="warm"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Sending..."
                : "Send My Report"}
            </CTAButton>

            <p className="text-xs text-muted-foreground text-center">
              No spam, ever. Your info is only used to send the report.
            </p>
          </form>
        </Form>
      </Card>
    </div>
  );
}
