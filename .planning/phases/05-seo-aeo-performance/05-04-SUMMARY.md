---
phase: 05-seo-aeo-performance
plan: 04
subsystem: seo
tags: [sitemap, robots, faq, schema-integration, aeo]

# Dependency graph
requires:
  - phase: 05-02
    provides: [JSON-LD schema components]
provides:
  - Dynamic sitemap.xml with static and project pages
  - robots.txt blocking admin, api, login routes
  - FAQ section on services page with schema markup
  - Schema integration across home, about, and services pages
affects: [05-05, 05-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Next.js MetadataRoute for sitemap and robots
    - Graceful Convex fallback during build

key-files:
  created:
    - app/sitemap.ts
    - app/robots.ts
  modified:
    - app/services/page.tsx
    - app/(home)/page.tsx
    - app/about/page.tsx

key-decisions:
  - "Sitemap uses fetchQuery with try/catch for graceful Convex unavailability during build"
  - "Home page at app/(home)/page.tsx route group, not app/page.tsx"
  - "FAQ section placed between pricing cards and CTA for natural reading flow"

patterns-established:
  - "MetadataRoute pattern: export async function for dynamic, sync function for static"
  - "Schema placement: contextually relevant pages (LocalBusiness on home, Person on about)"

# Metrics
duration: 5min
completed: 2026-02-04
---

# Phase 5 Plan 4: Sitemap, Robots & Schema Integration Summary

**Dynamic sitemap and robots.txt with FAQ section and schema components integrated across public pages for SEO and AI discoverability**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-04
- **Completed:** 2026-02-04
- **Tasks:** 3
- **Files created:** 2
- **Files modified:** 3

## Accomplishments
- Created dynamic sitemap.ts with static pages and Convex project URLs
- Created robots.ts blocking /admin, /api, /login with sitemap reference
- Added 6 FAQ questions to services page with faq-answer CSS class for speakable
- Integrated FAQSchema and ServiceSchema on services page
- Integrated LocalBusinessSchema on home page
- Integrated PersonSchema on about page

## Task Commits

Each task was committed atomically:

1. **Task 1: Create dynamic sitemap and robots.txt** - `b29a48d` (feat)
2. **Task 2: Add FAQ section to services page with schema markup** - `c5fe02e` (feat)
3. **Task 3: Add schema components to home and about pages** - `54b24f8` (feat)

## Files Created
- `app/sitemap.ts` - Dynamic sitemap generation with static pages and Convex projects
- `app/robots.ts` - Robots.txt configuration with disallow rules

## Files Modified
- `app/services/page.tsx` - Added FAQ section, FAQSchema, and ServiceSchema
- `app/(home)/page.tsx` - Added LocalBusinessSchema
- `app/about/page.tsx` - Added PersonSchema

## Decisions Made
- Sitemap uses try/catch around Convex fetchQuery to handle build-time unavailability
- FAQ section uses faq-answer CSS class matching speakable cssSelector in FAQSchema
- Home page lives at app/(home)/page.tsx route group (discovered during execution)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Home page path correction**
- **Found during:** Task 3
- **Issue:** Plan referenced app/page.tsx but home page is at app/(home)/page.tsx
- **Fix:** Updated correct path for home page integration
- **Files modified:** app/(home)/page.tsx
- **Commit:** 54b24f8

## Issues Encountered

**Next.js 16 build type generation race condition**
- Build initially failed due to .next/types files not existing
- Resolved by running dev server briefly to generate types, then building
- This is a known transient issue with Next.js 16 Turbopack

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Sitemap.xml available at /sitemap.xml for search engine crawlers
- Robots.txt available at /robots.txt with sitemap reference
- All public pages now have appropriate JSON-LD schema markup
- FAQ content ready for AI assistant discoverability via speakable markup
- Ready for 05-05 (Image Optimization) and 05-06 (Core Web Vitals)

---
*Phase: 05-seo-aeo-performance*
*Completed: 2026-02-04*
