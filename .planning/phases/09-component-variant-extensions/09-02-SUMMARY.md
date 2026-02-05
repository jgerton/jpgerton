---
phase: 09-component-variant-extensions
plan: 02
status: complete
started: 2026-02-05T10:06:14Z
completed: 2026-02-05T10:08:45Z
duration: ~3 minutes
tasks_completed: 2/2
subsystem: ui-components
tags: [badge, input, textarea, form, cva, validation, accessibility, brand-colors]

dependency_graph:
  requires: [08-01, 08-02]
  provides: [badge-tech-variants, input-validation-states, textarea-validation-states, form-role-alert]
  affects: [09-03, 10, 11]

tech_stack:
  added: []
  patterns:
    - CVA validation state variants for form inputs
    - aria-invalid CSS auto-wiring for FormControl integration
    - Brand color opacity variants for category differentiation
    - role="alert" for accessible error announcements

key_files:
  created: []
  modified:
    - components/ui/badge.tsx
    - components/ui/input.tsx
    - components/ui/textarea.tsx
    - components/ui/form.tsx

decisions:
  - id: 09-02-01
    decision: "Use aria-invalid CSS modifiers in base classes for automatic FormControl error styling"
    rationale: "FormControl already sets aria-invalid={!!error} via Slot. Adding aria-invalid:border-destructive to base classes means zero changes needed in existing form usage."
  - id: 09-02-02
    decision: "Two-tier validation system: automatic (aria-invalid) + explicit (validationState prop)"
    rationale: "Automatic handles 90% of cases (FormControl wiring). Explicit prop handles standalone usage and success state which has no aria equivalent."
  - id: 09-02-03
    decision: "Use Omit<> in InputProps/TextareaProps to prevent type conflicts with VariantProps"
    rationale: "React.ComponentProps<'input'> and VariantProps may overlap on certain keys. Omit prevents TypeScript errors."
---

# Phase 09 Plan 02: Badge Tech Variants & Form Validation States Summary

**One-liner:** Badge gets 4 brand-tinted tech stack category variants; Input/Textarea get CVA validation states with aria-invalid auto-wiring; FormMessage gets role="alert" for accessibility.

## What Was Done

### Task 1: Badge Tech Stack Category Variants
Extended badgeVariants CVA definition with 4 new variants for tech stack categorization:

| Variant | Color | Use Case | CSS Pattern |
|---------|-------|----------|-------------|
| frontend | tech-blue | React, Next.js, TypeScript | `bg-tech-blue/10 text-tech-blue` |
| backend | corporate-blue | Node, Python, databases | `bg-corporate-blue/10 text-corporate-blue` |
| tool | turquoise | Docker, Git, VS Code | `bg-turquoise/10 text-turquoise` |
| skill | accent | Design, architecture, testing | `bg-accent/50 text-accent-foreground` |

All variants use subtle 10% opacity backgrounds (20% in dark mode) with full-color text. The 4 existing variants (default, secondary, destructive, outline) remain unchanged.

### Task 2: Input/Textarea Validation States & Form Enhancement

**Input (input.tsx):**
- Converted from inline className to CVA-powered `inputVariants`
- 3 validation states: `default` (normal border), `error` (red destructive border), `success` (green border)
- Base classes include `aria-invalid:border-destructive aria-invalid:border-2 aria-invalid:focus-visible:ring-destructive` for automatic FormControl wiring
- Exported `inputVariants` for external consumption

**Textarea (textarea.tsx):**
- Applied identical CVA pattern as Input with `textareaVariants`
- Same 3 validation states and aria-invalid auto-wiring
- Exported `textareaVariants` for external consumption

**Form (form.tsx):**
- Added `role="alert"` to FormMessage `<p>` element for screen reader announcements
- FormLabel confirmed static (no floating behavior) - uses `space-y-2` layout from FormItem
- FormControl's existing `aria-invalid={!!error}` pattern preserved and leveraged

**Auto-wiring explanation:**
When Input/Textarea is wrapped in FormControl, the Slot component passes `aria-invalid={!!error}` to the child. The `aria-invalid:` CSS modifiers in the base classes automatically apply error styling (red border + red focus ring) without any prop passing. This means the contact form and all existing forms get error styling for free.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| `dad64fd` | feat | Add tech stack category variants to Badge |
| `234fb49` | feat | Add validation state variants to Input, Textarea, and enhance Form |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added Omit<> to InputProps and TextareaProps interface definitions**
- **Found during:** Task 2
- **Issue:** Extending both `React.ComponentProps<"input">` and `VariantProps<typeof inputVariants>` could cause type conflicts if any CVA variant key overlapped with native HTML attributes
- **Fix:** Used `Omit<React.ComponentProps<"input">, keyof VariantProps<typeof inputVariants>>` to prevent potential conflicts
- **Files modified:** components/ui/input.tsx, components/ui/textarea.tsx
- **Commit:** 234fb49

## Verification Results

- [x] `bun run build` completes with zero errors
- [x] Existing Badge usages render identically (defaultVariant still "default")
- [x] New Badge variants available: frontend, backend, tool, skill
- [x] Existing Input/Textarea usages render identically (defaultVariants)
- [x] Contact form works without changes (auto-error via aria-invalid CSS)
- [x] FormMessage has role="alert" for accessibility
- [x] FormLabel is static above inputs (no absolute/transform/translate classes)
- [x] Brand color tokens (tech-blue, corporate-blue, turquoise) confirmed in globals.css
- [x] aria-invalid:border-destructive present in both input.tsx and textarea.tsx

## Next Phase Readiness

No blockers. The badge tech stack variants are ready for use in project detail pages. The validation state system is ready for any new form implementations. Existing forms benefit immediately from the aria-invalid auto-wiring.
