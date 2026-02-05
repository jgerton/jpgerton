# Phase 9: Component Variant Extensions - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend shared UI components (Button, Card, Badge, Form, Navigation) with type-safe CVA variants that express clear visual hierarchy. Developers can compose these variants without ad-hoc class overrides. This phase creates the variant system only -- composition components (testimonials, case studies) belong to Phase 11.

</domain>

<decisions>
## Implementation Decisions

### Button hierarchy & gradient
- 5 hierarchy levels: primary, secondary, tertiary, gradient, outline
- 3 sizes: default, lg, xl
- Gradient variant uses a subtle shimmer effect -- mostly solid brand color with a gradient that shifts on hover, not a bold multi-color gradient
- Keep existing rounded corners (border-radius from shadcn/ui defaults), not pill-shaped
- Claude's discretion on mapping hierarchy levels to use cases (which variant goes where on the site)
- Claude's discretion on xl size placement (where it makes sense for visual hierarchy)

### Card elevation system
- 4 elevation levels via CVA: flat, sm, md, lg
- Subtle border + shadow combination for all levels (light 1px muted border combined with shadow)
- lg hover transition: shadow lift + slight scale (approximately 1.02x)
- Claude's discretion on shadow drama level (match "approachable professional" brand feel)
- Claude's discretion on dark mode surface treatment (approach that works best with Phase 8 token system)

### Badge & form refinement
- Claude's discretion on tech stack badge styling approach (colored by category, monochrome, or brand tint)
- Form validation: inline error text + red border on invalid inputs. Standard, clear, not aggressive.
- Focus indicator: visible brand-colored ring on focused inputs (accessibility-friendly, clear active field)
- Form labels: static above inputs, not floating labels
- Success state styling to match error pattern (inline text + green border or similar)

### Navigation behavior
- Mobile: hamburger menu with slide-from-right panel
- Scroll behavior: always sticky with backdrop blur (frosted glass effect when content scrolls behind)
- Active page indicator: underline accent in brand color beneath the active link
- Dark mode toggle lives in the nav bar, always accessible

### Claude's Discretion
- Button hierarchy-to-use-case mapping (which variant for CTAs, secondary actions, etc.)
- xl button size placement decisions
- Shadow progression values across 4 elevation levels
- Dark mode card surface colors
- Badge styling approach for tech stack tags
- Transition timing values for hover effects (using Phase 8 duration tokens)

</decisions>

<specifics>
## Specific Ideas

- Gradient button should feel like a "shimmer" rather than a bold rainbow -- subtle enough for a professional site but enough to draw the eye
- Card hover should feel responsive: shadow lift + slight scale gives that satisfying interactive feedback
- Nav backdrop blur creates a premium, modern feel without being distracting
- Active nav underline should be brand-colored, not just a generic underline

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 09-component-variant-extensions*
*Context gathered: 2026-02-05*
