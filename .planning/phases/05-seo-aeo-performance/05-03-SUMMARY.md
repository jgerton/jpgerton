---
phase: 05-seo-aeo-performance
plan: 03
subsystem: seo
tags: [metadata, next.js, generateMetadata, openGraph, seo]

# Dependency graph
requires:
  - phase: 05-01
    provides: "Site config and root layout metadata base"
provides:
  - "Per-page SEO metadata for all public pages"
  - "Dynamic generateMetadata for project detail pages"
  - "Route group pattern for client component metadata"
affects: [phase-06, future-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Layout.tsx exports metadata for 'use client' pages"
    - "Route groups for home page metadata isolation"
    - "generateMetadata with try-catch for dynamic pages"

key-files:
  created:
    - "app/(home)/layout.tsx"
    - "app/services/layout.tsx"
    - "app/contact/layout.tsx"
    - "app/about/layout.tsx"
    - "app/projects/layout.tsx"
  modified:
    - "app/(home)/page.tsx (moved from app/page.tsx)"
    - "app/projects/[slug]/page.tsx"
    - "app/contact/thank-you/page.tsx"

key-decisions:
  - "Use layout.tsx pattern for client component pages that need metadata"
  - "Move home page to (home) route group for isolated metadata"
  - "Add try-catch in generateMetadata for graceful fallback"

patterns-established:
  - "Client component metadata: Create layout.tsx in route folder that exports metadata"
  - "Dynamic metadata: generateMetadata with data fetching and error handling"

# Metrics
duration: 4min
completed: 2026-02-04
---

# Phase 05 Plan 03: Per-Page Metadata Summary

**Per-page SEO metadata using layout.tsx pattern for client components and generateMetadata for dynamic project pages**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-04T13:56:33Z
- **Completed:** 2026-02-04T14:00:27Z
- **Tasks:** 3
- **Files modified:** 8 (3 modified, 5 created)

## Accomplishments

- Added unique SEO metadata to all 7 public pages
- Implemented layout.tsx pattern for client component pages (services, contact, about, projects, home)
- Added dynamic generateMetadata to project detail pages with Open Graph images
- Thank-you page has robots: noindex to prevent indexing

## Task Commits

Each task was committed atomically:

1. **Task 1: Add metadata to static pages** - `fdb1f6b` (feat)
2. **Task 2: Add metadata to home and projects pages** - `40765b7` (feat)
3. **Task 3: Add dynamic metadata to project detail page** - `a0361fa` (feat)

## Files Created/Modified

### Created
- `app/(home)/layout.tsx` - Home page metadata with full title
- `app/(home)/page.tsx` - Home page moved to route group
- `app/services/layout.tsx` - Services page SEO metadata
- `app/contact/layout.tsx` - Contact page SEO metadata
- `app/about/layout.tsx` - About page SEO metadata
- `app/projects/layout.tsx` - Projects index SEO metadata

### Modified
- `app/projects/[slug]/page.tsx` - Added generateMetadata for dynamic SEO
- `app/contact/thank-you/page.tsx` - Added static metadata with noindex

## Decisions Made

1. **Layout.tsx pattern for client components**: Next.js cannot export metadata from "use client" pages. Created separate layout.tsx files for each route that exports metadata while the page.tsx handles client-side functionality.

2. **Route group for home page**: Created `(home)` route group to give home page its own layout.tsx without affecting the URL path. This allows the home page to have a custom full title ("Jon Gerton - Web Design & Development") instead of using the default template.

3. **Error handling in generateMetadata**: Added try-catch in the project detail generateMetadata to gracefully handle cases where Convex is unavailable during build.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Client component metadata pattern**
- **Found during:** Task 1 (Static pages metadata)
- **Issue:** Plan suggested adding metadata exports directly to "use client" pages, but Next.js ignores metadata exports from client components
- **Fix:** Created layout.tsx files for each route to export metadata server-side
- **Files modified:** Created app/services/layout.tsx, app/contact/layout.tsx, app/about/layout.tsx
- **Verification:** Build succeeds, metadata appears in rendered HTML
- **Committed in:** fdb1f6b (Task 1 commit)

**2. [Rule 3 - Blocking] Home page metadata isolation**
- **Found during:** Task 2 (Home page metadata)
- **Issue:** Home page at app/page.tsx couldn't have separate metadata from root layout
- **Fix:** Moved home page to app/(home)/page.tsx route group with dedicated layout.tsx
- **Files modified:** app/page.tsx -> app/(home)/page.tsx, created app/(home)/layout.tsx
- **Verification:** Build succeeds, home page has full title not template
- **Committed in:** 40765b7 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both blocking issues)
**Impact on plan:** Necessary architectural adjustments for Next.js metadata system. No scope creep.

## Issues Encountered

- Type errors from stale .next cache after adding new layouts - resolved by clearing .next directory
- Intermittent build error "required-server-files.json not found" - resolved on retry (likely Windows file system timing issue)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All public pages now have unique SEO metadata
- Dynamic project pages generate metadata from database content
- Open Graph images configured for social sharing
- Ready for further SEO enhancements (structured data already done in 05-02)

---
*Phase: 05-seo-aeo-performance*
*Completed: 2026-02-04*
