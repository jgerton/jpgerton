# Phase 12: Animation Integration - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Add purposeful micro-interactions and entrance animations to all interactive elements. CSS-only, GPU-accelerated properties only (transform, opacity). Respects prefers-reduced-motion. No Framer Motion or JS animation libraries.

This phase adds motion to existing components and pages. It does NOT create new components, change layouts, or add page content.

</domain>

<decisions>
## Implementation Decisions

### Hover State Personality
- **Cards:** Shadow lift + subtle scale (~1.02) on hover. Card rises off the page with deepened shadow.
- **Buttons:** Gradient shimmer sweep across button on hover. Eye-catching for primary CTAs.
- **Images (thumbnails):** Slow zoom-in (Ken Burns effect) inside container on hover. Overflow hidden clips the scale.
- **Text links:** Underline slides in from left on hover. No underline at rest. Modern and clean.

### Scroll Entrance Style
- **Animation type:** Fade up (opacity 0->1 + translateY ~20px->0). Classic, professional.
- **Stagger:** Sibling groups (e.g., card rows) stagger with ~50ms delay between items. Subtle flow, not dramatic cascade.
- **Replay:** Once only. Elements animate the first time they enter viewport, stay visible permanently after.
- **Hero section:** Fully visible on page load, no scroll trigger. Scroll animations begin below the fold only.
- **Coverage:** Key sections only (~30% of elements). Project cards, testimonials, CTAs, section headings. Body text and standard content appears without animation.

### Micro-interaction Feedback
- **Button press:** Scale down on click (scale ~0.97), spring back on release. Tactile press/release feel.
- **Form validation errors:** Red border fade-in only. No shake. Calm, clear error indication.
- **Form success:** Claude's discretion - determine what fits the existing thank-you page flow.
- **Focus rings:** Animated ring expansion when element receives keyboard focus. Draws attention smoothly.

### Motion Personality & Restraint
- **Philosophy:** Refined and confident. Smooth, intentional movements. Nothing bounces or overshoots.
- **Duration ceiling:** No animation longer than ~200-250ms unless it's onboarding/hero content.
- **Easing:** Ease-out preferred over ease-in. Always feels responsive, never sluggish.
- **Properties:** Only opacity + transform. Never animate position, width, height, or color via animation (color transitions on hover are fine via CSS transition).
- **Nothing loops** unless it communicates "waiting" or "live" state.
- **Reduced motion:** prefers-reduced-motion gets NO motion at all. All animations instantly resolve to final state. Fully static experience.

### Claude's Discretion
- Exact translateY distance for fade-up (suggested ~20px, adjust to feel right)
- Specific easing curve values (cubic-bezier)
- Which exact elements qualify as "key sections" for scroll animation
- Form success animation approach (or whether to skip it)
- Intersection Observer threshold values
- Keyframe animation names and organization in @theme

</decisions>

<specifics>
## Specific Ideas

- **Linear-inspired motion principles, not Linear's visual look.** Use Linear as the motion grammar, then customize.
- Motion always explains cause -> effect
- Every animation must pass this test: "If this animation were removed, would the site feel less clear, less confident, or less trustworthy?" If no, cut it.
- Positioning: "This person sweats the details but won't waste my time."
- Good places for motion: section transitions that guide reading flow, hover states that preview capability (not decoration), small confirmations after actions
- Animate opacity + transform, never position alone

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 12-animation-integration*
*Context gathered: 2026-02-05*
