---
phase: 17-public-blog-pages
plan: 01
subsystem: content-display
tags: [blog, next.js, convex, nuqs, pagination, filtering, ui-components]
dependency-graph:
  requires:
    - phase: 15
      plan: 02
      reason: "Uses blogPosts.listPublished query and blog schema"
    - phase: 10
      plan: all
      reason: "Uses design system tokens (colors, typography, spacing, shadows)"
    - phase: 11
      plan: 01
      reason: "Uses SectionBackground, Badge, Button, Card components"
  provides:
    - artifact: "Public blog list page at /blog"
    - artifact: "BlogPostCard, CategoryFilter, PaginationBar components"
    - artifact: "Custom prose styles for markdown content"
  affects:
    - phase: 17
      plan: 02
      reason: "Blog detail page will use prose styles and similar patterns"
tech-stack:
  added:
    - name: "rehype-highlight"
      purpose: "Syntax highlighting for code blocks in markdown"
    - name: "highlight.js"
      purpose: "Syntax highlighting theme (github-dark)"
  patterns:
    - "nuqs for URL state management (category, page)"
    - "Suspense boundary for client component rendering"
    - "Client-side filtering and pagination (10 posts per page)"
    - "Empty state handling (coming soon, no category results)"
    - "Horizontal card layout (image left, content right)"
key-files:
  created:
    - path: "components/blog/blog-post-card.tsx"
      purpose: "Horizontal card component for blog list"
    - path: "components/blog/category-filter.tsx"
      purpose: "Category pill filter with URL state"
    - path: "components/blog/pagination-bar.tsx"
      purpose: "Numbered pagination with ellipsis"
    - path: "app/blog/layout.tsx"
      purpose: "Blog section metadata"
    - path: "app/blog/page.tsx"
      purpose: "Blog list page with filtering and pagination"
  modified:
    - path: "app/globals.css"
      purpose: "Added highlight.js import and custom prose styles"
    - path: "package.json"
      purpose: "Added rehype-highlight and highlight.js dependencies"
key-decisions:
  - decision: "Client-side filtering and pagination instead of server-side"
    rationale: "Simpler implementation for initial launch; posts list is small; enables instant filtering without server round-trips"
  - decision: "Custom prose styles instead of @tailwindcss/typography"
    rationale: "Full control over typography using existing design tokens; avoids plugin dependency"
  - decision: "github-dark syntax highlighting theme for all modes"
    rationale: "Good contrast in both light and dark modes; familiar GitHub aesthetic"
  - decision: "10 posts per page with numbered pagination"
    rationale: "Standard blog UX; numbered navigation is more predictable than infinite scroll"
  - decision: "Category filter shows only categories with posts"
    rationale: "Cleaner UI; avoids confusion from empty category results"
metrics:
  completed: 2026-02-07
  duration: "3.57 minutes"
  tasks: 2
  commits: 2
---

# Phase 17 Plan 01: Blog List Page Summary

**One-liner:** Public blog list at /blog with horizontal post cards, category filtering, numbered pagination, and custom prose styles for markdown rendering.

## Performance

**Duration:** 3.57 minutes
**Started:** 2026-02-07T14:16:25Z
**Completed:** 2026-02-07T14:19:59Z

## Accomplishments

Created the public blog list page at /blog with full filtering, pagination, and empty state handling. The page displays published blog posts in horizontal cards (cover image left, content right) with category filtering via URL query params and numbered pagination for posts beyond 10 per page.

Key features:
- **Category filtering** with pill buttons (only shows categories with published posts)
- **Pagination** with ellipsis logic for many pages (Previous/Next + numbered buttons)
- **Empty states** for "Coming soon" (no posts) and "No posts in category" (filtered empty)
- **Responsive layout** - cards stack vertically on mobile, horizontal on desktop
- **Custom prose styles** using existing design tokens (serif h2/h3, sans h4+, proper spacing)
- **Syntax highlighting** via highlight.js github-dark theme

