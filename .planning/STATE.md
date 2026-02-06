# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-04)

**Core value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.
**Current focus:** v1.1 Design Polish

## Current Position

Phase: 14 of 14 (Performance & Accessibility Validation)
Plan: 1 of 4 in phase
Status: In progress
Last activity: 2026-02-06 - Completed 14-01-PLAN.md (WCAG 2.1 AA audit and fixes)

Progress: [█████████████████████████████░..] ~93% (24/27 plans including Phase 14)

## Milestones

- v1.0 MVP - SHIPPED 2026-02-04 (7 phases, 39 plans)
- v1.1 Design Polish - ROADMAP CREATED 2026-02-04 (7 phases, 23 plan stubs)

## Performance Metrics

- v1.0: 7 phases, 39 plans, shipped 2026-02-04
- v1.1: 7 phases (8-14), 49 requirements mapped, 24/27 plans complete (Phase 14: 1/4)

## Accumulated Context

### Key Decisions

- Phase numbering continues from v1.0 (Phase 8-14 for v1.1)
- Research recommends bottom-up approach: tokens first, validation last
- CSS-only animations preferred over Framer Motion to protect Lighthouse 100 score
- Composition over modification: extend shadcn/ui via CVA variants and wrapper components
- Lora + Inter font pairing for "approachable professional" brand personality
- GPU-accelerated properties only (transform, opacity) for all animations
- Parallel opportunities: Phase 9 and 10 can overlap, Phase 11 and 12 can overlap
- [08-01] Remove legacy tailwind.config.ts in favor of CSS-first configuration (Tailwind v4 @theme directive handles all configuration)
- [08-01] 8pt spacing grid with 4px half-step (xs) for fine-grained control while maintaining grid discipline
- [08-01] Five shadow levels (xs/sm/md/lg/xl) matching industry standard elevation systems
- [08-02] All semantic colors WCAG AA compliant (4.5:1 minimum for text) across both light and dark themes
- [08-02] Dark mode accent uses dark foreground text for optimal contrast (8.84:1 ratio)
- [08-02] @theme blocks organized: static tokens in @theme, semantic mappings in @theme inline
- [08-03] Parallel execution with 08-02 successful - pages handled by 08-02, components by 08-03
- [08-03] Token-based spacing migration complete for all public pages and components (7 pages, 8 components)
- [09-02] Two-tier validation system: automatic (aria-invalid CSS) + explicit (validationState prop) for form inputs
- [09-02] Brand-tinted badge variants use 10% opacity backgrounds for subtle category differentiation
- [09-01] Keep 'default' as backward-compatible alias for 'primary' in Button variants
- [09-01] Card default elevation 'sm' matches previous styling for zero-change upgrade
- [09-01] Gradient shimmer uses bg-position shift (not keyframe animation) for GPU-friendly CSS-only approach
- [09-03] SiteNav placed inside Providers in root layout (needs ThemeProvider and navigation context)
- [09-03] Project detail back-to-projects link moved from header to content area after header removal
- [09-03] Admin pages show public SiteNav (acceptable, admin has nested layout for override later)
- [10-01] Fluid type scale uses 1.2x ratio across 400-1280px viewport range with CSS clamp()
- [10-01] Lora variable font accessed via standard font-weight property (not font-variation-settings)
- [10-01] Hero size (60-72px) exceeds standard scale for special emphasis
- [10-01] Line height scales inversely with font size (larger = tighter)
- [10-03] Amber/gold accent uses dark text (8.16:1 contrast) instead of white for optimal readability
- [10-03] Warm blue-gray dark mode (220 hue) creates premium aesthetic vs neutral black
- [10-03] Color elevation pattern: each surface level +3% lightness in dark mode for visible hierarchy
- [10-03] Border contrast fixed to meet WCAG AA UI minimum (3:1) - critical for form inputs and card boundaries
- [10-02] Serif headings (Lora) for H1/H2 content headings, sans-serif (Inter) preserved for UI labels and card text
- [10-02] Fluid type tokens applied across all public pages (text-hero, text-h1, text-h2, text-h3)
- [10-02] About page prose constrained to max-w-prose for optimal reading width (~65ch)
- [11-01] CTAButton is portfolio-specific wrapper, not a replacement for Button
- [11-01] ProjectCardEnhanced avoids CardTitle component to allow fluid type tokens
- [11-01] Warm accent color (bg-accent-warm) adds brand personality to primary CTAs
- [11-01] Image hover zoom uses GPU-optimized transform with ease-smooth transition
- [11-02] TestimonialCard uses semantic HTML (figure/blockquote/figcaption/cite) for accessibility
- [11-02] Badge color-coding for CaseStudyVisual: destructive=Challenge, secondary=Approach, default=Impact
- [11-02] Avatar sizing h-12 w-12 (larger than default) for professional testimonial presentation
- [11-02] Border-left accent (border-l-4 border-primary) provides visual emphasis without GPU properties
- [11-03] SocialProofDisplay uses elevation='flat' for informational metric displays (not interactive)
- [11-03] Component language conventions: flat=informational, sm=content, lg=interactive elevations
- [11-03] Barrel export pattern: Component exports plus type re-exports for all props interfaces
- [11-03] Metric presentation: font-serif text-h2 for values, text-sm text-muted-foreground for labels
- [12-01] Use --duration-entrance (250ms) for entrance animations instead of --duration-base (300ms) to stay within 200-250ms ceiling
- [12-01] Button press uses asymmetric timing: fast press (150ms) for responsiveness, smooth release (300ms) for natural feel
- [12-01] Focus ring transition added globally via *:focus-visible selector for consistent keyboard navigation
- [12-01] prefers-reduced-motion uses 0.01ms instead of 0ms to ensure transitionend/animationend events still fire
- [12-01] INTR-05 form validation red border fade-in verified as already implemented by Phase 9 transition-colors
- [12-02] Native Intersection Observer API used instead of libraries for zero bundle cost
- [12-02] Stagger delay capped at 450ms (9 items × 50ms) to prevent excessively long animation sequences
- [12-02] useIntersectionObserver checks prefers-reduced-motion in useEffect and immediately resolves to visible
- [12-02] transitionDelay set to 0ms when not visible to prevent visible delay on fast scrolling
- [13-01] SectionBackground, CTABanner, MidPageCTA are Server Components; only HeroWithGradient needs "use client"
- [13-01] Benefit-focused CTA copy pattern: "Get Your Business Online" not "Book Your $500 Site"
- [13-01] Home page conversion flow: Hero -> Services -> Projects -> Social Proof -> CTA Banner
- [13-01] Placeholder testimonials used with clear comment for future admin/data layer replacement
- [13-01] Featured projects limited to 3 on home page via .slice(0, 3)
- [13-01] Tailwind v4 gradient syntax: bg-linear-to-br (not bg-gradient-to-br)
- [13-02] WordPress CTA always warm/amber solid fill, custom inquiry always blue outline for instant visual differentiation
- [13-02] About page leads with "How I Work" process, not personal story, per CONTEXT.md guidance
- [13-02] Contact page gets no CTABanner since it IS the conversion page
- [13-02] CalendlyButton styled with warm accent via className override (wraps third-party PopupButton)
- [13-02] About page uses CTAButton linking to /services instead of CalendlyButton for lighter CTA presence
- [14-01] Use sr-only h2 headings to fix hierarchy gaps rather than restructuring visible layout
- [14-01] Minimal footer in root layout (not separate component) is sufficient for landmark navigation
- [14-01] "What Clients Say" promoted to h2 on home page since it introduces a distinct section

### Research Flags

- Phase 10 (Typography & Color): WCAG contrast validation methodology established in 08-02 (automated contrast calculations)
- Phase 12 (Animation): Integration approach for scroll-triggered animations needs careful performance monitoring
- Stack research recommends Framer Motion but REQUIREMENTS.md excludes it (out of scope, +50KB bundle). Use CSS animations instead.
- Future color combinations must maintain minimum 4.5:1 contrast for text, 3:1 for UI elements

### Todos

- None

### Blockers

- None

## Session Continuity

Last session: 2026-02-06
Stopped at: Completed 14-01-PLAN.md (WCAG 2.1 AA audit and fixes)
Resume file: None
Next action: Execute 14-02-PLAN.md (keyboard navigation and focus trap)

## Deployment Info

- **GitHub:** https://github.com/jgerton/jpgerton
- **Vercel Production:** https://wp-designer.vercel.app
- **Convex:** https://amicable-pony-588.convex.cloud
- **Local Dev:** http://localhost:3400 (via docker compose up)
