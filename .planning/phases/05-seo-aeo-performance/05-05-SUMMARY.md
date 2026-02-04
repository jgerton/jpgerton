---
phase: "05"
plan: "05"
title: "Analytics Integration"
status: complete
subsystem: analytics
tags: [vercel-analytics, google-analytics, web-vitals, utm-tracking, conversion-tracking]
dependencies:
  requires: ["05-01", "05-03"]
  provides: [analytics-integration, web-vitals-tracking, conversion-attribution]
  affects: ["06-launch"]
tech-stack:
  added: []
  patterns: [client-component-measurement, conditional-analytics-loading, utm-passthrough]
key-files:
  created:
    - components/analytics/web-vitals.tsx
    - types/gtag.d.ts
  modified:
    - app/layout.tsx
    - components/calendly/calendly-button.tsx
decisions:
  - id: "05-05-01"
    choice: "WebVitals component measures and reports to GA4"
    why: "Unified measurement of LCP, CLS, FID, TTFB, INP with analytics integration"
  - id: "05-05-02"
    choice: "Conditional GoogleAnalytics based on NEXT_PUBLIC_GA_ID env var"
    why: "No-op in development, active only when user configures GA4"
  - id: "05-05-03"
    choice: "UTM params extracted on mount and passed to Calendly"
    why: "Track marketing attribution through booking conversion"
metrics:
  tasks: 3/3
  duration: "2min"
  completed: "2026-02-04"
---

# Phase 05 Plan 05: Analytics Integration Summary

**One-liner:** Vercel Analytics, GA4, and UTM tracking for conversion attribution across the site.

## What Was Built

### Web Vitals Measurement (`components/analytics/web-vitals.tsx`)
- Client component using `useReportWebVitals` from Next.js
- Logs Core Web Vitals to console in development mode
- Reports metrics to Google Analytics via `window.gtag` when available
- Handles CLS conversion (multiply by 1000) for consistent units

### Type Declarations (`types/gtag.d.ts`)
- Global `window.gtag` type declaration
- Supports event, config, and js commands
- Enables TypeScript support for GA4 integration

### Root Layout Analytics (`app/layout.tsx`)
- WebVitals component loads first for accurate timing measurement
- Vercel Analytics component loads automatically on Vercel
- GoogleAnalytics conditionally renders based on `NEXT_PUBLIC_GA_ID`
- All analytics load non-blocking after hydration

### Calendly UTM Passthrough (`components/calendly/calendly-button.tsx`)
- Extracts UTM params (source, medium, campaign, content, term) from URL
- Stores in state on component mount
- Passes UTM object to Calendly PopupButton
- Enables marketing attribution tracking through booking flow

## Implementation Details

**Analytics Loading Order:**
1. WebVitals - first to capture accurate timing
2. Providers/children - main app content
3. Vercel Analytics - auto-configured for Vercel deployments
4. GoogleAnalytics - conditional on NEXT_PUBLIC_GA_ID

**Environment Variables Required:**
- `NEXT_PUBLIC_GA_ID` - Google Analytics 4 Measurement ID (starts with G-)

**UTM Parameter Format:**
- `?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale`
- Calendly receives as `utmSource`, `utmMedium`, etc. (camelCase)

## Commits

| Hash | Type | Description |
|------|------|-------------|
| ed16073 | feat | Create Web Vitals measurement component |
| 6169469 | feat | Integrate Vercel Analytics and Google Analytics 4 |
| 9d6b714 | feat | Add UTM parameter passthrough to Calendly |

## Deviations from Plan

None - plan executed exactly as written.

## Success Criteria Verification

- [x] components/analytics/web-vitals.tsx exports WebVitals
- [x] types/gtag.d.ts provides window.gtag types
- [x] app/layout.tsx includes WebVitals, Analytics, and GoogleAnalytics
- [x] GoogleAnalytics conditionally renders based on NEXT_PUBLIC_GA_ID
- [x] CalendlyButton extracts UTM parameters from URL
- [x] CalendlyButton passes UTM to PopupButton
- [x] Build succeeds without errors

## Next Phase Readiness

**Prerequisites for 05-06 (Performance Optimization):**
- Analytics infrastructure in place
- Web Vitals measurement active
- Ready for performance monitoring and optimization

**User Action Required:**
- Set `NEXT_PUBLIC_GA_ID` environment variable in Vercel to enable GA4
- Create GA4 property at analytics.google.com if not exists
