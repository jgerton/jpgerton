---
phase: 15-content-schema-backend
plan: 02
subsystem: backend
tags: [convex, blog-posts, case-studies, crud, slugify, authentication, soft-delete, publishing-workflow]

# Dependency graph
requires:
  - phase: 15-content-schema-backend
    plan: 01
    provides: blogPosts and caseStudies schema tables
  - phase: 02-backend-foundation
    provides: Convex auth pattern (getAuthUserId)
provides:
  - Complete blog post CRUD with slug generation, publishing workflow, reading time
  - Complete case study CRUD with project linking, metrics validation
  - 12 blog post functions, 13 case study functions
affects: [16-admin-cms, 17-frontend-display]

# Tech tracking
tech-stack:
  added: []
  patterns: [slug collision detection with numeric suffixes, published slug immutability, reading time calculation (200 wpm), safe project reference resolution]

key-files:
  created: [convex/blogPosts.ts, convex/caseStudies.ts]
  modified: []

key-decisions:
  - "Reading time calculated in queries (200 wpm, minimum 1 minute) not stored in database"
  - "Slug generation includes deleted items in collision check to prevent SEO confusion from slug reuse"
  - "Published slugs cannot be changed (enforced in update mutations)"
  - "Publish mutations validate cover image, alt text, and content minimums before allowing publish"
  - "Soft delete preserves storage files (cover images) for potential restore"
  - "Project references resolve to null safely if project was deleted (hard delete in projects table)"
  - "Blog post publish requires 100 char minimum content length"
  - "Case study publish requires at least 1 metric"

patterns-established:
  - "Slug collision resolution: append -2, -3, etc. in while loop until unique"
  - "Publish validation pattern: check required fields, throw descriptive error before state change"
  - "Safe foreign key resolution: ctx.db.get returns null if referenced item deleted"
  - "Public queries filter isDeleted === false AND status === published"
  - "Admin queries filter isDeleted === false only (status optional)"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 15 Plan 02: Backend Mutations Summary

**Complete blog posts and case studies Convex modules with 25 total functions, slug generation, publishing workflow, and authentication**

## Performance

- **Duration:** 5 minutes
- **Started:** 2026-02-07
- **Completed:** 2026-02-07
- **Tasks completed:** 2/2
- **Files created:** 2 (blogPosts.ts: 488 lines, caseStudies.ts: 548 lines)

## Accomplishments

Created two complete Convex backend modules following the exact patterns from `convex/projects.ts`:

### Blog Posts Module (12 functions)

**Queries:**
- `list` - Admin: all non-deleted posts with optional status filter, sorted by displayOrder
- `listPublished` - Public: published posts only with optional category filter, sorted by publishedAt descending
- `getBySlug` - Public: single published post by slug
- `getById` - Admin: single post by ID regardless of status

**Mutations:**
- `create` - Create draft with slug generation and collision detection
- `update` - Update fields with published slug immutability enforcement
- `publish` - Transition to published with validation (cover image, alt text, 100 char minimum)
- `unpublish` - Transition back to draft (preserves publishedAt)
- `remove` - Soft delete (sets isDeleted true)
- `restore` - Restore soft-deleted post
- `reorder` - Batch update displayOrder
- `generateUploadUrl` - Get Convex storage upload URL

**Key features:**
- Reading time calculated in all queries: `Math.max(1, Math.ceil(wordCount / 200))`
- Slug collision resolution with numeric suffixes (my-post, my-post-2, my-post-3)
- Published slugs locked (cannot change after publishing)
- Cover image URL resolution via `ctx.storage.getUrl`

### Case Studies Module (13 functions)

**Queries:**
- `list` - Admin: all non-deleted case studies with optional status filter
- `listPublished` - Public: published case studies only, sorted by displayOrder
- `getBySlug` - Public: single published case study by slug
- `getByProject` - Public: all published case studies for a project
- `getById` - Admin: single case study by ID regardless of status

**Mutations:**
- `create` - Create draft with slug generation and collision detection
- `update` - Update fields with published slug immutability enforcement
- `publish` - Transition to published with validation (cover image, alt text, at least 1 metric)
- `unpublish` - Transition back to draft (preserves publishedAt)
- `remove` - Soft delete (sets isDeleted true)
- `restore` - Restore soft-deleted case study
- `reorder` - Batch update displayOrder
- `generateUploadUrl` - Get Convex storage upload URL

**Key features:**
- Safe project reference resolution (null if project deleted)
- Metrics array validation on publish
- Same slug generation and immutability patterns as blog posts
- Project data embedded in responses: `{ _id, name, slug }`

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create blog posts Convex module | 06d4985 | convex/blogPosts.ts |
| 2 | Create case studies Convex module | a87c9db | convex/caseStudies.ts |

## Files Created

1. **convex/blogPosts.ts** (488 lines)
   - 12 exported functions
   - Reading time calculation helper
   - Slug collision detection with while loop
   - Authentication on all mutations
   - Cover image URL resolution in all queries

2. **convex/caseStudies.ts** (548 lines)
   - 13 exported functions (includes `getByProject`)
   - Slug collision detection (same pattern as blog posts)
   - Safe project reference resolution
   - Authentication on all mutations
   - Cover image URL resolution in all queries

## Decisions Made

1. **Reading time calculation in queries, not stored**
   - Rationale: Content can change, reading time must stay fresh
   - Implementation: `calculateReadingTime(content)` helper called in every query
   - Formula: 200 words per minute, minimum 1 minute

2. **Slug collision check includes deleted items**
   - Rationale: Prevent SEO confusion from slug reuse (old indexed URLs)
   - Implementation: `ctx.db.query("blogPosts").withIndex("by_slug")` checks ALL items
   - Counter appends: -2, -3, etc. until unique slug found

3. **Published slug immutability**
   - Rationale: URL stability for published content (SEO, external links)
   - Implementation: `if (existing.status === "published" && args.slug !== existing.slug) throw`
   - Draft slugs can still be changed

4. **Publish validation before status change**
   - Blog posts: cover image, alt text, 100 char minimum content
   - Case studies: cover image, alt text, at least 1 metric
   - Throws descriptive errors before patching document

5. **Soft delete preserves storage files**
   - Rationale: Allow restore without losing uploaded images
   - Implementation: `isDeleted: true` only, no `ctx.storage.delete` call
   - Admin can restore with all media intact

6. **Safe project reference resolution**
   - Rationale: Projects use hard delete, case studies must handle null gracefully
   - Implementation: `const project = projectId ? await ctx.db.get(projectId) : null`
   - Returns minimal data: `{ _id, name, slug }` or `null`

## Deviations from Plan

None. Plan executed exactly as written.

## Issues Encountered

None. Type-check and lint passed on first attempt after ESLint comment fixes for `while (true)` loops.

## Next Phase Readiness

**Phase 16 (Admin CMS) is fully unblocked.**

All required backend functions are available:
- Blog posts: create, update, publish/unpublish, remove/restore, reorder, upload images
- Case studies: create, update, publish/unpublish, remove/restore, reorder, upload images, link to projects

**Phase 17 (Frontend Display) is fully unblocked.**

All public queries are available:
- Blog posts: `listPublished` (with category filter), `getBySlug`
- Case studies: `listPublished`, `getBySlug`, `getByProject`

Both phases can import and use these modules without modification.

**No blockers. No concerns. Phase 15 complete.**
