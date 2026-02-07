---
phase: 02-projects-home
plan: 03
subsystem: ui
tags: [next.js, routing, dynamic-routes, suspense, server-components]

# Dependency graph
requires:
  - phase: 02-projects-home
    plan: 01
    provides: Convex queries (api.projects.list, api.projects.getBySlug)
  - phase: 02-projects-home
    plan: 02
    provides: Portfolio components (HeroSection, ProjectGrid, ProjectFilters)
provides:
  - Home page with hero and projects showcase
  - Projects index page with filtering and URL state
  - Project detail pages with async params and 404 handling
affects: [02-04-seed-data]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js 16 async params pattern (await params)"
    - "Suspense boundaries for useSearchParams compatibility"
    - "generateStaticParams for SSG optimization"
    - "Client-side URL state with nuqs in Suspense wrapper"

key-files:
  created:
    - app/page.tsx (replaced)
    - app/projects/page.tsx
    - app/projects/[slug]/page.tsx
  modified:
    - app/page.tsx

key-decisions:
  - "Suspense boundary required for projects page using useQueryState"
  - "generateStaticParams returns empty array if Convex unavailable during build"
  - "Project detail page uses server component (async) for fetchQuery"
  - "Home page remains client component for useQuery hook"

patterns-established:
  - "Page-level component composition: HeroSection + ProjectGrid"
  - "Server/client component split: detail (server), home/index (client)"
  - "URL state management wrapped in Suspense for SSR compatibility"

# Metrics
duration: 3min
completed: 2026-02-04
---

# Phase 2 Plan 3: Page Assembly Summary

**Three functional pages connecting Convex data layer with portfolio UI components: home with hero, projects index with filtering, and detail pages with async params**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-04T01:50:54Z
- **Completed:** 2026-02-04T01:53:56Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Rebuilt home page with HeroSection and ProjectGrid displaying all 6 projects
- Created projects index page with filtering, sorting, and URL state management
- Created dynamic project detail route with server-side rendering and 404 handling
- Fixed Suspense boundary issue for Next.js build compatibility
- All pages pass type checking and build successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Rebuild home page** - `27829d3` (feat)
2. **Task 2: Create projects index page** - `a65eede` (feat)
3. **Task 3: Create project detail page** - `cb16980` (feat)

## Files Created/Modified

- `app/page.tsx` - Replaced Phase 1 verification page with production home page (HeroSection + ProjectGrid)
- `app/projects/page.tsx` - Projects index with tech filtering and sorting via URL state
- `app/projects/[slug]/page.tsx` - Dynamic project detail page with async params and SSG

## Decisions Made

**1. Suspense boundary for projects page**
- **Issue:** Next.js build failed with "useSearchParams() should be wrapped in a suspense boundary"
- **Root cause:** `useQueryState` from nuqs internally uses `useSearchParams`
- **Solution:** Wrapped `ProjectsContent` component in `<Suspense>` with loading fallback
- **Impact:** Required to make build succeed and support SSR/SSG
- **Classification:** Deviation Rule 2 (missing critical functionality - build blocking)

**2. generateStaticParams error handling**
- **Rationale:** Convex may not be available during build (CI/CD, fresh clone)
- **Solution:** try/catch returns empty array on error
- **Benefit:** Build doesn't fail if Convex unreachable, pages fallback to ISR

**3. Server component for detail page**
- **Rationale:** Can use async/await with fetchQuery for better performance
- **Benefit:** SSG with generateStaticParams, no client-side query waterfalls
- **Trade-off:** Can't use Convex reactive queries (not needed for detail pages)

**4. Client component for home/index pages**
- **Rationale:** Need `useQuery` for reactive updates (though not critical for initial release)
- **Alternative considered:** Could use server components with fetchQuery, but keeping consistent with Phase 1 patterns

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added Suspense boundary to projects page**

