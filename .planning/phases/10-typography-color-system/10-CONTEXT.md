# Phase 10: Typography & Color System - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement Lora + Inter font pairing, define a responsive typography scale, refine the color palette with a new warm accent, and verify WCAG AA contrast in both light and dark modes. The site should feel warm, approachable, and professional rather than generic. No new components or layout changes; this phase focuses on type and color tokens applied across existing elements.

</domain>

<decisions>
## Implementation Decisions

### Font personality & weight usage
- Lora headlines should convey "warm & inviting" personality, friendly and approachable, not formal or imposing
- Serif/sans-serif boundary: Lora (serif) for H1, H2, H3, and hero tagline text. Inter (sans-serif) for H4-H6, body, UI, and everything else
- Lora weight range: Medium (500) for most headlines, SemiBold (600) for primary H1 emphasis. Balanced presence without being heavy
- Lora italic: Subtle use only, reserved for specific accent moments like hero taglines, blockquotes, or testimonial pull quotes

### Type scale & sizing
- Hero H1 target: Big & bold, approximately 60-72px on desktop
- Mobile sizing: Claude's discretion on fluid scaling ratios, just make it work well across breakpoints
- Line length: Standard readable width (~65-75 characters per line) for body text
- Heading ratio: Tight ratio (~1.2x between levels) for modern, minimalist feel with subtle size differences between H1/H2/H3

### Color palette direction
- Brand color presence: Strong, visible on every page through section backgrounds, gradients, card accents, badges, and dividers
- Warm accent: Add amber/gold tone to complement the cool blue/turquoise palette
- Amber/gold usage: CTAs (primary action buttons, booking links) plus subtle highlights (section dividers, icon accents, badge borders)
- Existing blues and turquoise remain as primary/secondary/accent foundation

### Dark mode color strategy
- Philosophy: Warm dark, dark backgrounds with a slight warm/blue-gray tint rather than pure black or neutral gray
- Brand blues in dark mode: Claude's discretion to adjust values for optimal contrast and visual balance
- Amber/gold in dark mode: Warmer and richer variant, stands out more against dark backgrounds for a premium feel
- Surface elevation: Color elevation approach (higher elements get slightly lighter backgrounds) rather than borders/shadows

### Claude's Discretion
- Exact fluid type scaling ratios and breakpoint behavior for mobile
- Dark mode blue adjustments (keep swap or modify, based on contrast testing)
- Specific amber/gold hex values and their WCAG-compliant variants
- Body text line-height within the 1.125-1.200 range specified in success criteria
- Loading strategy for Lora variable font (subset, display swap, etc.)

</decisions>

<specifics>
## Specific Ideas

- Amber/gold warm accent inspired by "honey gold" - pairs naturally with deep blue, conveys trust + premium quality
- Dark mode surfaces should use Material Design-style color elevation (lighter = higher)
- Lora italic for hero taglines gives a personal, handcrafted touch without overdoing it
- The overall palette should feel like "a local business you trust" rather than a generic tech startup

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 10-typography-color-system*
*Context gathered: 2026-02-05*
