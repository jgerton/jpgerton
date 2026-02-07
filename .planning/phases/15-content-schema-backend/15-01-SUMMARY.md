---
phase: 15-content-schema-backend
plan: 01
subsystem: database
tags: [convex, schema, content-management, blog, case-studies, slugify, dayjs, react-markdown]

# Dependency graph
requires:
  - phase: 02-backend-foundation
    provides: Convex setup and schema patterns
provides:
  - blogPosts table with draft/publish workflow
  - caseStudies table with project linking
  - Content layer dependencies (slugify, dayjs, react-markdown, remark-gfm)
affects: [15-02, 16-admin-cms, 17-frontend-display]

# Tech tracking
tech-stack:
  added: [slugify, dayjs, react-markdown, remark-gfm]
  patterns: [soft-delete with isDeleted flag, compound status+publishedAt indexes, optional cover images for drafts]

key-files:
  created: []
  modified: [convex/schema.ts, package.json]

key-decisions:
  - "coverImageId and coverImageAlt are optional to allow draft creation without images"
  - "Category field for blogPosts (no tags) - Local Business, Technical, Announcement"
  - "Customizable section headings for caseStudies (not fixed to Challenge/Approach/Impact)"
  - "Optional projectId link allows case studies for work outside portfolio"
  - "Compound index on status+publishedAt enables efficient published content queries"

patterns-established:
  - "Soft delete pattern with isDeleted boolean for content types"
  - "Draft/publish workflow with optional publishedAt timestamp"
  - "displayOrder field for manual content ordering"

# Metrics
duration: 2min
completed: 2026-02-07
---

# Phase 15 Plan 01: Content Schema + Backend Summary

**blogPosts and caseStudies schema with 7 indexes, soft-delete pattern, and 4 content layer dependencies (slugify, dayjs, react-markdown, remark-gfm)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-07T05:25:00Z
- **Completed:** 2026-02-07T05:27:05Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added blogPosts table with 13 fields, 3 categories, and 3 indexes (by_slug, by_status, by_order)
- Added caseStudies table with 18 fields including customizable sections and 4 indexes (by_slug, by_project, by_status, by_order)
- Installed content layer dependencies: slugify ^1.6.6, dayjs ^1.11.19, react-markdown ^10.1.0, remark-gfm ^4.0.1
- Established soft-delete and draft/publish patterns for content management

## Task Commits

Each task was committed atomically:

1. **Task 1: Install content layer dependencies** - `88d48d7` (chore)
2. **Task 2: Add blogPosts and caseStudies tables to Convex schema** - `a19b96a` (feat)

## Files Created/Modified
- `convex/schema.ts` - Added blogPosts and caseStudies table definitions with indexes
- `package.json` - Added slugify, dayjs, react-markdown, remark-gfm dependencies

## Decisions Made

**1. Optional cover images for drafts**
- Rationale: coverImageId and coverImageAlt are optional in schema so drafts can be saved without images. The publish mutation will validate these are present before allowing status change to "published".

**2. Category-based organization (no tags)**
- Rationale: Three fixed categories (Local Business, Technical, Announcement) are sufficient for launch. Tags can be added in a future phase if needed.

**3. Customizable section headings**
- Rationale: caseStudies section headings (problem/solution/results) are stored as customizable strings, not enforced as fixed values. Default headings will be set in admin UI.

**4. Optional projectId link**
- Rationale: Allows case studies for work outside the portfolio projects table, providing flexibility for client work not shown in the main portfolio.

**5. Compound status+publishedAt index**
- Rationale: Enables efficient "published posts by date descending" queries without needing to filter unpublished content in application code.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - schema compiled cleanly on first attempt. Pre-existing lint errors in other files (app/(home)/page.tsx, app/about/page.tsx, components/portfolio/testimonial-card.tsx) are unrelated to this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Plan 02:**
- Schema foundation complete with all tables and indexes
- Dependencies installed for content processing
- Query patterns enabled by indexes (by_slug, by_status, by_order, by_project)

**No blockers:**
- Type-check passes
- Convex codegen will generate typed API on next dev server start
- blogPosts and caseStudies modules can be implemented immediately

---
*Phase: 15-content-schema-backend*
*Completed: 2026-02-07*
