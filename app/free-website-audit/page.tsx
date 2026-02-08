"use client";

import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
import { CTABanner } from "@/components/portfolio/sections/cta-banner";
import { AuditUrlForm } from "@/components/audit/audit-url-form";
import { AuditProgress } from "@/components/audit/audit-progress";
import { AuditResults } from "@/components/audit/audit-results";
import { AuditLeadForm } from "@/components/audit/audit-lead-form";
import { AuditThankYou } from "@/components/audit/audit-thank-you";
import type { Id } from "@/convex/_generated/dataModel";

type Step = "input" | "loading" | "results" | "lead-capture" | "thank-you";

export default function FreeWebsiteAuditPage() {
  const [step, setStep] = useState<Step>("input");
  const [auditId, setAuditId] = useState<Id<"siteAudits"> | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState("");

  // Reactive query: auto-updates when audit status changes in Convex
  const audit = useQuery(
    api.siteAudits.getAudit,
    auditId ? { auditId } : "skip"
  );

  const handleAuditStarted = useCallback(
    (id: Id<"siteAudits">, url: string) => {
      setAuditId(id);
      setSubmittedUrl(url);
      setStep("loading");
    },
    []
  );

  const handleLoadingComplete = useCallback(() => {
    if (
      (audit?.status === "complete" || audit?.status === "partial") &&
      audit?.overallGrade
    ) {
      setStep("results");
    } else if (audit?.status === "failed") {
      setStep("results");
    }
  }, [audit?.status, audit?.overallGrade]);

  const handleTimeout = useCallback(() => {
    // Reset to input step on timeout
    setStep("input");
    setAuditId(null);
    setSubmittedUrl("");
  }, []);

  const handleGetReport = useCallback(() => {
    setStep("lead-capture");
  }, []);

  const handleLeadSuccess = useCallback(() => {
    setStep("thank-you");
  }, []);

  const handleAuditAnother = useCallback(() => {
    setStep("input");
    setAuditId(null);
    setSubmittedUrl("");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - always visible */}
      <SectionBackground variant="gradient">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-h1 leading-tight mb-md">
            Free Website Health Check
          </h1>
          <p className="text-lg text-muted-foreground mb-xl">
            See how your website scores on performance, SEO, security, and
            accessibility. Get instant results in under 30 seconds.
          </p>
        </div>

        {/* Step Content */}
        <div className="mt-lg">
          {step === "input" && (
            <AuditUrlForm onAuditStarted={handleAuditStarted} />
          )}

          {step === "loading" && (
            <AuditProgress
              status={audit?.status}
              onComplete={handleLoadingComplete}
              onTimeout={handleTimeout}
            />
          )}
        </div>
      </SectionBackground>

      {/* Results / Lead Capture / Thank You - below hero */}
      {step === "results" && audit && (
        <SectionBackground variant="neutral">
          <AuditResults
            audit={{
              status: audit.status as "complete" | "partial" | "failed",
              url: submittedUrl,
              overallGrade: audit.overallGrade,
              topIssues: audit.topIssues,
              errors: audit.errors,
              performance: audit.performance,
              accessibility: audit.accessibility,
              seo: audit.seo,
              security: audit.security,
              bestPractices: audit.bestPractices,
            }}
            onGetReport={handleGetReport}
          />
        </SectionBackground>
      )}

      {step === "lead-capture" && auditId && (
        <SectionBackground variant="neutral">
          <AuditLeadForm
            auditId={auditId}
            overallGrade={audit?.overallGrade}
            onSuccess={handleLeadSuccess}
          />
        </SectionBackground>
      )}

      {step === "thank-you" && (
        <SectionBackground variant="neutral">
          <AuditThankYou onAuditAnother={handleAuditAnother} />
        </SectionBackground>
      )}

      {/* Bottom CTA */}
      <CTABanner
        headline="Need Help Fixing These Issues?"
        description="I build fast, accessible, and SEO-friendly websites for local businesses. Let's talk about improving your online presence."
        primaryCta={{
          text: "Get Your Business Online",
          href: "/services",
          intent: "warm",
        }}
        secondaryCta={{
          text: "See My Work",
          href: "/projects",
        }}
      />
    </main>
  );
}
