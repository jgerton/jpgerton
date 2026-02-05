---
phase: 08-design-token-foundation
plan: 01
subsystem: design-system
tags: [design-tokens, tailwind, spacing, shadows, animation, css]
dependency_graph:
  requires: []
  provides: [spacing-scale, shadow-system, animation-tokens, easing-functions]
  affects: [08-02, 09-*, 10-*, 11-*, 12-*]
tech_stack:
  added: []
  patterns: [tailwind-v4-css-first, design-tokens]
decisions:
  - decision: "Remove legacy tailwind.config.ts in favor of CSS-first configuration"
    rationale: "Tailwind v4 @theme directive handles all configuration; JS config is redundant"
    impact: "Simpler configuration, single source of truth in globals.css"
    date: "2026-02-04"
key_files:
  created: []
  modified:
    - path: "app/globals.css"
      significance: "Added 17 design tokens across 4 systems (spacing, shadow, duration, easing)"
  deleted:
    - path: "tailwind.config.ts"
      significance: "Legacy v3 config file, all settings migrated to @theme block"
metrics:
  duration: "5 minutes"
  completed: "2026-02-04"
---

# Phase 08 Plan 01: Design Token Foundation Summary

**One-liner:** Established CSS-first design token system with spacing scale (xs-3xl on 8pt grid), 5-level shadow elevation, animation durations, and custom easing functions in Tailwind v4 @theme block.

## What Was Built

### Design Token System

Added 17 design tokens to `app/globals.css` @theme block, organized into four semantic systems:

**1. Spacing Scale (7 tokens, 8pt grid)**
- xs: 4px (half-step)
- sm: 8px (base unit)
- md: 16px (2x)
- lg: 24px (3x)
- xl: 32px (4x)
- 2xl: 48px (6x)
- 3xl: 64px (8x)

**2. Shadow Elevation System (5 tokens, progressive depth)**
- xs: Subtle lift (1px blur)
- sm: Card elevation (3px blur)
- md: Dropdown/modal (6px blur)
- lg: Prominent overlay (15px blur)
- xl: Maximum depth (25px blur)

**3. Animation Duration (3 tokens)**
- fast: 150ms (micro-interactions)
- base: 300ms (standard transitions)
- slow: 500ms (complex animations)

**4. Custom Easing Functions (2 tokens)**
- smooth: cubic-bezier(0.4, 0, 0.2, 1) - Material Design standard
- bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Playful overshoot

### Configuration Migration

**Removed:** `tailwind.config.ts` (68 lines deleted)

**Rationale:**
- Plugin loaded via `@plugin "tailwindcss-animate"` in globals.css
- All colors already defined in @theme block
- All radius values already defined in @theme block
- Font family already defined in @theme block
- Content paths auto-detected by Tailwind v4
- Dark mode handled by next-themes + Tailwind v4 default `.dark` variant

**Result:** Single source of truth for all Tailwind configuration in globals.css

## How It Works

### Token Generation

Tailwind v4's @theme directive automatically generates utility classes from CSS custom properties:

