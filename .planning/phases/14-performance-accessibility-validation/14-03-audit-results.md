# 14-03 Dark Mode Contrast & Safari Compatibility Audit

**Date:** 2026-02-06
**Method:** Automated WCAG luminance formula calculation (HSL -> RGB -> linearized -> relative luminance -> contrast ratio)
**Standard:** WCAG 2.1 AA (4.5:1 text, 3:1 UI elements)

## Dark Mode Contrast Matrix

### Text Color Pairs (minimum 4.5:1)

| Pair | FG | BG | Ratio | Result |
|------|----|----|-------|--------|
| Main body text | foreground #F0F2F5 | background #16181D | 15.83:1 | PASS |
| Secondary text on background | muted-foreground #9DA6AF | background #16181D | 7.19:1 | PASS |
| Secondary text on muted | muted-foreground #9DA6AF | muted #21242C | 6.29:1 | PASS |
| Secondary text on card | muted-foreground #9DA6AF | card #1C1F26 | 6.68:1 | PASS |
| Primary text on card | foreground #F0F2F5 | card #1C1F26 | 14.70:1 | PASS |
| Primary text on popover | foreground #F0F2F5 | popover #23272F | 13.35:1 | PASS |
| Popover text on popover bg | popover-foreground #F0F2F5 | popover #23272F | 13.35:1 | PASS |
| Text on primary button | primary-foreground #14181F | primary #2C8DC9 | 4.88:1 | PASS |
| Text on secondary button | secondary-foreground #FFFFFF | secondary #003B75 | 11.16:1 | PASS |
| Text on accent element | accent-foreground #1A1A1A | accent #09CEC7 | 8.84:1 | PASS |
| Text on warm CTA | accent-warm-foreground #1A1A1A | accent-warm #F9A91F | 8.89:1 | PASS |
| Text on destructive | destructive-foreground #FFFFFF | destructive #CF3030 | 5.10:1 | PASS |
| Primary text links on bg | primary #2C8DC9 | background #16181D | 4.87:1 | PASS |
| Primary text links on card | primary #2C8DC9 | card #1C1F26 | 4.52:1 | PASS |

### UI Element Pairs (minimum 3:1)

| Pair | FG | BG | Ratio | Result |
|------|----|----|-------|--------|
| Primary UI on background | primary #2C8DC9 | background #16181D | 4.87:1 | PASS |
| Primary UI on card | primary #2C8DC9 | card #1C1F26 | 4.52:1 | PASS |
| Border on background | border #737373 | background #16181D | 3.75:1 | PASS |
| Border on card | border #737373 | card #1C1F26 | 3.48:1 | PASS |
| Border on popover | border #737373 | popover #23272F | 3.16:1 | PASS |
| Focus ring on background | ring #2E93D1 | background #16181D | 5.25:1 | PASS |
| Focus ring on card | ring #2E93D1 | card #1C1F26 | 4.88:1 | PASS |
| Focus ring on input | ring #2E93D1 | input #333333 | 3.74:1 | PASS |
| Accent UI on background | accent #09CEC7 | background #16181D | 9.02:1 | PASS |
| Warm accent UI on background | accent-warm #F9A91F | background #16181D | 9.07:1 | PASS |
| Destructive UI on background | destructive #CF3030 | background #16181D | 3.48:1 | PASS |
| Destructive UI on card | destructive #CF3030 | card #1C1F26 | 3.23:1 | PASS |

**Total: 26/26 checks pass (0 failures)**

## Fixes Applied

### Fix 1: Border lightness increased (0 0% 40% -> 0 0% 45%)

**Problem:** Border (#666666) at 40% lightness failed 3:1 against card (2.87:1) and popover (2.61:1) backgrounds.

**Root cause:** Phase 10 established border contrast for background surface only (3.09:1) but didn't verify against elevated surfaces (card at 13%, popover at 16%) where borders are also used.

**Fix:** Increased border lightness from 40% to 45% (#666666 -> #737373). Subtle change that maintains the dark mode aesthetic.

| Surface | Before | After |
|---------|--------|-------|
| Background | 3.09:1 | 3.75:1 |
| Card | 2.87:1 (FAIL) | 3.48:1 (PASS) |
| Popover | 2.61:1 (FAIL) | 3.16:1 (PASS) |

### Fix 2: Primary color lightened for text link contrast (203 64% 40% -> 203 64% 48%)

**Problem:** Primary color used as text (nav links, contact page links, icons) failed 4.5:1 against dark backgrounds. At 40% lightness, primary-on-background was only 3.54:1.

**Root cause:** The original primary was optimized for white-text-on-primary-button contrast (5.02:1) but not for primary-as-foreground-text usage. Phases 11-13 added many `text-primary` usages for links and icons.

**Constraint:** No single blue can satisfy both white-on-primary >= 4.5:1 AND primary-on-dark-bg >= 4.5:1 (mathematically proven via exhaustive search across H=195-215, S=50-90%, L=35-55%).

**Fix:** Increased primary lightness from 40% to 48%, and changed primary-foreground from white (#FFFFFF) to dark (#14181F, hsl 220 20% 10%) in dark mode.

| Use Case | Before | After |
|----------|--------|-------|
| text-primary on background | 3.54:1 (FAIL) | 4.87:1 (PASS) |
| text-primary on card | 3.28:1 (FAIL) | 4.52:1 (PASS) |
| text on primary button (was white, now dark) | 5.02:1 (white) | 4.88:1 (dark) |

**Visual impact:** In dark mode, primary buttons now show dark text on blue instead of white text on blue. This is consistent with the project's existing pattern (accent and accent-warm already use dark foreground text in dark mode).

## Interactive State Verification

| State | Color Pair | Contrast | Assessment |
|-------|-----------|----------|------------|
| Hover: inactive nav -> foreground | foreground on background | 15.83:1 | PASS - clear hover change |
| Focus: ring on background | ring on background | 5.25:1 | PASS - visible focus indicator |
| Focus: ring on card | ring on card | 4.88:1 | PASS - visible on cards |
| Focus: ring on input | ring on input | 3.74:1 | PASS - visible on inputs |
| Disabled: muted-foreground on muted | muted-foreground on muted | 6.29:1 | PASS - visually distinct |
| Input vs card distinction | input on card | 1.31:1 | NOTE - low but inputs have border styling |

**Note on input distinction:** The input background (#333333) vs card background (#1C1F26) has low contrast (1.31:1), but inputs are identified by their border (which now passes at 3.48:1 on card), not solely by background color difference. This meets WCAG requirements since the border provides the visual boundary.

## Design Integrity Check

The warm blue-gray dark mode aesthetic from Phase 10 is preserved:

- Background hue: 220 (unchanged) - warm blue-gray, not pure black
- Elevation hierarchy: 10% -> 13% -> 16% (unchanged) - +3% per level
- Amber accent: dark text on bright amber (unchanged) - 8.89:1
- Turquoise accent: dark text on turquoise (unchanged) - 8.84:1
- Only border and primary adjusted; no other color variables changed