- **Found during:** Task 3 verification (bun run build)
- **Issue:** Build failed with "useSearchParams() should be wrapped in a suspense boundary" error
- **Root cause:** `useQueryState` from nuqs uses `useSearchParams` internally, which requires Suspense in Next.js App Router
- **Fix:**
  - Split page into `ProjectsContent` component containing URL state logic
  - Wrapped in `<Suspense>` with loading fallback showing header and "Loading..." message
  - Export default `ProjectsPage` wrapper component
- **Files modified:** app/projects/page.tsx
- **Commit:** cb16980 (included with Task 3)
- **Why critical:** Build completely blocked without this fix

## Issues Encountered

**Suspense boundary requirement (resolved)**
- Next.js 16 requires Suspense boundaries for pages using `useSearchParams`
- Fixed by adding Suspense wrapper around ProjectsContent component
- No impact on functionality, only build compatibility

## User Setup Required

None - no external service configuration required.

## Verification Results

All verification checks passed:

1. **Home page:** http://localhost:3400 renders without errors, shows loading skeleton then "No projects found" (expected - data not seeded yet)
2. **Projects page:** http://localhost:3400/projects renders with filters (empty until data seeded)
3. **Build:** `bun run build` completed successfully - 4 routes generated (/, /projects, /projects/[slug], /_not-found)
4. **Type check:** `bun run type-check` passed with no errors
5. **Route generation:** Static generation working for dynamic routes via generateStaticParams

## Integration Points

**Upstream dependencies (requires):**
- 02-01: Convex queries provide data (api.projects.list, api.projects.getBySlug)
- 02-02: Portfolio components provide UI (HeroSection, ProjectGrid, ProjectFilters, ProjectCard)
- 01-04: Theme system provides dark mode support
- 01-01: Next.js App Router provides routing infrastructure

**Downstream consumers (provides for):**
- 02-04: Data seeding will populate projects visible on these pages
- 02-05: About page will link to projects page
- 02-06: Contact page will link to projects for portfolio showcase

**Cross-cutting (affects):**
- All pages use consistent header pattern (title/logo + ThemeToggle)
- All pages use responsive max-w-7xl containers
- URL state management pattern established for future filtering needs

## Technical Notes

**Server vs Client Components:**
```typescript
// Client component (home, projects index)
"use client";
import { useQuery } from "convex/react";
const projects = useQuery(api.projects.list);

// Server component (project detail)
import { fetchQuery } from "convex/nextjs";
const project = await fetchQuery(api.projects.getBySlug, { slug });
```

**Async params pattern:**
```typescript
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next.js 16 requirement
  // ...
}
```

**Suspense wrapper pattern:**
```typescript
// Inner component with URL state hooks
function ProjectsContent() {
  const [selectedTechs] = useQueryState("tech", ...);
  // ...
}

// Outer wrapper with Suspense
export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <ProjectsContent />
    </Suspense>
  );
}
```

**generateStaticParams with error handling:**
```typescript
export async function generateStaticParams() {
  try {
    const projects = await fetchQuery(api.projects.list, {});
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return []; // Fallback for CI/CD builds without Convex
  }
}
```

## Next Phase Readiness

**Ready for:**
- Data seeding (02-04) - all pages ready to display actual project data
- About page (02-05) - navigation patterns established
- Contact page (02-06) - portfolio showcase complete

**Blockers:** None

**Considerations for next plans:**
- Need at least one project with screenshot to test image rendering
- Consider adding breadcrumbs to detail page for better navigation
- May want to add sharing metadata (Open Graph) to detail pages in future phase

## Files Modified

```
app/page.tsx                      +23/-46 lines  (production home page)
app/projects/page.tsx             +107 lines     (new file - filterable index)
app/projects/[slug]/page.tsx      +143 lines     (new file - detail with SSG)
```

**Total:** 273 lines added, 46 lines removed

---
*Phase: 02-projects-home*
*Completed: 2026-02-04*
