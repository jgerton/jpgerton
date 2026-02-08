"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import {
  auditUrlSchema,
  type AuditUrlFormData,
} from "@/lib/validations/audit-schema";
import { trackCTAClick } from "@/lib/analytics";
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
import type { Id } from "@/convex/_generated/dataModel";

interface AuditUrlFormProps {
  onAuditStarted: (auditId: Id<"siteAudits">, url: string) => void;
}

export function AuditUrlForm({ onAuditStarted }: AuditUrlFormProps) {
  const { toast } = useToast();
  const startAudit = useMutation(api.siteAudits.startAudit);

  const form = useForm<AuditUrlFormData>({
    resolver: zodResolver(auditUrlSchema),
    defaultValues: {
      url: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: AuditUrlFormData) {
    try {
      const url = data.url.startsWith("http")
        ? data.url
        : `https://${data.url}`;

      trackCTAClick("analyze_website", { page_section: "audit_form" });

      const result = await startAudit({ url });
      onAuditStarted(result.auditId, url);
    } catch (error) {
      console.error("Audit start error:", error);
      toast({
        title: "Something went wrong",
        description: "Please check the URL and try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card elevation="sm" className="max-w-xl mx-auto p-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-md">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Enter your website URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="example.com"
                    className="text-base h-12"
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
              ? "Starting Analysis..."
              : "Analyze My Site"}
          </CTAButton>
        </form>
      </Form>
    </Card>
  );
}
