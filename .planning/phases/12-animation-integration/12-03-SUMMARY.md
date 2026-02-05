---
phase: 12-animation-integration
plan: 03
subsystem: ui
tags: [visual-verification, checkpoint, bug-fix, max-width, intersection-observer]

# Dependency graph
requires:
  - phase: 12-01
    provides: CSS keyframes, button press, focus ring, reduced-motion
  - phase: 12-02
    provides: useIntersectionObserver hook, scroll-triggered animations
provides:
  - Verified animation system ready for Phase 13 page integration
  - max-width container scale fix for Tailwind v4 spacing token collision
  - Callback ref pattern fix for useIntersectionObserver conditional rendering
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Explicit --max-width-* tokens to override Tailwind v4 spacing namespace collision"
    - "Callback ref (useState + useCallback) instead of useRef for conditional DOM elements"

key-files:
  created: []
  modified:
    - app/globals.css
    - hooks/use-intersection-observer.ts

key-decisions:
  - "Tailwind v4 --spacing-* tokens (xs-3xl) override max-w-* container widths; fix by adding explicit --max-width-* tokens"
  - "useRef does not re-trigger useEffect when DOM node mounts after loading state; callback ref pattern fixes this"
  - "INTR-05 (form validation animation) already covered by Phase 9 transition-colors on input.tsx"

patterns-established:
  - "Always define --max-width-* tokens when custom --spacing-* tokens share named sizes (xs, sm, md, lg, xl, 2xl, 3xl)"
  - "Use callback ref (useState + useCallback) for Intersection Observer when target elements mount conditionally"

# Metrics
duration: ~30min (including bug investigation and two fix cycles)
completed: 2026-02-05
---

# Phase 12 Plan 03: Visual Verification Checkpoint Summary

**Human-verified animation system with two critical bugs found and fixed during testing**

## Performance

- **Duration:** ~30 min (including debugging)
- **Started:** 2026-02-05
- **Completed:** 2026-02-05
- **Tasks:** 2
- **Files modified:** 2 (both existing)

## Accomplishments

- Production build verified with no animation-related errors
- Two critical bugs discovered during visual testing and fixed:
  1. Hero subtitle rendered in narrow column (48px) due to --spacing-2xl hijacking max-w-2xl
  2. Project cards not appearing because useIntersectionObserver with useRef didn't fire after conditional mount
- Added --max-width-xs through --max-width-7xl tokens to @theme to restore Tailwind v4 container widths
- Rewrote useIntersectionObserver to use callback ref pattern (useState + useCallback)
- All animations visually confirmed working: button press, focus ring, scroll entrance, staggered cards
- prefers-reduced-motion support verified
- No performance regressions observed

## Task Commits

1. **Task 1: Build verification** - `64528ba` (chore)
2. **Bug fixes during checkpoint** - `7b9cee7` (fix)

## Files Modified

- `app/globals.css` - Added --max-width-xs through --max-width-7xl tokens to @theme block to restore Tailwind v4 container width utilities overridden by --spacing-* tokens
- `hooks/use-intersection-observer.ts` - Rewrote from useRef to callback ref pattern (useState + useCallback) so observer fires when elements mount after loading state resolves

## Bugs Found and Fixed

### Bug 1: Hero subtitle narrow column
- **Symptom:** Italic subtitle text rendered in a ~48px wide column, each word on its own line
- **Root cause:** `--spacing-2xl: 48px` in @theme overrides Tailwind v4's built-in `max-w-2xl` (42rem/672px). The hero subtitle used `max-w-2xl` which resolved to 48px instead of 672px.
- **Fix:** Added explicit `--max-width-xs` through `--max-width-7xl` tokens to @theme to restore container widths
- **Impact:** Systemic fix - affects all max-w-{named-size} utilities that share names with spacing tokens

### Bug 2: Project cards not appearing
- **Symptom:** "Recent Projects" section showed no cards after scrolling into view
- **Root cause:** useIntersectionObserver used useRef. ProjectGrid renders loading skeletons first (no ref), then when Convex data loads, grid renders with ref but useEffect doesn't re-run because useRef doesn't trigger re-renders.
- **Fix:** Switched to callback ref pattern: useState<T | null> + useCallback ref setter, with element in useEffect dependency array
- **Impact:** Observer now correctly creates when the grid element mounts after loading resolves

## Deviations from Plan

- Plan expected a clean verification pass; instead, two bugs were found requiring code fixes before approval
- Docker was required for testing (not bun run dev)

## Issues Encountered

- Initial attempt used local dev server instead of Docker (corrected per user feedback)
- Both bugs required investigation and multiple Docker rebuilds

## Phase Readiness

- All Phase 12 animation work verified and approved by human tester
- Animation system ready for Phase 13 page-level integration
- max-width fix is a systemic improvement benefiting all future phases

---
*Phase: 12-animation-integration*
*Completed: 2026-02-05*
