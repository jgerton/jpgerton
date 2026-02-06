---
phase: 14
plan: 01
subsystem: accessibility
tags: [wcag, a11y, semantic-html, aria, contrast, landmarks]
dependency-graph:
  requires: [phase-13]
  provides: [wcag-aa-compliance, semantic-landmarks, heading-hierarchy]
  affects: [14-02, 14-03, 14-04]
tech-stack:
  added: []
  patterns: [sr-only-headings, external-link-indicators, landmark-structure]
key-files:
  created:
    - .planning/phases/14-performance-accessibility-validation/14-01-audit-results.md
  modified:
    - app/(home)/page.tsx
    - app/services/page.tsx
    - app/about/page.tsx
    - app/contact/page.tsx
    - app/contact/thank-you/page.tsx
    - app/projects/[slug]/page.tsx
    - app/layout.tsx
    - components/navigation/site-nav.tsx
decisions:
  - id: "14-01-01"
    description: "Use sr-only h2 headings to fix hierarchy gaps rather than restructuring visible layout"
    rationale: "Preserves existing visual design while fixing heading hierarchy for screen readers"
  - id: "14-01-02"
    description: "Add minimal footer to root layout rather than creating a separate footer component"
    rationale: "Simple copyright footer is sufficient; a full footer component can be added in future if needed"
  - id: "14-01-03"
    description: "Promote 'What Clients Say' to h2 on home page instead of adding sr-only heading"
    rationale: "This heading introduces a distinct section (social proof) and logically sits at the same level as other section headings"
metrics:
  duration: "~6 minutes"
  completed: "2026-02-06"
---

# Phase 14 Plan 01: WCAG 2.1 AA Accessibility Audit Summary

Comprehensive accessibility audit and fix pass across all 7 public pages, resolving 7 critical issues and 4 warnings.

## One-Liner

WCAG 2.1 AA audit with fixes for missing `<main>` landmarks on 4 pages, heading hierarchy on 3 pages, footer landmark, nav aria-label, and external link indicators.

## What Was Done

### Task 1: Automated Accessibility Audit
Audited all 7 public pages (Home, Projects, Services, About, Contact, Project Detail, Thank You) for:
- Semantic HTML landmarks (main, nav, section, footer)
- Heading hierarchy (h1 through h4, no skips)
- ARIA attribute correctness (no redundancy, proper labels)
- Image alt text
- Form labels and controls
- Color contrast (WCAG AA: 4.5:1 text, 3:1 UI)
- External link indicators
- Keyboard accessibility patterns
- Reduced motion support

Found 7 critical issues (must fix) and 4 warnings (should fix). Documented 25+ passed checks. Full results in `14-01-audit-results.md`.

### Task 2: Fix All Identified Violations
Applied fixes for all 7 critical and 4 warning issues:

**Critical Fixes:**
1. Added `<main>` landmark to Services, About, Contact, and Thank You pages (4 pages were wrapping in `<div>`)
2. Fixed heading hierarchy on Contact page (h1 jumped to h3/h4) with sr-only h2
3. Fixed heading hierarchy on Thank You page (h1 jumped to h3/h4) with sr-only h2
4. Fixed orphan h3 on Home page by promoting "What Clients Say" to h2

**Warning Fixes:**
1. Added `<footer>` landmark with copyright text to root layout
2. Added `aria-label="Main navigation"` to SiteNav `<nav>` element
3. Added `<span className="sr-only"> (opens in new tab)</span>` to all `target="_blank"` links on Contact and Project Detail pages
4. Added `aria-hidden="true"` to decorative icons in project detail external links

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 14-01-01 | Use sr-only h2 headings to fix hierarchy gaps | Preserves existing visual design while fixing heading hierarchy for screen readers |
| 14-01-02 | Add minimal footer to root layout (not separate component) | Simple copyright footer is sufficient for landmark navigation |
| 14-01-03 | Promote "What Clients Say" to h2 on home page | This heading introduces a distinct section and logically sits at the same level as other section headings |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added footer landmark to root layout**
- **Found during:** Task 2 (W-01 audit finding)
- **Issue:** Site had no `<footer>` landmark anywhere, missing basic landmark navigation
- **Fix:** Added `<footer>` with copyright text to `app/layout.tsx`
- **Files modified:** `app/layout.tsx`
- **Commit:** ef26823

**2. [Rule 2 - Missing Critical] Added external link indicators to project detail page**
- **Found during:** Task 2
- **Issue:** Project detail page external links (View Live Site, View Source) also lacked screen reader indicators for new tab behavior
- **Fix:** Added sr-only "(opens in new tab)" text and aria-hidden on decorative icons
- **Files modified:** `app/projects/[slug]/page.tsx`
- **Commit:** ef26823

**3. [Rule 2 - Missing Critical] Fixed Thank You page (not in original audit scope)**
- **Found during:** Task 1
- **Issue:** Thank You page had same issues as Contact page (missing `<main>`, heading hierarchy skip)
- **Fix:** Added `<main>` wrapper and sr-only h2
- **Files modified:** `app/contact/thank-you/page.tsx`
- **Commit:** ef26823

## Verification

- [x] Every public page uses `<main>` as content wrapper
- [x] Heading hierarchy is logical on every page (h1 > h2 > h3, no skips)
- [x] No redundant ARIA attributes alongside semantic HTML
- [x] All images have appropriate alt text
- [x] All external links indicate they open in a new tab
- [x] `bun run build` passes
- [x] `bun run type-check` passes
- [x] No new lint warnings introduced
- [x] 14-01-audit-results.md documents all findings and fixes

## Commits

| Hash | Message |
|------|---------|
| 995ba58 | docs(14-01): run WCAG 2.1 AA accessibility audit across all public pages |
| ef26823 | fix(14-01): resolve all WCAG 2.1 AA accessibility violations across public pages |

## Next Phase Readiness

Plan 14-02 (keyboard navigation and focus trap) can proceed immediately. The landmark structure established here (main, nav with aria-label, footer) provides the foundation for proper keyboard navigation testing.

Pre-existing lint issues (11 errors, 3 warnings) exist in the codebase from before Phase 14. These are:
- `react-hooks/refs` warnings in home page (from Phase 12 intersection observer pattern)
- Unused imports in about page (CalendlyButton, CALENDLY_URL)
- Unescaped entities in testimonial-card.tsx
- Unused `request` parameter in middleware.ts

These should be cleaned up but are not blocking.
