---
phase: 18-content-integration
plan: 03
subsystem: ui
tags: [convex, react, blog, testimonials, homepage]

# Dependency graph
requires:
  - phase: 18-01
    provides: testimonials backend (list query, seed mutation, schema)
  - phase: 17-01
    provides: blog post listing UI (BlogPostCard component)
  - phase: 15-02
    provides: blog post queries (listPublished)
provides:
  - Dynamic blog section on home page showing 3 latest posts
  - Dynamic testimonials from Convex database (replacing hardcoded data)
  - Clean home page with no placeholder comments
affects: [future homepage enhancements, content management workflows]

# Tech tracking
tech-stack:
  added: []
  patterns: [Conditional section rendering based on data availability, loading state handling for testimonials section]

key-files:
  created: []
  modified: [app/(home)/page.tsx]

key-decisions:
  - "Blog section heading: 'Insights & Updates' (user decision)"
  - "Blog section CTA text: 'Read More' (user decision)"
  - "Blog section hidden when no published posts exist (no empty state shown)"
  - "Testimonials show during loading, hide only when empty after load (consistent with projects pattern)"
  - "Single column grid for blog cards (horizontal card layout looks better stacked)"

patterns-established:
  - "Loading state pattern: Show section during undefined (loading), hide only when empty after load"
  - "Conditional section rendering: Entire section wrapped in data availability check"
  - "Intersection observer per section for independent entrance animations"

# Metrics
duration: 4min
completed: 2026-02-07
---

# Phase 18 Plan 03: Home Page Blog & Testimonials Summary

**Home page now shows 3 latest blog posts in 'Insights & Updates' section and renders testimonials from Convex database**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-07T15:33:13Z
- **Completed:** 2026-02-07T15:37:10Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added dynamic blog section to home page showing 3 latest published posts
- Replaced hardcoded testimonials array with Convex query (api.testimonials.list)
- Removed all placeholder comments from home page
- Blog section positioned between Featured Projects and Social Proof sections
- Testimonials section now database-driven with loading state handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Add blog section and dynamic testimonials to home page** - `e930d67` (feat)

Task 2 (placeholder cleanup) required no commits - verification confirmed no misleading comments remained.

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `app/(home)/page.tsx` - Added blog section with BlogPostCard components, replaced hardcoded testimonials with Convex query, removed placeholder comments

## Decisions Made

**1. Blog section heading: 'Insights & Updates' (user decision)**
- Rationale: User explicitly specified this heading in plan instructions

**2. Blog section CTA: 'Read More' linking to /blog (user decision)**
- Rationale: User explicitly specified this CTA text in plan instructions

**3. Blog section hidden when no posts (no empty state)**
- Rationale: Blog section is new content, users won't expect it during initial page load. Prevents layout shift by only showing when data exists.

**4. Single column grid for blog cards**
- Rationale: BlogPostCard is already a horizontal layout (image left, content right). Stacking 3 cards vertically in single column looks better than multi-column which would cramp the horizontal cards.

**5. Testimonials show during loading, hide only when empty**
- Rationale: Consistent with projects section pattern - prevents flash of empty state during load, maintains layout stability.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Regenerated Convex API types**
- **Found during:** Task 1 (TypeScript type check)
- **Issue:** convex/_generated/api.d.ts was missing testimonials module type definitions, causing TypeScript error: "Property 'testimonials' does not exist on type"
- **Fix:** Ran `bunx convex dev --once` from host to regenerate API types, which added testimonials table index and updated api.d.ts
- **Files modified:** convex/_generated/api.d.ts
- **Verification:** Type check passed after regeneration, grep confirmed testimonials now in api.d.ts
- **Committed in:** n/a (generated file, not committed)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was necessary for build to succeed. No scope creep.

## Issues Encountered

**Issue:** Docker container service name mismatch
- **Problem:** Plan instructions referred to Docker service as "app" but docker-compose.yml defines it as "frontend"
- **Resolution:** Used correct service name "frontend" in docker compose exec commands
- **Impact:** Minor - added 1 minute to task time for troubleshooting

**Issue:** Pre-existing lint errors unrelated to changes
- **Problem:** ESLint reported errors in home page (ref access during render, unescaped quotes) that pre-existed before this plan
- **Resolution:** Confirmed errors were pre-existing by checking line numbers against unchanged code sections. Task-specific TypeScript errors were resolved (testimonials API now recognized).
- **Impact:** None - pre-existing lint issues don't block plan completion

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 18 is now complete** (all 3 plans done):
- 18-01: Testimonials backend with list query, seed mutation, schema
- 18-02: Project detail pages show linked case studies
- 18-03: Home page shows blog posts and database-driven testimonials

**Ready for next phase:**
- All public pages now use dynamic content from Convex
- No hardcoded placeholder data remains in page files
- Blog section provides content showcase for local business visitors
- Testimonials can be managed via Convex dashboard without code changes

**No blockers for subsequent phases.**

---
*Phase: 18-content-integration*
*Completed: 2026-02-07*
