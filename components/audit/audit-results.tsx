"use client";

import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/portfolio/cta-button";
import { GradeRing } from "./grade-ring";
import { ScoreCard } from "./score-card";
import { AlertTriangle } from "lucide-react";

interface AuditData {
  status: "complete" | "partial" | "failed";
  url: string;
  overallGrade?: string;
  topIssues?: string[];
  errors?: string[];
  performance?: { score: number; grade: string };
  accessibility?: { score: number; grade: string };
  seo?: { score: number; grade: string };
  security?: { score: number; grade: string };
  bestPractices?: { score: number; grade: string };
}

interface AuditResultsProps {
  audit: AuditData;
  onGetReport: () => void;
}

export function AuditResults({ audit, onGetReport }: AuditResultsProps) {
  if (audit.status === "failed") {
    return (
      <Card elevation="sm" className="max-w-2xl mx-auto p-lg text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-md" />
        <h3 className="font-semibold text-lg mb-sm">
          We couldn&apos;t analyze that URL
        </h3>
        <p className="text-muted-foreground mb-md">
          This can happen if the site is down, blocks automated requests, or the
          URL is incorrect.
        </p>
        <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-1 mb-md">
          <li>- Make sure the URL is correct and the site is live</li>
          <li>- Try using the full URL (e.g., https://example.com)</li>
          <li>- Some sites block automated analysis tools</li>
        </ul>
        {audit.errors && audit.errors.length > 0 && (
          <p className="text-xs text-muted-foreground mt-sm">
            Details: {audit.errors.join(", ")}
          </p>
        )}
      </Card>
    );
  }

  // Calculate a weighted average score for the overall ring
  const scores: { score: number; weight: number }[] = [];
  if (audit.performance) scores.push({ score: audit.performance.score, weight: 3 });
  if (audit.accessibility)
    scores.push({ score: audit.accessibility.score, weight: 2 });
  if (audit.seo) scores.push({ score: audit.seo.score, weight: 2 });
  if (audit.security) scores.push({ score: audit.security.score, weight: 2 });
  if (audit.bestPractices)
    scores.push({ score: audit.bestPractices.score, weight: 1 });

  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const overallScore =
    totalWeight > 0
      ? Math.round(
          scores.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight
        )
      : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-lg">
      {/* Partial results notice */}
      {audit.status === "partial" && (
        <Card elevation="flat" className="p-md bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Some checks couldn&apos;t complete. Results below are based on
            available data.
          </p>
        </Card>
      )}

      {/* Overall Grade */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-sm">Overall Grade</p>
        <GradeRing
          grade={audit.overallGrade || "F"}
          score={overallScore}
          size="lg"
        />
        <p className="text-sm text-muted-foreground mt-sm">
          for {audit.url}
        </p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {audit.performance && (
          <ScoreCard
            category="performance"
            score={audit.performance.score}
            grade={audit.performance.grade}
          />
        )}
        {audit.accessibility && (
          <ScoreCard
            category="accessibility"
            score={audit.accessibility.score}
            grade={audit.accessibility.grade}
          />
        )}
        {audit.seo && (
          <ScoreCard
            category="seo"
            score={audit.seo.score}
            grade={audit.seo.grade}
          />
        )}
        {audit.security && (
          <ScoreCard
            category="security"
            score={audit.security.score}
            grade={audit.security.grade}
          />
        )}
        {audit.bestPractices && (
          <ScoreCard
            category="bestPractices"
            score={audit.bestPractices.score}
            grade={audit.bestPractices.grade}
          />
        )}
      </div>

      {/* Top Issues */}
      {audit.topIssues && audit.topIssues.length > 0 && (
        <Card elevation="flat" className="p-lg">
          <h3 className="font-semibold text-base mb-md">
            Top Issues Found
          </h3>
          <ol className="space-y-sm">
            {audit.topIssues.map((issue, index) => (
              <li key={index} className="flex gap-sm text-sm">
                <span className="font-bold text-primary shrink-0">
                  {index + 1}.
                </span>
                <span className="text-muted-foreground">{issue}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Blurred teaser + CTA */}
      <Card elevation="sm" className="p-lg text-center relative overflow-hidden">
        <div className="blur-sm select-none pointer-events-none mb-md" aria-hidden="true">
          <p className="text-sm font-medium mb-sm">Detailed Recommendations</p>
          <p className="text-xs text-muted-foreground">
            1. Optimize largest contentful paint by compressing hero images...
          </p>
          <p className="text-xs text-muted-foreground">
            2. Add missing security headers: Content-Security-Policy...
          </p>
          <p className="text-xs text-muted-foreground">
            3. Fix accessibility issues with form labels and color contrast...
          </p>
        </div>
        <div className="relative z-10">
          <h3 className="font-semibold text-lg mb-sm">
            Want specific recommendations?
          </h3>
          <p className="text-sm text-muted-foreground mb-md">
            Get a full report with prioritized action items tailored to your
            site.
          </p>
          <CTAButton intent="warm" size="lg" onClick={onGetReport}>
            Get Full Report
          </CTAButton>
        </div>
      </Card>
    </div>
  );
}
