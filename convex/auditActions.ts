"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

const resend = new Resend(components.resend);

// Grade mapping: score (0-100) -> letter grade
function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

// Grade to GPA points for weighted average
function gradeToGpa(grade: string): number {
  const map: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  return map[grade] ?? 0;
}

function gpaToGrade(gpa: number): string {
  if (gpa >= 3.5) return "A";
  if (gpa >= 2.5) return "B";
  if (gpa >= 1.5) return "C";
  if (gpa >= 0.5) return "D";
  return "F";
}

/**
 * Fetch Google PageSpeed Insights for a URL.
 * Returns performance, accessibility, SEO, and best-practices scores.
 */
async function fetchPageSpeed(url: string) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const categories = [
    "PERFORMANCE",
    "ACCESSIBILITY",
    "SEO",
    "BEST_PRACTICES",
  ];

  // Build URL manually for multiple category params
  let apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
  for (const cat of categories) {
    apiUrl += `&category=${cat}`;
  }
  if (apiKey) {
    apiUrl += `&key=${apiKey}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}`);
    }
    const data = await response.json();
    const categories = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    const perfScore = Math.round((categories?.performance?.score ?? 0) * 100);
    const a11yScore = Math.round(
      (categories?.accessibility?.score ?? 0) * 100
    );
    const seoScore = Math.round((categories?.seo?.score ?? 0) * 100);
    const bpScore = Math.round(
      (categories?.["best-practices"]?.score ?? 0) * 100
    );

    return {
      performance: {
        score: perfScore,
        grade: scoreToGrade(perfScore),
        lcp: audits?.["largest-contentful-paint"]?.numericValue,
        fid: audits?.["max-potential-fid"]?.numericValue,
        cls: audits?.["cumulative-layout-shift"]?.numericValue,
        fcp: audits?.["first-contentful-paint"]?.numericValue,
      },
      accessibility: {
        score: a11yScore,
        grade: scoreToGrade(a11yScore),
      },
      seo: {
        score: seoScore,
        grade: scoreToGrade(seoScore),
      },
      bestPractices: {
        score: bpScore,
        grade: scoreToGrade(bpScore),
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check Mozilla HTTP Observatory for security headers.
 */
async function fetchSecurityHeaders(url: string) {
  const hostname = new URL(url).hostname;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    // Start a new scan
    const scanResponse = await fetch(
      `https://http-observatory.security.mozilla.org/api/v1/analyze?host=${hostname}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "hidden=true&rescan=false",
        signal: controller.signal,
      }
    );

    if (!scanResponse.ok) {
      throw new Error(`Observatory API returned ${scanResponse.status}`);
    }

    let scanData = await scanResponse.json();

    // Poll until finished (max 10 attempts, 2s apart)
    let attempts = 0;
    while (scanData.state !== "FINISHED" && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const pollResponse = await fetch(
        `https://http-observatory.security.mozilla.org/api/v1/analyze?host=${hostname}`,
        { signal: controller.signal }
      );
      scanData = await pollResponse.json();
      attempts++;
    }

    if (scanData.state !== "FINISHED") {
      throw new Error("Observatory scan did not complete in time");
    }

    // Get test results
    const testsResponse = await fetch(
      `https://http-observatory.security.mozilla.org/api/v1/getScanResults?scan=${scanData.scan_id}`,
      { signal: controller.signal }
    );
    const testsData = await testsResponse.json();

    const importantHeaders = [
      "content-security-policy",
      "strict-transport-security",
      "x-content-type-options",
      "x-frame-options",
      "x-xss-protection",
      "referrer-policy",
    ];

    const headersPresent: string[] = [];
    const headersMissing: string[] = [];

    for (const header of importantHeaders) {
      const testKey = header.replace(/-/g, "");
      const test = Object.values(testsData).find(
        (t: unknown) =>
          typeof t === "object" &&
          t !== null &&
          "name" in t &&
          typeof (t as Record<string, unknown>).name === "string" &&
          ((t as Record<string, string>).name.toLowerCase().includes(header) ||
            (t as Record<string, string>).name
              .toLowerCase()
              .replace(/-/g, "")
              .includes(testKey))
      );
      if (
        test &&
        typeof test === "object" &&
        "pass" in test &&
        (test as Record<string, boolean>).pass
      ) {
        headersPresent.push(header);
      } else {
        headersMissing.push(header);
      }
    }

    // Score: percentage of headers present
    const score = Math.round(
      (headersPresent.length / importantHeaders.length) * 100
    );

    return {
      score,
      grade: scoreToGrade(score),
      headersPresent,
      headersMissing,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check HTTPS status via HEAD request.
 */
async function checkHttps(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const httpUrl = url.replace("https://", "http://");
    const response = await fetch(httpUrl, {
      method: "HEAD",
      redirect: "manual",
      signal: controller.signal,
    });

    const location = response.headers.get("location") || "";
    const redirectsToHttps = location.startsWith("https://");
    const isHttps = url.startsWith("https://");

    return { isHttps, redirectsToHttps };
  } catch {
    // If HTTP request fails, site may only be accessible via HTTPS (good)
    return { isHttps: true, redirectsToHttps: false };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generate plain-English top issues from audit results.
 */
function generateTopIssues(results: {
  performance?: { score: number; lcp?: number; cls?: number };
  accessibility?: { score: number };
  seo?: { score: number };
  security?: { score: number; headersMissing: string[] };
  bestPractices?: { score: number };
  httpsCheck?: { isHttps: boolean; redirectsToHttps: boolean };
}): string[] {
  const issues: { priority: number; text: string }[] = [];

  // Performance issues
  if (results.performance) {
    if (results.performance.score < 50) {
      issues.push({
        priority: 1,
        text: "Your site loads slowly on mobile devices, which drives away visitors and hurts your Google ranking.",
      });
    } else if (results.performance.score < 70) {
      issues.push({
        priority: 3,
        text: "Your site speed is below average. Optimizing images and reducing code bloat could improve load times.",
      });
    }
    if (results.performance.lcp && results.performance.lcp > 4000) {
      issues.push({
        priority: 2,
        text: "Your main content takes over 4 seconds to appear. Visitors expect pages to load in under 2.5 seconds.",
      });
    }
    if (results.performance.cls && results.performance.cls > 0.25) {
      issues.push({
        priority: 4,
        text: "Page elements shift around while loading, creating a frustrating experience for visitors.",
      });
    }
  }

  // Accessibility issues
  if (results.accessibility && results.accessibility.score < 70) {
    issues.push({
      priority: 2,
      text: "Your site has accessibility barriers that may prevent some visitors from using it and could pose legal risks.",
    });
  }

  // SEO issues
  if (results.seo && results.seo.score < 70) {
    issues.push({
      priority: 1,
      text: "Your site is missing key SEO elements, making it harder for potential customers to find you on Google.",
    });
  }

  // Security issues
  if (results.security && results.security.headersMissing.length > 2) {
    issues.push({
      priority: 3,
      text: `Your site is missing ${results.security.headersMissing.length} security headers that protect visitors from common web attacks.`,
    });
  }

  if (results.httpsCheck && !results.httpsCheck.isHttps) {
    issues.push({
      priority: 1,
      text: 'Your site does not use HTTPS. Browsers mark it as "Not Secure", which scares away customers.',
    });
  }

  // Best practices
  if (results.bestPractices && results.bestPractices.score < 70) {
    issues.push({
      priority: 4,
      text: "Your site doesn't follow several web development best practices, which may cause compatibility issues.",
    });
  }

  // Sort by priority and return top 3
  return issues
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
    .map((i) => i.text);
}

/**
 * Run all audit checks for a URL.
 * Uses Promise.allSettled so individual API failures don't block others.
 */
export const runAudit = internalAction({
  args: {
    auditId: v.id("siteAudits"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // Mark as running
    await ctx.runMutation(internal.auditMutations.updateAuditResults, {
      auditId: args.auditId,
      status: "partial", // Will be updated to complete/partial/failed at end
    });

    const errors: string[] = [];

    // Run all API checks concurrently
    const [pageSpeedResult, securityResult, httpsResult] =
      await Promise.allSettled([
        fetchPageSpeed(args.url),
        fetchSecurityHeaders(args.url),
        checkHttps(args.url),
      ]);

    // Extract results
    let performance, accessibility, seo, bestPractices;
    if (pageSpeedResult.status === "fulfilled") {
      performance = pageSpeedResult.value.performance;
      accessibility = pageSpeedResult.value.accessibility;
      seo = pageSpeedResult.value.seo;
      bestPractices = pageSpeedResult.value.bestPractices;
    } else {
      errors.push(`PageSpeed: ${pageSpeedResult.reason}`);
    }

    let security;
    if (securityResult.status === "fulfilled") {
      security = securityResult.value;
    } else {
      errors.push(`Security scan: ${securityResult.reason}`);
    }

    let httpsCheck;
    if (httpsResult.status === "fulfilled") {
      httpsCheck = httpsResult.value;
    } else {
      errors.push(`HTTPS check: ${httpsResult.reason}`);
    }

    // Calculate overall grade (weighted GPA)
    let overallGrade: string | undefined;
    const gradeInputs: { grade: string; weight: number }[] = [];

    if (performance)
      gradeInputs.push({ grade: performance.grade, weight: 3 });
    if (accessibility)
      gradeInputs.push({ grade: accessibility.grade, weight: 2 });
    if (seo) gradeInputs.push({ grade: seo.grade, weight: 2 });
    if (security) gradeInputs.push({ grade: security.grade, weight: 2 });
    if (bestPractices)
      gradeInputs.push({ grade: bestPractices.grade, weight: 1 });

    if (gradeInputs.length > 0) {
      const totalWeight = gradeInputs.reduce((sum, g) => sum + g.weight, 0);
      const weightedGpa =
        gradeInputs.reduce(
          (sum, g) => sum + gradeToGpa(g.grade) * g.weight,
          0
        ) / totalWeight;
      overallGrade = gpaToGrade(weightedGpa);
    }

    // Generate top issues
    const topIssues = generateTopIssues({
      performance,
      accessibility,
      seo,
      security,
      bestPractices,
      httpsCheck,
    });

    // Determine final status
    const hasAnyResult = performance || security;
    const hasAllResults = performance && security;
    const status = hasAllResults
      ? "complete"
      : hasAnyResult
        ? "partial"
        : "failed";

    // Boost security score if HTTPS redirects properly
    if (security && httpsCheck?.redirectsToHttps) {
      security.score = Math.min(100, security.score + 10);
      security.grade = scoreToGrade(security.score);
    }

    // Save results
    await ctx.runMutation(internal.auditMutations.updateAuditResults, {
      auditId: args.auditId,
      status,
      performance,
      accessibility,
      seo,
      bestPractices,
      security,
      overallGrade,
      topIssues,
      errors: errors.length > 0 ? errors : undefined,
    });
  },
});

/**
 * Send email notification when a new audit lead is captured.
 */
export const sendAuditLeadNotification = internalAction({
  args: {
    leadId: v.id("auditLeads"),
    name: v.string(),
    email: v.string(),
    businessName: v.optional(v.string()),
    url: v.string(),
    overallGrade: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      await resend.sendEmail(ctx, {
        from: "JPGerton Portfolio <notifications@jpgerton.com>",
        to: ["jon@jpgerton.com"],
        subject: `New Audit Lead: ${args.name} (Grade ${args.overallGrade || "N/A"})`,
        html: `
          <h2>New Website Audit Lead</h2>
          <p><strong>Name:</strong> ${escapeHtml(args.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(args.email)}">${escapeHtml(args.email)}</a></p>
          ${args.businessName ? `<p><strong>Business:</strong> ${escapeHtml(args.businessName)}</p>` : ""}
          <hr />
          <p><strong>Audited URL:</strong> ${escapeHtml(args.url)}</p>
          <p><strong>Overall Grade:</strong> ${args.overallGrade || "N/A"}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            Lead ID: ${args.leadId}<br />
            From jpgerton.com website audit tool
          </p>
        `,
      });
      console.log(`Audit lead notification sent for ${args.leadId}`);
    } catch (error) {
      console.error(
        `Failed to send audit lead notification for ${args.leadId}:`,
        error
      );
    }
  },
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
