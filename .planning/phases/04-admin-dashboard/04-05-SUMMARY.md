---
phase: 04
plan: 05
subsystem: admin-dashboard
tags: [react, convex, contacts, dashboard, ui]
requires: [04-02, 04-03]
provides: [dashboard-home, contacts-management]
affects: []
tech-stack:
  added: []
  patterns: [inbox-pattern, bulk-actions, filter-tabs]
key-files:
  created:
    - components/admin/stats-card.tsx
    - components/admin/contacts-table.tsx
  modified:
    - app/admin/page.tsx
    - app/admin/contacts/page.tsx
decisions:
  - slug: stats-card-layout
    choice: Card with stat value and optional icon, no trend indicator initially
    rationale: Keep it simple for initial dashboard, can add trends later
  - slug: contacts-table-pattern
    choice: Checkbox selection with bulk actions bar, row click expands details
    rationale: Standard inbox UX pattern - familiar and efficient
  - slug: filter-tabs-implementation
    choice: Client-side filtering with tab navigation, no URL state
    rationale: Simple local state sufficient for admin page, not shareable URLs needed
  - slug: date-time-handling
    choice: Lazy state initializer with useEffect for Date.now() to satisfy React purity linter
    rationale: Avoid impure function calls during render while maintaining reactivity
metrics:
  duration: 341s
  completed: 2026-02-04
---

# Phase 4 Plan 5: Dashboard Home & Contacts Management Summary

**One-liner:** Dashboard home with stats cards and contacts inbox featuring four-state workflow with bulk actions.

## What Was Built

### Dashboard Home (app/admin/page.tsx)
- Stats grid showing:
  - Unread message count
  - Total project count
  - Contacts from past week
- Recent contacts section (last 5 submissions)
- Real-time data from Convex queries
- Time ago formatting for contact timestamps
- Status badges with color coding
- Link to full contacts page

### Stats Card Component (components/admin/stats-card.tsx)
- Reusable card for displaying metrics
- Props: label, value, icon, className
- Clean layout with large value display
- Optional icon placement

### Contacts Table (components/admin/contacts-table.tsx)
- Checkbox selection (individual + select all)
- Bulk action bar (appears when items selected)
- Bulk archive functionality
- Row click to expand message details
- Status change dropdown per row
- Status badges (unread=orange, read=blue, responded=green)
- Reply via email link in expanded view
- Formatted date/time display

### Contacts Management Page (app/admin/contacts/page.tsx)
- Filter tabs: All, Unread, Archived
- Unread count badge on Unread tab
- Empty states for each filter
- Toast notifications for actions
- Integrates with Convex mutations (updateStatus, archiveBulk)
- Inbox-style layout (unread at top via Convex query sorting)

## Technical Implementation

### Type Safety
- Used proper `Id<"contactSubmissions">` types throughout
- Fixed ContactStatus type to match mutation requirements (no "unread" in updateStatus)
- Strongly typed state management with Set<Id<"contactSubmissions">>

### React Patterns
- Lazy state initializer `useState(() => Date.now())` for purity compliance
- useEffect to update time when contacts change
- Proper event handling with stopPropagation for nested clicks

### Data Flow
- Dashboard queries both contacts.list and projects.list
- Contacts page queries contacts.list and contacts.listArchived
- Mutations handle status changes and bulk operations
- Convex reactivity updates UI instantly on mutations

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed arrayMove import in sortable-project-list**
- **Found during:** Task 2 type-checking
- **Issue:** `arrayMove` imported from `@dnd-kit/utilities` but it moved to `@dnd-kit/sortable` in newer versions
- **Fix:** Changed import to use `@dnd-kit/sortable`
- **Files modified:** components/admin/sortable-project-list.tsx
- **Commit:** cfd4d05

**2. [Rule 1 - Bug] React purity linter errors with Date.now()**
- **Found during:** Task 3 linting
- **Issue:** Direct Date.now() calls in component body flagged as impure function during render
- **Fix:** Used lazy state initializer `useState(() => Date.now())` with useEffect
- **Files modified:** app/admin/page.tsx
- **Commit:** 94bdcd2

**3. [Rule 1 - Bug] Unused error parameters in catch blocks**
- **Found during:** Task 3 linting
- **Issue:** ESLint flagged unused `error` parameters in catch blocks
- **Fix:** Renamed to `err` and added `console.error()` calls for debugging
- **Files modified:** app/admin/contacts/page.tsx
- **Commit:** 94bdcd2

## Key Learnings

### React Purity Linter
The `react-hooks/purity` linter is very strict about impure functions like `Date.now()`. Solutions:
- Lazy state initializer: `useState(() => Date.now())`
- Cannot use `useMemo(() => Date.now(), [deps])` - still triggers error
- Must avoid calling impure functions during render

### Inbox Pattern
Implemented standard inbox UX:
- Unread items at top (handled by Convex query sorting)
- Checkbox selection for bulk actions
- Row click for detail view (non-destructive)
- Status badges for visual scanning
- Filter tabs for different views

### Type Safety with Convex
Convex's `Id<"tableName">` type is a branded string type that prevents mixing IDs:
- Cannot use `string` type for callbacks expecting `Id<T>`
- Must properly type state: `Set<Id<"contactSubmissions">>`
- updateStatus mutation only accepts "read" | "responded" | "archived" (not "unread")

## Verification Results

- [x] Dashboard shows unread count, project count, and recent contacts
- [x] Contacts page displays all submissions sorted by status
- [x] Unread contacts appear at top (via Convex query sorting)
- [x] Checkbox selection enables bulk archive
- [x] Status can be changed: unread -> read -> responded -> archived
- [x] Detail view shows full message content on row click
- [x] Convex reactivity updates UI instantly
- [x] `bun run type-check` passes
- [x] `bun run lint` passes

## Next Phase Readiness

**Ready for:** 04-06 (Admin Projects Management)

**Provides:**
- Working contacts inbox pattern as reference
- Reusable StatsCard component for other admin pages
- Pattern for filter tabs and bulk actions

**No blockers or concerns.**

## Commits

| Commit  | Description                                    |
| ------- | ---------------------------------------------- |
| 584b4bd | feat(04-05): create stats card and dashboard home |
| cfd4d05 | feat(04-05): create contacts table with bulk actions |
| 94bdcd2 | feat(04-05): build contacts page with inbox-style layout |