```css
@theme {
  --spacing-xs: 4px;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)...;
  --duration-fast: 150ms;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Generates utilities:
- `p-xs`, `m-xs`, `gap-xs` (spacing)
- `shadow-md` (elevation)
- `duration-fast` (animation timing)
- `ease-smooth` (transition easing)

### Design System Foundation

These tokens establish constraints for all future design work:

**Spacing:** All padding, margin, gap values must use xs-3xl scale (no arbitrary values)
**Shadows:** All elevation must use xs-xl levels (consistent depth hierarchy)
**Animation:** All transitions must use fast/base/slow durations (consistent timing feel)
**Easing:** All transitions must use smooth/bounce curves (consistent motion quality)

## Testing Performed

1. **Build Verification:** `bun run build:no-aeo` passed with zero errors
2. **Token Generation:** Confirmed utilities generate correctly by adding test classes to home page
3. **Dev Server:** Started successfully on port 3001
4. **Visual Regression:** No changes to existing UI (tokens defined but not yet applied)
5. **Configuration Migration:** Build and dev server work without tailwind.config.ts

## Decisions Made

### 1. CSS-First Configuration

**Decision:** Remove tailwind.config.ts entirely

**Why:** Tailwind v4 @theme directive is the recommended approach. All configuration (colors, fonts, radius, plugins) already migrated to globals.css.

**Impact:** Simpler project structure, single configuration file, easier maintenance.

### 2. 8pt Spacing Grid with 4px Half-Step

**Decision:** Start scale at 4px (xs) instead of 8px (sm)

**Why:** Provides fine-grained control for tight UI elements (badges, chips, inline padding) while maintaining 8pt rhythm for larger spacing.

**Impact:** More flexible spacing system without breaking grid discipline.

### 3. Five Shadow Levels

**Decision:** Use xs/sm/md/lg/xl instead of fewer or more levels

**Why:** Matches industry standard (Material Design, Tailwind, Radix). Five levels provide enough variety for typical UI hierarchy without overwhelming choice.

**Impact:** Clear elevation system for cards, dropdowns, modals, and overlays.

### 4. Three Duration Tiers

**Decision:** Use fast/base/slow instead of numeric values

**Why:** Semantic names are easier to reason about. Three tiers cover micro-interactions (fast), standard transitions (base), and complex animations (slow).

**Impact:** Consistent timing feel across all animations.

## Next Phase Readiness

### Immediate Next Steps

**Phase 08-02:** Component Token Refinement
- Apply spacing tokens to shadcn/ui components
- Apply shadow tokens to Card, DropdownMenu, Popover
- Test tokens in both light and dark mode

### Integration Points

**Phase 09 (Component Library):** Spacing and shadow tokens ready for composition layer
**Phase 10 (Typography & Color):** Foundation for additional type scale and color tokens
**Phase 12 (Animation):** Duration and easing tokens ready for scroll animations

### Known Gaps

None. All token systems are complete and verified.

## Deviations from Plan

None. Plan executed exactly as written.

## Metrics

- **Tasks completed:** 2/2
- **Commits:** 2 (feat, chore)
- **Files modified:** 1 (app/globals.css)
- **Files deleted:** 1 (tailwind.config.ts)
- **Tokens added:** 17
- **Build time:** ~3s (no impact from token addition)
- **Execution time:** ~5 minutes

## Key Files Modified

### app/globals.css
**Lines changed:** +25
**Significance:** Added all design token definitions to @theme block
**Contains:** Spacing scale, shadow elevation, animation duration, easing functions

### tailwind.config.ts
**Lines changed:** -68 (deleted)
**Significance:** Removed legacy Tailwind v3 configuration file
**Rationale:** All configuration migrated to CSS-first approach via @theme directive

## Verification

- [x] Build passes with zero errors
- [x] globals.css contains all 17 tokens (7 spacing, 5 shadow, 3 duration, 2 easing)
- [x] Token utilities generate correctly (p-xs, shadow-md, duration-fast, ease-smooth)
- [x] tailwind.config.ts successfully removed
- [x] Dev server starts without errors
- [x] No visual regressions on live site
- [x] Dark mode still functional
- [x] Colors, fonts, and radius still working from @theme block

## Risk Assessment

**Low Risk:**
- Tokens defined but not yet applied to components
- No breaking changes to existing UI
- All tests pass
- Build performance unchanged

**Future Considerations:**
- Ensure all future spacing uses token scale (no arbitrary values like `p-[13px]`)
- Monitor for shadow levels being skipped (e.g., jumping from xs to lg)
- Validate animation durations feel consistent across all interactions

## References

- **Tailwind v4 CSS-first configuration:** https://tailwindcss.com/docs/v4-beta#css-first-configuration
- **Design token research:** .planning/phases/08-design-token-foundation/08-00-RESEARCH.md
- **Material Design elevation:** https://m3.material.io/styles/elevation/overview
- **8pt grid system:** https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632
