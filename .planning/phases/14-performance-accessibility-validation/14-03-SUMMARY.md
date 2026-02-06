---
phase: 14
plan: 03
subsystem: accessibility
tags: [wcag, dark-mode, contrast, safari, css-compatibility]
dependency-graph:
  requires: [14-01]
  provides: [dark-mode-contrast-verified, safari-compatibility-documented]
  affects: []
tech-stack:
  added: []
  patterns: [wcag-contrast-verification, safari-heuristic-audit]
key-files:
  created:
    - .planning/phases/14-performance-accessibility-validation/14-03-audit-results.md
  modified:
    - app/globals.css
decisions:
  - id: "14-03-01"
    summary: "Primary color lightened in dark mode (40% -> 48%) with dark foreground text"
  - id: "14-03-02"
    summary: "Border lightness increased in dark mode (40% -> 45%) for elevated surface contrast"
  - id: "14-03-03"
    summary: "No single blue passes both text-on-bg and white-on-blue constraints; split approach used"
metrics:
  duration: "~9 minutes"
  completed: "2026-02-06"
---

# Phase 14 Plan 03: Dark Mode Contrast & Safari Compatibility Summary

**Dark mode contrast fully verified at WCAG AA with 3 CSS variable fixes; Safari compatibility confirmed via 7 heuristic checks on built CSS output**

## What Was Done

### Task 1: Dark Mode Contrast Verification (854e987)

Computed WCAG contrast ratios for all 26 text/UI color pairs in dark mode using the luminance formula (HSL -> RGB -> linearized sRGB -> relative luminance). Found 4 failures:

1. **Border on card:** 2.87:1 (needed 3:1) - border too dark against elevated card surface
2. **Border on popover:** 2.61:1 (needed 3:1) - same issue on more elevated popover
3. **Primary text links on background:** 3.54:1 (needed 4.5:1) - primary color too dark for text use
4. **Primary text links on card:** 3.28:1 (needed 4.5:1) - same on card surface

**Fixes applied:**
- Border: `0 0% 40%` -> `0 0% 45%` (#666666 -> #737373)
- Primary: `203 64% 40%` -> `203 64% 48%` (#1C7AAD -> #2C8DC9)
- Primary-foreground: `0 0% 100%` -> `220 20% 10%` (#FFFFFF -> #14181F) - dark text on primary buttons

After fixes, all 26 checks pass WCAG AA. Interactive states (hover, focus, disabled) also verified.

### Task 2: Safari CSS Compatibility Audit (fae8c74)

Performed 7 code-level compatibility checks:

| Check | Result |
|-------|--------|
| backdrop-filter prefixing | PASS - `-webkit-backdrop-filter` present in built CSS |
| CSS variables in -webkit- properties | PASS - none in source code |
| CSS Grid gap | PASS - supported since Safari 12+ |
| Smooth scroll behavior | PASS - only used in reduced-motion override |
| CSS clamp() in font sizes | PASS - supported since Safari 13.1+ |
| Gradient syntax compilation | PASS - compiles to standard linear-gradient() |
| color-mix() progressive enhancement | PASS - @supports fallback for older browsers |

4 items flagged for eventual real-Safari visual spot-check (non-blocking).

## Decisions Made

1. **[14-03-01] Primary uses dark foreground in dark mode** - Mathematically proven (exhaustive search across H=195-215, S=50-90%, L=35-55%) that no single blue satisfies both white-on-primary >= 4.5:1 AND primary-on-dark-bg >= 4.5:1. Solution: lighter primary with dark foreground text. Consistent with existing accent/accent-warm pattern.

2. **[14-03-02] Border lightened 5% for elevated surfaces** - Phase 10 only verified border against base background. The +3% elevation hierarchy means borders also appear on card (13%) and popover (16%) surfaces. A 5% lightness increase provides sufficient headroom.

3. **[14-03-03] Safari audit uses heuristic approach** - Without direct Safari access, we validated CSS output patterns against known Safari compatibility requirements. The 4 items needing visual verification are documented but not blocking.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Primary-foreground change from white to dark in dark mode**
- **Found during:** Task 1
- **Issue:** Increasing primary lightness for text link contrast (from 40% to 48%) caused white-on-primary to drop below 4.5:1 (3.65:1). This is a mathematically impossible dual constraint for blue hues.
- **Fix:** Changed primary-foreground in dark mode from white (#FFFFFF) to dark (#14181F). Primary buttons now use dark text on blue, matching the accent/accent-warm pattern already established.
- **Files modified:** app/globals.css
- **Commit:** 854e987

## Next Phase Readiness

- Dark mode contrast is fully validated
- Safari compatibility is documented with no blocking issues
- The primary-foreground change in dark mode should be visually reviewed (dark text on blue button) to confirm aesthetic alignment

## Artifacts

- `14-03-audit-results.md` - Full contrast matrix, fixes, Safari compatibility checks
