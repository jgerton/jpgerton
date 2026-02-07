---
phase: 10-typography-color-system
plan: 03
subsystem: ui
tags: [tailwind, wcag, accessibility, css-variables, dark-mode, color-system]

# Dependency graph
requires:
  - phase: 08-color-system-audit
    provides: WCAG AA verified semantic colors for light/dark themes
provides:
  - Amber/gold accent color (--accent-warm) with WCAG AA compliant contrast in both themes
  - Warm blue-gray dark mode backgrounds with Material Design-inspired color elevation
  - WCAG AA verified border contrast for all UI elements (3:1+ minimum)
  - Tailwind utilities: bg-accent-warm, text-accent-warm, text-accent-warm-foreground
affects: [13-design-system-implementation, component-theming, cta-buttons, highlights]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Color elevation system for dark mode surfaces (background -> card -> popover)
    - Warm color temperature for premium dark mode aesthetic

key-files:
  created: []
  modified:
    - app/globals.css

key-decisions:
  - "Used dark text on amber accent (8.16:1 contrast) instead of white text for optimal readability"
  - "Implemented warm blue-gray (220 hue) for dark mode instead of neutral black for premium feel"
  - "Fixed border contrast to meet WCAG AA UI minimum (3:1) - light mode 55% lightness, dark mode 40% lightness"

patterns-established:
  - "Color elevation pattern: Each surface level increases lightness by ~3% in dark mode for visible hierarchy"
  - "Warm accent is brighter in dark mode (55% lightness) than light mode (50% lightness) to stand out against dark surfaces"

# Metrics
duration: 3min
completed: 2026-02-05
---

# Phase 10 Plan 03: Amber Accent & Warm Dark Mode Summary

**Amber/gold accent color and warm blue-gray dark mode with Material Design color elevation, all WCAG AA verified**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-05T14:02:20Z
- **Completed:** 2026-02-05T14:05:46Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added amber/gold accent color (--accent-warm) with 8.16:1 contrast in light mode, 8.89:1 in dark mode
- Transformed dark mode from neutral black to warm blue-gray (220 15% 10%) for premium aesthetic
- Implemented color elevation hierarchy: background (10%) -> card (13%) -> popover (16%)
- Fixed border contrast to meet WCAG AA UI requirements (3.36:1 light mode, 3.09:1 dark mode)
- Verified 21 color pairs across both themes for WCAG AA compliance

## Task Commits

Each task was committed atomically:

1. **Task 1: Add amber/gold accent and warm dark mode** - `9ba0c92` (feat)
   - Added --accent-warm tokens for both themes
   - Transformed dark mode to warm blue-gray with color elevation
   - Created Tailwind utilities for amber accent

2. **Task 2: WCAG AA verification and border fixes** - `353955c` (fix)
   - Added comprehensive WCAG verification summary
   - Fixed light mode border: 90% -> 55% lightness (1.25:1 -> 3.36:1)
   - Fixed dark mode border: 20% -> 40% lightness (1.41:1 -> 3.09:1)
   - Verified all 21 color pairs across themes

## Files Created/Modified
- `app/globals.css` - Added amber/gold accent tokens, warm dark mode colors with elevation, WCAG verification summary, fixed border contrast

## Decisions Made

1. **Dark text on amber accent:** Used 10% lightness text on amber background (8.16:1 contrast) instead of white text which would have failed WCAG AA. This creates highly readable CTA buttons.

2. **Warm blue-gray dark mode:** Chose 220 hue with 15% saturation for dark mode base instead of neutral black (0 hue). Creates premium, intentional aesthetic rather than generic inversion.

3. **Color elevation increments:** Used +3% lightness per elevation level (background 10%, card 13%, popover 16%). Provides visible hierarchy without excessive contrast that would feel disconnected.

4. **Border contrast fix:** Increased border contrast from 1.25:1/1.41:1 to 3.36:1/3.09:1 to meet WCAG AA UI minimum (3:1). Essential for form inputs and card boundaries to be perceivable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Fixed border contrast for WCAG AA UI compliance**
- **Found during:** Task 2 (WCAG verification)
- **Issue:** Existing borders had insufficient contrast (1.25:1 light mode, 1.41:1 dark mode) - below WCAG AA 3:1 minimum for UI elements. This affects form inputs, card boundaries, and other interactive element visibility.
- **Fix:** Adjusted border lightness values:
  - Light mode: 90% -> 55% lightness (1.25:1 -> 3.36:1 contrast)
  - Dark mode: 20% -> 40% lightness (1.41:1 -> 3.09:1 contrast)
- **Files modified:** app/globals.css (--border variables)
- **Verification:** Calculated contrast ratios using WCAG relative luminance formula - both now pass 3:1 minimum
- **Committed in:** 353955c (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Border contrast fix was necessary for WCAG AA compliance. This was inherited from previous phases and required correction. No scope creep - ensuring accessibility is core requirement.

## Issues Encountered

None - plan executed smoothly with only one inherited accessibility issue corrected.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 13 (Design System Implementation):**
- Amber/gold accent tokens available for CTA buttons and highlights
- Dark mode provides premium aesthetic with clear surface hierarchy
- All color pairs WCAG AA verified for accessibility
- Tailwind utilities (bg-accent-warm, text-accent-warm-foreground) ready for component usage

**No blockers or concerns.**

**Amber accent usage guidance:**
- Use `bg-accent-warm text-accent-warm-foreground` for primary CTAs
- Amber is warmer and more attention-grabbing than turquoise accent
- Complements existing blue/turquoise palette without clashing
- Renders richer in dark mode (55% lightness) than light mode (50% lightness)

---
*Phase: 10-typography-color-system*
*Completed: 2026-02-05*
