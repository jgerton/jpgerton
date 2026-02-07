---
phase: 16-admin-content-management
plan: 03
subsystem: admin
tags: [convex, react-hook-form, dnd-kit, markdown, zod, form-validation]

# Dependency graph
requires:
  - phase: 16-01
    provides: MarkdownEditor component, ImageUploadZone with generateUploadUrlFn prop
  - phase: 15-02
    provides: caseStudies schema with 6 separate section fields
provides:
  - Complete case study CRUD admin interface
  - Single-editor UX bridging to multi-field backend
  - Sortable case study list with project linking display
  - Section heading customization inputs
  - Metrics management with dynamic field array
affects: [16-04-case-study-public, future-content-management]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single markdown editor with multi-section backend bridge (combineSections/parseSections)"
    - "Heading sync on blur updates markdown content"
    - "Index-based section parsing (more robust than heading text matching)"

key-files:
  created:
    - components/admin/case-study-form.tsx
    - components/admin/sortable-case-study-list.tsx
    - components/admin/sortable-case-study-row.tsx
    - app/admin/case-studies/page.tsx
    - app/admin/case-studies/new/page.tsx
    - app/admin/case-studies/[id]/edit/page.tsx
  modified: []

key-decisions:
  - "Single markdown editor with section dividers (not separate editors per section)"
  - "Index-based section parsing (find heading index, extract content between indices)"
  - "Heading inputs sync to markdown on blur event"

patterns-established:
  - "Pattern 1: UX-backend bridge - single editor combines 3 sections, parseSections splits on submit"
  - "Pattern 2: Filter tabs (All/Draft/Published) for content list pages"
  - "Pattern 3: Sortable lists with inline delete confirmation dialogs"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 16 Plan 03: Case Study Admin CRUD Summary

**Complete case study admin with single markdown editor bridging to 6-field backend, drag-to-reorder list with project linking, and section heading customization**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T04:28:29Z
- **Completed:** 2026-02-07T04:33:12Z
- **Tasks:** 2 (note: Task 1 files created by parallel 16-02 agent)
- **Files modified:** 6

## Accomplishments

- Case study form with single MarkdownEditor and 3 heading inputs
- Section parser helpers (combineSections/parseSections) bridge single-editor UX to 6-field backend
- Sortable case study list showing linked project names or "Unlinked"
- Filter tabs (All/Draft/Published) with counts
- Dynamic metrics management (add/remove label-value pairs)
- Image upload with case study generateUploadUrl mutation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create case study list page with sortable table and filter tabs** - (files created by 16-02, see Deviations)
2. **Task 2: Create case study form component and route pages** - `21d5dd2` (feat)

**Plan metadata:** (to be committed separately)

## Files Created/Modified

- `components/admin/case-study-form.tsx` - Form with single markdown editor, 3 heading inputs, section parsing helpers, metrics management, project linking dropdown
- `components/admin/sortable-case-study-list.tsx` - DndContext wrapper with drag-to-reorder table
- `components/admin/sortable-case-study-row.tsx` - Individual row with project link display, status badge, edit/delete actions
- `app/admin/case-studies/page.tsx` - List page with filter tabs, reorder/delete mutations, empty state
- `app/admin/case-studies/new/page.tsx` - Create page (generates draft with auto-slug)
- `app/admin/case-studies/[id]/edit/page.tsx` - Edit page with pre-populated form, slug lock for published

## Decisions Made

1. **Single editor with section dividers** - User decision from revised plan: ONE markdown editor with headings, not separate editors. Form bridges to backend's 6 separate fields via combineSections/parseSections helpers.

2. **Index-based section parsing** - Find heading indices in content, extract text between indices. More robust than regex or heading text matching (handles duplicate headings, markdown formatting inside sections).

3. **Heading sync on blur** - Track previous heading values in useRef, replace old heading with new in markdown when input loses focus. Keeps heading inputs and markdown content in sync.

4. **Filter tabs pattern** - All/Draft/Published tabs with counts following blog admin pattern (16-02). Consistent UX across content types.

## Deviations from Plan

### Parallel Execution File Conflict

**1. [Parallel execution conflict] Task 1 files created by 16-02 agent**

- **Found during:** Task 1 execution (git status check)
- **Issue:** The 16-02 (blog admin) agent running in parallel accidentally committed case study files in commit `13db553` alongside blog files. Files included: `app/admin/case-studies/page.tsx`, `components/admin/sortable-case-study-list.tsx`, `components/admin/sortable-case-study-row.tsx`
- **Root cause:** 16-02 and 16-03 plans both marked as wave 2 (parallel compatible). Plans modify different subsystems but 16-02 agent mistakenly created case study files during its Task 2 execution
- **Files affected:** All 3 Task 1 files (list page, sortable list, sortable row)
- **Resolution:** Verified files are identical to planned implementation. Proceeded with Task 2 without re-committing Task 1 files to avoid conflicts
- **Impact:** Task 1 work attributed to wrong plan in git history (16-02 instead of 16-03). Functionality correct, no code issues.
- **Lesson learned:** Wave-parallel execution needs stricter file boundaries or pre-execution validation to prevent cross-plan file creation

---

**Total deviations:** 1 parallel execution file conflict
**Impact on plan:** Task 1 files exist and are correct but committed under wrong plan. Task 2 completed as planned. All must-have truths satisfied.

## Issues Encountered

**1. ImageUploadZone interface mismatch**

- **Problem:** Initially used `value`/`onChange` props for ImageUploadZone in case-study-form
- **Cause:** Misremembered interface - component uses `onUploadComplete` callback pattern, not controlled value pattern
- **Resolution:** Fixed to use `onUploadComplete={field.onChange}`
- **Verification:** TypeScript type-check passed after fix

**2. Unused imports**

- **Problem:** ESLint warnings for unused `useEffect` and `Id` imports in case-study-form
- **Cause:** Removed during development but imports remained
- **Resolution:** Removed unused imports
- **Verification:** ESLint passed with no warnings on case study files

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for next phases:**

- 16-04: Public case study pages can use schema fields (all 6 sections, metrics, cover images)
- Admin can create/edit/delete case studies with full content control
- Section heading customization working (defaults: The Challenge, Our Approach, The Results)
- Project linking functional (dropdown shows all projects, optional field)

**Blockers/concerns:**

- Parallel execution file conflict with 16-02 created attribution issue in git history (minor, functional impact zero)
- Blog and case study admin both complete - pattern consistency achieved

---
*Phase: 16-admin-content-management*
*Completed: 2026-02-07*
