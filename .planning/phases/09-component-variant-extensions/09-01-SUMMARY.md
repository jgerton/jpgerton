---
phase: 09-component-variant-extensions
plan: 01
subsystem: ui-components
tags: [button, card, cva, variants, design-system]
depends_on:
  requires: [08-01, 08-02]
  provides: [button-hierarchy-variants, card-elevation-system, xl-button-size]
  affects: [09-02, 09-03, 10, 11, 12]
tech-stack:
  added: []
  patterns: [cva-compound-variants, elevation-system, gradient-shimmer]
key-files:
  created: []
  modified: [components/ui/button.tsx, components/ui/card.tsx]
decisions:
  - id: 09-01-01
    decision: "Keep 'default' as alias for 'primary' in Button variants for backward compatibility"
    rationale: "Existing code uses variant='default' explicitly; removing it would break those usages"
  - id: 09-01-02
    decision: "Card default elevation 'sm' matches previous styling (border + shadow-sm)"
    rationale: "Zero-change upgrade path; all existing Card usages render identically"
  - id: 09-01-03
    decision: "Gradient shimmer uses bg-position shift rather than animation keyframes"
    rationale: "CSS-only approach avoids extra bundle weight; GPU-friendly property transition"
metrics:
  duration: ~4 minutes
  completed: 2026-02-05
---

# Phase 9 Plan 01: Button & Card CVA Variant Extensions Summary

Extended Button and Card with type-safe CVA variants for visual hierarchy: 5 button hierarchy levels with gradient shimmer, 3 button sizes including xl for hero CTAs, and 4 card elevation levels with hover lift on lg.

## What Was Done

### Task 1: Button Hierarchy Variants and Sizes

**Commit:** `9fd1d3e`

Extended `buttonVariants` CVA definition with:

- **5 hierarchy variants**: primary, secondary, tertiary, gradient, outline
- **Backward-compatible variants preserved**: default (alias for primary), destructive, ghost, link
- **New xl size**: `h-14 rounded-md px-12 text-lg` for hero CTAs
- **Gradient shimmer**: Oversized `bg-[length:200%_100%]` gradient with `hover:bg-[position:100%_0%]` shift using `transition-[background-position]` at `duration-[var(--duration-slow)]`
- **Compound variants**: gradient+xl gets `px-16` padding; outline+lg and outline+xl get `border-2`
- **Base transition**: Added `transition-colors duration-[var(--duration-base)]` to base classes for all variants
- **Default changed**: `defaultVariants.variant` set to `"primary"` (identical classes to old `"default"`)

### Task 2: Card Elevation System

**Commit:** `0fa4d64`

Converted Card from hardcoded className to CVA-powered elevation variants:

- **4 elevation levels**: flat (no shadow), sm (shadow-sm), md (shadow-md), lg (shadow-lg with hover)
- **lg hover effects**: `hover:shadow-xl hover:scale-[1.02]` with `transition-[transform,box-shadow]` using design tokens
- **CardProps interface**: Extends `VariantProps<typeof cardVariants>` for type-safe `elevation` prop
- **Export**: `cardVariants` exported alongside all existing sub-components
- **Sub-components unchanged**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter all untouched

## Verification Results

1. `bun run build` completed with zero errors (both tasks)
2. Backward compatibility confirmed:
   - `<Button>` renders as primary (identical to old default)
   - `<Button variant="default">` still works (alias preserved)
   - `<Button variant="outline">`, `variant="ghost"`, `variant="destructive"`, `variant="link"` unchanged
   - `<Card>` renders with elevation="sm" (identical to previous border + shadow-sm)
3. New variants available and type-safe:
   - `<Button variant="gradient">` with shimmer effect
   - `<Button variant="tertiary">` with muted styling
   - `<Button size="xl">` for hero CTAs
   - `<Card elevation="flat">` through `<Card elevation="lg">`

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 09-01-01 | Keep 'default' as alias for 'primary' in Button variants | Existing code uses `variant="default"` explicitly; removing it would break those usages |
| 09-01-02 | Card default elevation 'sm' matches previous styling | Zero-change upgrade path; all existing Card usages render identically |
| 09-01-03 | Gradient shimmer uses bg-position shift, not keyframe animation | CSS-only approach avoids bundle weight; GPU-friendly property |

## Next Phase Readiness

Plan 09-01 provides the foundation for:
- **09-02** (Badge/Input/Textarea variants): Same CVA pattern can be applied
- **09-03** (Navigation composition): Button variants available for nav CTAs
- **Phase 10** (Typography): Button text sizes established (text-sm default, text-lg for xl)
- **Phase 12** (Animation): Transition tokens already wired into components

No blockers for subsequent plans.
