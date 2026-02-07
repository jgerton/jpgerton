---
phase: 16-admin-content-management
plan: 02
subsystem: ui
tags: [react, dnd-kit, markdown, react-hook-form, zod, convex]

# Dependency graph
requires:
  - phase: 16-01
    provides: MarkdownEditor component, ImageUploadZone with backward-compatible generateUploadUrlFn prop
  - phase: 15-02
    provides: Blog post backend mutations (create, update, remove, reorder, list, getById)
provides:
  - Complete blog post admin CRUD interface
  - Drag-to-reorder blog list with status filter tabs
  - Blog form with markdown editor and image upload validation
  - Blog create/edit route pages
affects: [17-blog-public, 18-case-study-public]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Filter tabs pattern for status-based views (All/Draft/Published)"
    - "Conditional validation with zod refine() for dependent fields (coverImageAlt required when coverImageId present)"
    - "Vertical form layout for blog editor (wider container max-w-3xl for markdown editor space)"

key-files:
  created:
    - components/admin/sortable-blog-row.tsx
    - components/admin/sortable-blog-list.tsx
    - components/admin/blog-form.tsx
    - app/admin/blog/page.tsx
    - app/admin/blog/new/page.tsx
    - app/admin/blog/[id]/edit/page.tsx
  modified: []

key-decisions:
  - "Row-level ConfirmDialog pattern (delete confirmation in SortableBlogRow, not page-level)"
  - "Filter tabs operate on client-side filtered view, reorder mutation updates only visible items"
  - "Slug field disabled on create (server auto-generates), editable on edit for drafts only"
  - "Conditional alt text validation enforced via zod refine(), not form-level logic"

patterns-established:
  - "Filter tabs with count badges for status-based content views"
  - "max-w-3xl container for forms with large content areas (markdown editor)"

# Metrics
duration: 4min
completed: 2026-02-07
---

# Phase 16 Plan 02: Blog Admin CRUD Summary

**Complete blog post admin interface with drag-to-reorder, status filter tabs, markdown editor, and image upload validation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-07T13:26:28Z
- **Completed:** 2026-02-07T13:30:06Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments
- Blog list page with All/Draft/Published filter tabs and drag-to-reorder
- Blog form component with markdown editor, image upload, and conditional alt text validation
- Create and edit blog post route pages with proper slug handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Create blog list page with sortable table and filter tabs** - `17b273b` (feat)
2. **Task 2: Create blog form component and route pages** - `13db553` (feat)

## Files Created/Modified
- `components/admin/sortable-blog-row.tsx` - Blog row with drag handle, status/category badges, edit/delete actions, row-level ConfirmDialog
- `components/admin/sortable-blog-list.tsx` - Drag-to-reorder table using dnd-kit with verticalListSortingStrategy
- `app/admin/blog/page.tsx` - Blog list page with filter tabs (All/Draft/Published), counts, empty state
- `components/admin/blog-form.tsx` - Blog form with markdown editor (500px height), image upload, zod validation with refine() for conditional alt text
- `app/admin/blog/new/page.tsx` - Create blog post page (auto-generates slug, creates draft)
- `app/admin/blog/[id]/edit/page.tsx` - Edit blog post page with pre-loaded data, slug editable for drafts only

## Decisions Made

1. **Row-level ConfirmDialog pattern**: Delete confirmation in SortableBlogRow component rather than page-level dialog. Simpler than dual-state management (deleteTarget + confirmOpen).

2. **Filter tabs operate on client-side filtered view**: Status filtering done in component, reorder mutation receives only visible items. Matches Projects admin pattern.

3. **Slug field disabled on create, editable on edit for drafts**: Server auto-generates slug on create. Edit page shows slug but disables if status=published (URL stability for SEO). Matches backend immutability constraint from 15-02.

4. **Conditional alt text validation via zod refine()**: Alt text required when coverImageId present, enforced at schema level. Prevents form submission with image but no alt text.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All patterns replicated cleanly from Projects admin (16-01). MarkdownEditor and ImageUploadZone integration worked as expected.

## Next Phase Readiness

- Blog admin interface complete and ready for content authoring
- Markdown editor provides live preview for content creation
- Image upload flow tested with blog-specific generateUploadUrl
- Ready for phase 17 (public blog pages) and phase 18 (public case study pages)

---
*Phase: 16-admin-content-management*
*Completed: 2026-02-07*