Foundation CSS added to globals.css includes comprehensive prose styles for h2-h6 headings, paragraphs, lists, blockquotes, code blocks, links, images, tables, and horizontal rules. These styles will be used by both the blog list page (Plan 01) and blog detail page (Plan 02).

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Add prose styles and syntax highlighting | a5cf1aa | package.json, bun.lock, app/globals.css |
| 2 | Create blog list page with components | 310bd41 | components/blog/*.tsx, app/blog/*.tsx |

## Files Created/Modified

**Created:**
- `components/blog/blog-post-card.tsx` - Horizontal card (image left, text right)
- `components/blog/category-filter.tsx` - Category pills with URL state
- `components/blog/pagination-bar.tsx` - Numbered pagination with ellipsis
- `app/blog/layout.tsx` - Blog section metadata
- `app/blog/page.tsx` - Blog list page with Suspense + filtering + pagination

**Modified:**
- `app/globals.css` - Added highlight.js import + custom .prose styles (143 lines)
- `package.json` - Added rehype-highlight, highlight.js dependencies
- `bun.lock` - Updated lockfile

## Decisions Made

1. **Client-side filtering and pagination** instead of server-side
   - Rationale: Simpler for initial launch; posts list is small; enables instant filtering
   - Impact: All published posts fetched once, filtered/paginated in browser
   - Future: Can migrate to server-side if posts grow significantly

2. **Custom prose styles** instead of @tailwindcss/typography plugin
   - Rationale: Full control using existing design tokens; no plugin dependency
   - Pattern: `.prose` class in @layer components with explicit token references
   - Benefit: Consistent with design system (font-serif for h2/h3, existing spacing)

3. **github-dark syntax highlighting theme** for both light/dark modes
   - Rationale: Good contrast in both modes; familiar aesthetic
   - Alternative considered: Separate themes per mode (rejected: added complexity)

4. **10 posts per page** with numbered pagination
   - Rationale: Standard blog UX; predictable navigation vs infinite scroll
   - Implementation: Math.ceil(filtered.length / 10) for total pages
   - Ellipsis logic: Show all if ≤7 pages, otherwise smart truncation

5. **Category filter shows only categories with posts**
   - Rationale: Cleaner UI; avoids empty category results
   - Implementation: Derive unique categories from actual posts (client-side)
   - URL state: nuqs useQueryState for category and page params

## Technical Patterns

**Suspense boundary pattern** (matching app/projects/page.tsx):
- Outer default export wraps inner client component in Suspense
- Fallback shows hero with "Loading..." text
- Inner component marked "use client" for hooks (useQuery, nuqs)

**URL state management with nuqs**:
- `useQueryState("category", parseAsString)` - category filter
- `useQueryState("page", parseAsInteger.withDefault(1))` - current page
- Category change resets page to 1 (via `setPage(1)`)
- URL updates automatically (/blog?category=Technical&page=2)

**Pagination ellipsis logic**:
- ≤7 pages: Show all [1,2,3,4,5,6,7]
- Current ≤4: Show [1,2,3,4,5,...,last]
- Current ≥last-3: Show [1,...,last-4,last-3,last-2,last-1,last]
- Middle: Show [1,...,current-1,current,current+1,...,last]

**Empty state handling**:
- `showEmptyState` = no posts + no category filter → "Coming Soon" CTA
- `showNoCategoryResults` = no posts + category selected → "No posts in this category"

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Type compatibility for optional fields:**
- Issue: nuqs returns `string | undefined` but CategoryFilter expected `string | null`
- Issue: Convex schema has `coverImageAlt: v.optional(v.string())` returning `string | undefined`
- Fix: Updated component prop types to accept `undefined` in addition to `null`
- Pattern: Use union types `string | null | undefined` for Convex optional fields

**Pre-existing lint errors:**
- Found: 11 lint errors in app/(home)/page.tsx, app/about/page.tsx, components/portfolio/testimonial-card.tsx
- Impact: None on this plan (errors pre-date this work)
- Action: Ignored for this plan; blog components have zero lint errors
- Note: Should be addressed in separate cleanup task

## Next Phase Readiness

**Ready for Plan 02 (Blog Detail Page):**
- [x] Custom prose styles exist in globals.css
- [x] highlight.js theme imported
- [x] BlogPostCard component pattern established
- [x] SectionBackground usage pattern clear
- [x] nuqs URL state management working
- [x] Convex query patterns validated (listPublished)

**Blockers:** None

**Concerns:** None

**Recommendations:**
1. Plan 02 should use same prose styles (`.prose` class wrapper)
2. Consider adding `sizes` prop to Image components for better optimization
3. Future: Add search functionality once posts grow beyond ~50
4. Future: Consider server-side pagination if posts exceed ~100
