---
phase: 02
plan: 01
subsystem: backend
tags: [convex, schema, queries, data-model, images]
requires: [01-03]
provides:
  - Projects table schema with indexes
  - Project queries (list, getBySlug, filterByTech)
  - Next.js Image configuration for Convex CDN
affects: [02-02, 02-03, 02-04, 02-05]
tech-stack:
  added: []
  patterns:
    - "Convex schema with indexes for optimized queries"
    - "Storage URL resolution pattern for image handling"
    - "Client-side filtering for array intersection queries"
key-files:
  created:
    - convex/projects.ts
  modified:
    - convex/schema.ts
    - next.config.js
decisions:
  - "screenshotId optional for initial setup without images"
  - "Client-side filtering for filterByTech due to Convex array index limitations"
  - "Wildcard *.convex.cloud hostname for all Convex deployments"
metrics:
  duration: 2min
  completed: 2026-02-03
---

# Phase 02 Plan 01: Convex Data Model & Queries Summary

**One-liner:** Convex projects table with slug/featured/order indexes, three query functions (list/getBySlug/filterByTech) with storage URL resolution, and Next.js Image configuration for Convex CDN optimization.

## What Was Built

### 1. Projects Table Schema (convex/schema.ts)

Added `projects` table with complete data model:

**Core Fields:**
- `name` (string): Display name
- `slug` (string): URL-safe identifier
- `description` (string): One-line card description
- `descriptionLong` (optional string): Full detail page description
- `screenshotId` (optional storage ID): Reference to Convex-hosted image

**Status & Organization:**
- `status` (union): "live" | "archived" | "in-progress"
- `featured` (boolean): Home page featuring flag
- `displayOrder` (number): Manual sorting control
- `createdAt` (number): Timestamp

**Technology Tracking:**
- `techStack` (string[]): Flat array for filtering
- `techCategories` (object): Categorized display (frontend/backend/infrastructure)

**Links:**
- `liveUrl` (optional string)
- `githubUrl` (optional string)

**Indexes:**
- `by_slug`: Fast lookup for detail pages
- `by_featured`: Home page featured projects
- `by_order`: Sorted listing

### 2. Project Queries (convex/projects.ts)

**`list` query:**
- Fetches all projects ordered by `displayOrder` DESC
- Resolves `screenshotId` to `screenshotUrl` via `ctx.storage.getUrl()`
- Handles null/undefined `screenshotId` gracefully
- Returns: Array of projects with `screenshotUrl` field

**`getBySlug` query:**
- Queries `by_slug` index for single project
- Returns `null` if not found
- Resolves screenshot URL
- Returns: Single project with `screenshotUrl` or `null`

**`filterByTech` query:**
- Args: `{ techs: string[] }`
- Returns all projects if `techs` is empty
- Client-side filtering: keeps projects where any `techStack` item matches `args.techs`
- Resolves screenshot URLs for filtered results
- Returns: Filtered array with `screenshotUrl` fields

**Why client-side filtering:**
Convex doesn't support array intersection with indexes, so we fetch all and filter in-memory. For expected project counts (10-50), this is performant.

### 3. Next.js Image Configuration (next.config.js)

Added `images.remotePatterns`:

```javascript
{
  protocol: "https",
  hostname: "*.convex.cloud",
  pathname: "/api/storage/**",
}
```

**Benefits:**
- Enables Next.js Image component optimization for Convex-hosted images
- Automatic image resizing, WebP conversion, lazy loading
- Wildcard hostname supports dev and production deployments

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All verification checks passed:

1. **Schema verification:** `bunx convex dev --once` pushed schema successfully
2. **Query verification:** `convex/_generated/api.d.ts` shows `api.projects.list`, `api.projects.getBySlug`, `api.projects.filterByTech`
3. **Build verification:** `bun run build` completed without errors
4. **Type verification:** `bun run type-check` passed

## Commits

| Hash    | Type | Description                                    |
|---------|------|------------------------------------------------|
| 461b577 | feat | Add projects table to Convex schema            |
| 507705c | feat | Create Convex project queries                  |
| 560a36f | feat | Configure Next.js for Convex image hosting     |

## Decisions Made

**1. screenshotId as optional field**
- **Rationale:** Allows project creation without images during initial setup/testing
- **Impact:** Queries must handle null case (set `screenshotUrl` to null)
- **Affects:** Project seeding workflow (02-06)

**2. Client-side filtering for filterByTech**
- **Constraint:** Convex doesn't support array intersection queries with indexes
- **Solution:** Fetch all projects, filter in-memory with `.some()` and `.includes()`
- **Performance:** Acceptable for expected dataset (10-50 projects)
- **Alternative considered:** Denormalize with boolean flags per tech (rejected - maintenance burden)

**3. Wildcard *.convex.cloud hostname**
- **Rationale:** Supports both production (`amicable-pony-588.convex.cloud`) and any future Convex deployments
- **Security:** Scoped to `/api/storage/**` pathname only
- **Benefit:** No config changes needed when switching Convex projects

## Integration Points

**Upstream dependencies (requires):**
- 01-03: Convex integration (schema type imports, query function)

**Downstream consumers (provides for):**
- 02-02: URL state management needs schema structure
- 02-03: Project filters component uses `filterByTech` query
- 02-04: ProjectCard uses `screenshotUrl` field and Next.js Image
- 02-05: Home page uses `list` query with featured filtering
- 02-06: Seeding script populates projects table

**Cross-cutting (affects):**
- Any component displaying project data will use these queries
- Any component showing project images will use Next.js Image with Convex URLs

## Technical Notes

**Storage URL resolution pattern:**
```typescript
const screenshotUrl = project.screenshotId
  ? await ctx.storage.getUrl(project.screenshotId)
  : null;
```

This pattern is used in all three queries. The `ctx.storage.getUrl()` method:
- Returns a signed URL valid for 1 hour
- URL regenerates on each query (fresh signature)
- Null check prevents calling with undefined

**Index usage:**
- `list`: Uses `withIndex("by_order").order("desc")` for sorted results
- `getBySlug`: Uses `withIndex("by_slug", q => q.eq("slug", args.slug))` for O(log n) lookup
- `filterByTech`: No index (fetch all with `.query("projects").collect()`)

**Type safety:**
- Schema defines strict types (union literals for status)
- Convex generates TypeScript types in `convex/_generated/dataModel.d.ts`
- Queries are fully typed via `convex/_generated/api.d.ts`

## Next Phase Readiness

**Ready for:**
- URL state management (02-02)
- UI components consuming project data (02-03, 02-04, 02-05)
- Data seeding (02-06)

**Blockers:** None

**Considerations for next plans:**
- Need to seed at least one project with image to test screenshot URL resolution in UI
- Consider adding pagination to `list` query if project count exceeds 50-100
- May need `getFeatured` query for home page (could filter `list` client-side for now)

## Files Modified

```
convex/schema.ts          +28 lines  (projects table definition)
convex/projects.ts        +113 lines (new file - three queries)
next.config.js            +9 lines   (images.remotePatterns)
```

**Total:** 150 lines added, 0 lines removed

## Performance Metrics

- **Duration:** 2 minutes
- **Tasks completed:** 3/3
- **Commits:** 3 (one per task)
- **Builds:** 1 successful (Next.js production build)
- **Schema pushes:** 2 successful (after Tasks 1 and 2)
