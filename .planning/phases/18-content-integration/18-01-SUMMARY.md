---
phase: 18-content-integration
plan: 01
subsystem: database
tags: [convex, testimonials, schema, queries, mutations]

# Dependency graph
requires:
  - phase: 15-content-management-backend
    provides: "Convex schema patterns for content tables (blogPosts, caseStudies)"
provides:
  - Testimonials table in Convex with quote, name, title, company, photoId, displayOrder, isDeleted, createdAt
  - Public list query returning non-deleted testimonials with resolved photo URLs
  - Seed mutation for initial data population
affects: [18-02-testimonials-admin, 18-03-testimonials-home-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Simple content tables without publish workflow (isDeleted flag only, no status field)"

key-files:
  created:
    - convex/testimonials.ts
  modified:
    - convex/schema.ts

key-decisions:
  - "Testimonials table is lightweight: no status/publishedAt fields (simpler than blog/case studies)"
  - "Seed mutation is idempotent via existence check to prevent duplicate inserts"

patterns-established:
  - "Public query pattern: no auth check, filter !isDeleted, resolve storage URLs"
  - "Seed mutation pattern: check for existing data, return early if already seeded"

# Metrics
duration: 8min
completed: 2026-02-07
---

# Phase 18 Plan 01: Testimonials Backend Summary

**Convex testimonials table with public list query and idempotent seed mutation for 2 hardcoded testimonials**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-07T15:19:00Z
- **Completed:** 2026-02-07T15:27:14Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Testimonials table defined in schema with 8 fields and by_order index
- Public list query returning ordered, non-deleted testimonials with resolved photo URLs
- Idempotent seed mutation inserting the 2 existing hardcoded testimonials from home page

## Task Commits

Each task was committed atomically:

1. **Task 1: Add testimonials table to Convex schema** - `b5f1e8d` (feat)
2. **Task 2: Create testimonials queries and seed mutation** - `df99b0d` (feat)

## Files Created/Modified
- `convex/schema.ts` - Added testimonials table after caseStudies table
- `convex/testimonials.ts` - Public list query and authenticated seed mutation

## Decisions Made

**Testimonials table simplicity:** Testimonials don't need a publish workflow like blog posts or case studies. They are either visible (isDeleted: false) or hidden (isDeleted: true). No status or publishedAt fields. This keeps the data model lightweight and matches the user decision to manage testimonials via Convex dashboard rather than building admin CRUD UI.

**Idempotent seeding:** The seed mutation checks for existing data first and returns early if testimonials already exist. This prevents duplicate inserts if the mutation is called multiple times.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Pattern followed existing blogPosts.ts and caseStudies.ts conventions exactly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Testimonials backend ready for admin UI (Plan 02) and home page integration (Plan 03)
- Seed mutation can be run via Convex dashboard to populate initial data
- Database schema deployed and type-safe queries available

---
*Phase: 18-content-integration*
*Completed: 2026-02-07*
