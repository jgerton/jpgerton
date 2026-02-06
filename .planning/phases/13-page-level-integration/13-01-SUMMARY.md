---
phase: 13-page-level-integration
plan: 01
subsystem: ui
tags: [next.js, tailwind, gradients, cta, hero, conversion-flow, section-layout]

# Dependency graph
requires:
  - phase: 11-component-composition
    provides: "CTAButton, SocialProofDisplay, TestimonialCard, ProjectGrid"
  - phase: 12-animation-integration
    provides: "useIntersectionObserver, entrance animation patterns, duration tokens"
  - phase: 10-typography-color
    provides: "Fluid type tokens (text-hero, text-h2, text-h3), color system, spacing tokens"
provides:
  - "SectionBackground: reusable section wrapper with gradient/neutral/muted background variants"
  - "CTABanner: end-page conversion banner with gradient backdrop and decorative shapes"
  - "HeroWithGradient: hero section with gradient backdrop, entrance animation, dual CTAs"
  - "MidPageCTA: mid-page CTA with simple/card/inline variants"
  - "Restructured home page with 5-section conversion flow"
affects: [13-02, 13-03, services-page, about-page, projects-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Section layout composition via SectionBackground wrapper"
    - "Alternating gradient/neutral/muted backgrounds for visual rhythm"
    - "Benefit-focused CTA copy pattern"
    - "Decorative blurred circles for depth (blur-3xl, low opacity)"

key-files:
  created:
    - "components/portfolio/sections/section-background.tsx"
    - "components/portfolio/sections/cta-banner.tsx"
    - "components/portfolio/sections/hero-with-gradient.tsx"
    - "components/portfolio/sections/mid-page-cta.tsx"
  modified:
    - "components/portfolio/index.ts"
    - "app/(home)/page.tsx"

key-decisions:
  - "SectionBackground, CTABanner, MidPageCTA are Server Components (no 'use client'); only HeroWithGradient is a Client Component for animation"
  - "Home page keeps 'use client' at page level due to useQuery dependency from convex/react"
  - "Benefit-focused CTA copy: 'Get Your Business Online' instead of 'Book Your $500 Site'"
  - "Services appear before projects in home page conversion flow per CONTEXT.md decision"
  - "Placeholder testimonials used with clear comment for future replacement via admin/data layer"
  - "Featured projects limited to 3 on home page for focused showcase"

patterns-established:
  - "SectionBackground variant prop for consistent section styling across all pages"
  - "Decorative shapes: 2-3 blurred circles per decorated section (blur-3xl, opacity /5)"
  - "Home page 5-section conversion flow: Hero -> Services -> Projects -> Social Proof -> CTA Banner"
  - "Staggered card animations: base delay + (index * 100ms) for grid items"

# Metrics
duration: 4min
completed: 2026-02-05
---

# Phase 13 Plan 01: Section Components & Home Page Summary

**Reusable section layout components (SectionBackground, CTABanner, HeroWithGradient, MidPageCTA) and restructured home page with 5-section conversion flow using alternating gradient backgrounds and benefit-focused CTAs**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-06T06:05:49Z
- **Completed:** 2026-02-06T06:09:14Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created four reusable section layout components in components/portfolio/sections/
- Restructured home page with deliberate conversion flow: Hero -> Services -> Projects -> Social Proof -> CTA Banner
- Applied alternating section backgrounds (gradient/neutral/muted) for visual rhythm without explicit dividers
- Implemented entrance animations on all major sections using useIntersectionObserver
- Benefit-focused CTA copy throughout ("Get Your Business Online", "Start Your Project", "Like What You See?")

## Task Commits

Each task was committed atomically:

1. **Task 1: Create section layout components** - `6aec92c` (feat)
2. **Task 2: Restructure home page with complete conversion flow** - `6df795a` (feat)

## Files Created/Modified
- `components/portfolio/sections/section-background.tsx` - Reusable section wrapper with gradient/neutral/muted background variants and consistent py-3xl padding
- `components/portfolio/sections/cta-banner.tsx` - End-page conversion banner with gradient background, decorative blurred circles, and dual CTA support
- `components/portfolio/sections/hero-with-gradient.tsx` - Hero section with gradient backdrop, 3 decorative shapes, entrance animation via useIntersectionObserver, and dual CTAs
- `components/portfolio/sections/mid-page-cta.tsx` - Mid-page CTA component with simple (centered), card (elevated), and inline (side-by-side) variants
- `components/portfolio/index.ts` - Updated barrel export with all four section components and type exports
- `app/(home)/page.tsx` - Complete home page rewrite with 5-section conversion flow, services grid, featured projects, social proof, testimonials, and CTA banner

## Decisions Made
- **Server vs Client Component split:** SectionBackground, CTABanner, and MidPageCTA are Server Components. Only HeroWithGradient needs "use client" for useIntersectionObserver animations. This minimizes client bundle size.
- **Home page remains "use client":** Required by useQuery from convex/react for project data fetching. Future optimization could use Server Component with fetchQuery, but current architecture works correctly.
- **Benefit-focused CTA copy:** All CTAs use benefit-focused language per CONTEXT.md. Primary: "Get Your Business Online" (warm intent). Secondary: "See My Work" (outline).
- **Placeholder testimonials:** Used two realistic but placeholder testimonials with a clear code comment indicating they should be replaced via admin/data layer.
- **Gradient syntax:** Used Tailwind v4 `bg-linear-to-br` (not `bg-gradient-to-br`) for all gradient backgrounds.
- **Featured projects limit:** Sliced to first 3 projects on home page for focused showcase with "Like What You See?" mid-page CTA below.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Section layout components (SectionBackground, CTABanner, MidPageCTA) are ready for reuse in plans 13-02 (services page) and 13-03 (about/projects pages)
- Home page conversion flow complete and building successfully
- No blockers for subsequent plans

---
*Phase: 13-page-level-integration*
*Completed: 2026-02-05*
