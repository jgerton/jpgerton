# Roadmap: jpgerton.com

## Milestones

- [x] **v1.0 MVP** - Phases 1-7 (shipped 2026-02-04)
- [ ] **v1.1 Design Polish** - Phases 8-14 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-7) - SHIPPED 2026-02-04</summary>

### Phase 1: Infrastructure

**Goal**: Developer can run the application locally and deploy to production with proper Git workflow and styling capabilities.
**Plans**: 5 plans

Plans:

- [x] 01-01: Initialize Next.js 14 with Git branching (main/develop)
- [x] 01-02: Create Dockerized development environment with hot reload
- [x] 01-03: Integrate Convex backend with type-safe queries
- [x] 01-04: Configure Tailwind, shadcn/ui, and dark mode toggle
- [x] 01-05: Setup GitHub Actions CI and Vercel deployment

### Phase 2: Projects & Home

**Goal**: Visitor can view Jon's portfolio of 6 indie projects with descriptions, tech stacks, and links.
**Plans**: 4 plans

Plans:

- [x] 02-01: Convex schema, project queries, and Next.js image config
- [x] 02-02: Install nuqs and create portfolio components (ProjectCard, ProjectGrid, HeroSection, ProjectFilters)
- [x] 02-03: Assemble home page, projects index, and project detail pages
- [x] 02-04: Seed 6 projects and visual verification

### Phase 3: Services & Contact

**Goal**: Local business owner can understand the $500 WordPress offer and book a discovery call.
**Plans**: 7 plans

Plans:

- [x] 03-01: Foundation: packages, schema, Zod validation, pricing components
- [x] 03-02: Backend: Convex contact mutations and Resend email action
- [x] 03-03: Components: Calendly button and contact form
- [x] 03-04: Services page with pricing tiers and Calendly booking
- [x] 03-05: Contact page with form and thank-you page
- [x] 03-06: About page with structured content and CTAs
- [x] 03-07: Visual and functional verification

### Phase 4: Admin Dashboard

**Goal**: Jon can manage project content and contact submissions without code deployments.
**Plans**: 7 plans

Plans:

- [x] 04-01: Convex Auth setup with Password provider and login page
- [x] 04-02: Middleware for route protection and admin mutations
- [x] 04-03: Admin layout with tabs navigation and backstage styling
- [x] 04-04: Image upload zone and sortable list components (dnd-kit, react-dropzone)
- [x] 04-05: Dashboard home with stats and contacts page with inbox workflow
- [x] 04-06: Projects CRUD pages (list, create, edit) with drag-to-reorder
- [x] 04-07: Visual and functional verification

### Phase 5: SEO, AEO & Performance

**Goal**: Search engines and AI assistants can discover, index, and recommend the portfolio site with optimal performance.
**Plans**: 6 plans

Plans:

- [x] 05-01: Install SEO packages and configure root metadata with Open Graph
- [x] 05-02: Create JSON-LD schema components (LocalBusiness, Person, Service, FAQ)
- [x] 05-03: Add per-page metadata and audit semantic HTML structure
- [x] 05-04: Create sitemap.ts, robots.ts, and FAQ section with speakable markup
- [x] 05-05: Integrate Vercel Analytics, GA4, and UTM tracking for Calendly
- [x] 05-06: Configure llms.txt generation and final verification checkpoint

### Phase 6: WordPress Delivery System

**Goal**: Jon can deliver $500 WordPress sites profitably with documented processes protecting scope and payment.
**Plans**: 6 plans

Plans:

- [x] 06-01: Starter template guide with Kadence theme and plugin stack
- [x] 06-02: Content workflow documentation and client questionnaire
- [x] 06-03: Staging setup guide and migration process with Duplicator
- [x] 06-04: Scope control template and payment protection documentation
- [x] 06-05: Handoff checklist and client training guide template
- [x] 06-06: Documentation verification checkpoint

### Phase 7: Business Protection

**Goal**: Jon has legal and business safeguards that protect against nightmare clients and scope disputes before taking on $500 projects.
**Plans**: 4 plans

Plans:

- [x] 07-01: Client agreement template (signable contract)
- [x] 07-02: Client qualification checklist and hosting requirements
- [x] 07-03: Project termination protocol and warranty clarification
- [x] 07-04: Business protection verification checkpoint

</details>

### v1.1 Design Polish (In Progress)

**Milestone Goal:** The site looks and feels like a verified professional agency, not a generic shadcn/ui template. Every page demonstrates the design craft expected from someone selling web design services.

**Phase Numbering:**
- Integer phases (8, 9, 10...): Planned milestone work
- Decimal phases (8.1, 8.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 8: Design Token Foundation** - Establish spacing, shadow, and animation tokens as single source of truth in @theme
- [x] **Phase 9: Component Variant Extensions** - Extend Button, Card, Badge, Form, and Nav with CVA variants for design hierarchy
- [ ] **Phase 10: Typography & Color System** - Implement Lora + Inter font pairing, refine color palette, verify WCAG contrast
- [ ] **Phase 11: Composition Components** - Build portfolio-specific composed components (testimonials, case studies, social proof)
- [ ] **Phase 12: Animation Integration** - Add hover states, micro-interactions, scroll-triggered animations, and reduced-motion support
- [ ] **Phase 13: Page-Level Integration** - Apply design system across all pages with strategic CTA placement and visual hierarchy
- [ ] **Phase 14: Performance & Accessibility Validation** - Verify WCAG AA compliance, cross-browser testing, Lighthouse scores, Core Web Vitals

## Phase Details

### Phase 8: Design Token Foundation

**Goal**: Every design decision references a consistent token system defined in a single source of truth, eliminating arbitrary spacing, shadow, and timing values across the codebase.
**Depends on**: Phase 7 (v1.0 shipped)
**Requirements**: FNDTN-01, FNDTN-02, FNDTN-07
**Success Criteria** (what must be TRUE):
  1. Developer can use spacing utilities (p-xs through p-3xl) generated from @theme tokens, and all values resolve correctly in both light and dark mode
  2. Shadow elevation classes (shadow-xs through shadow-xl) produce visually distinct levels when applied to cards and containers
  3. Animation duration tokens (duration-fast, duration-base, duration-slow) are defined and usable in transition-duration utilities
  4. Semantic color variables in both :root and .dark are audited, and every variable used by shadcn/ui components resolves to an intentional color (no missing or defaulted values)
  5. Spacing rhythm across the site uses the token scale (4px/8px base), with no arbitrary gap/padding values outside the defined scale
**Plans**: 3 plans

Plans:
- [x] 08-01-PLAN.md - Define spacing, shadow, animation, and easing tokens in @theme and remove legacy tailwind.config.ts
- [x] 08-02-PLAN.md - Audit and refine semantic color variables for WCAG AA contrast in both themes
- [x] 08-03-PLAN.md - Migrate all public-facing pages and components to token-based spacing

### Phase 9: Component Variant Extensions

**Goal**: All shared UI components (buttons, cards, badges, forms, navigation) have a clear visual hierarchy expressed through type-safe CVA variants that designers and developers can compose without ad-hoc class overrides.
**Depends on**: Phase 8
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06
**Success Criteria** (what must be TRUE):
  1. Buttons render in five distinct hierarchy levels (primary, secondary, tertiary, gradient, outline) and three sizes (default, lg, xl), each visually distinguishable at a glance
  2. Cards render at four elevation levels (flat, sm, md, lg) with visible shadow progression, and the lg variant includes a hover shadow transition
  3. Badge component renders tech stack tags with refined styling that matches the brand color palette
  4. Form inputs, labels, and validation states render with consistent spacing, visible focus rings, and error/success visual feedback
  5. Navigation component handles mobile hamburger and desktop layout with proper sticky behavior and smooth transitions
**Plans**: 3 plans

Plans:
- [x] 09-01-PLAN.md - Extend Button and Card with CVA hierarchy variants and elevation system
- [x] 09-02-PLAN.md - Refine Badge with tech stack categories and Form/Input with validation states
- [x] 09-03-PLAN.md - Build unified site navigation with sticky header, backdrop blur, and mobile menu

### Phase 10: Typography & Color System

**Goal**: The site has a warm, approachable, professional personality through intentional font pairing (Lora for display, Inter for body) and a WCAG-verified color palette that works beautifully in both light and dark modes.
**Depends on**: Phase 8
**Requirements**: FNDTN-03, FNDTN-04, FNDTN-05, FNDTN-06, FNDTN-08, FNDTN-09, FNDTN-10
**Success Criteria** (what must be TRUE):
  1. Headlines (H1, H2) render in Lora with correct weights, and body/UI text renders in Inter, creating a visually distinct warm + professional pairing
  2. Typography scale (H1 through small) uses responsive fluid sizing that adapts across mobile, tablet, and desktop without breakpoint jumps
  3. Body text maintains 50-75 characters per line on all pages, with line height between 1.125 and 1.200
  4. Brand colors (corporate-blue, tech-blue, turquoise) are used prominently throughout the site, creating a cohesive palette that feels warm and professional rather than default/generic
  5. All text and UI elements pass WCAG AA contrast checks (4.5:1 text, 3:1 UI) in both light and dark themes, with dark mode using intentionally reduced saturation accents rather than simple inversion
**Plans**: TBD

Plans:
- [ ] 10-01: Integrate Lora variable font and define typography scale with responsive fluid sizing
- [ ] 10-02: Apply line height standards and readable line length constraints across all pages
- [ ] 10-03: Evaluate and refine color palette for brand prominence and WCAG AA compliance in both themes

### Phase 11: Composition Components

**Goal**: Portfolio-specific composed components (testimonials, case studies, social proof, enhanced cards) exist as reusable building blocks that combine ui primitives with brand personality, ready for page integration.
**Depends on**: Phase 9, Phase 10
**Requirements**: COMP-07, COMP-08, COMP-09, COMP-10, TRST-05, TRST-06, TRST-07, TRST-09
**Success Criteria** (what must be TRUE):
  1. ProjectCardEnhanced, HeroSection, and CTAButton components exist in components/portfolio/ and render with brand-specific styling distinct from default shadcn/ui
  2. TestimonialCard component displays client photo, name, title, company, and quote in a professional layout that builds credibility
  3. Case study visual format component presents problem, solution, and results with metrics in a scannable layout
  4. Social proof display component shows metrics callouts (projects completed, years experience, technologies) near conversion points
  5. All composed components use the same card style, button hierarchy, and spacing tokens, creating a consistent component language across the site
**Plans**: TBD

Plans:
- [ ] 11-01: Build ProjectCardEnhanced, HeroSection, and CTAButton composition components
- [ ] 11-02: Build TestimonialCard and case study visual format components
- [ ] 11-03: Build SocialProofDisplay and verify consistent component language across compositions

### Phase 12: Animation Integration

**Goal**: Every interactive element provides clear visual feedback through purposeful micro-interactions and entrance animations, using only GPU-accelerated properties and respecting user motion preferences.
**Depends on**: Phase 9, Phase 10
**Requirements**: INTR-01, INTR-02, INTR-03, INTR-04, INTR-05, INTR-06, INTR-07, INTR-08, INTR-09, INTR-10
**Success Criteria** (what must be TRUE):
  1. All buttons, links, cards, and images show visible hover state changes (color shift, scale, shadow elevation, or underline transition)
  2. Buttons respond to press/release with micro-animation feedback, and form inputs show animated validation states (error shake, success confirmation)
  3. Content sections animate into view on scroll (fade-in-up) with staggered timing, using CSS keyframe animations defined in @theme
  4. All animations use GPU-accelerated properties only (transform, opacity) and respect duration tokens (150ms micro, 300ms standard, 500ms complex)
  5. Users with prefers-reduced-motion enabled see no animations, and all interactive functionality works without motion
**Plans**: TBD

Plans:
- [ ] 12-01: Define CSS keyframe animations in @theme and implement hover states on all interactive elements
- [ ] 12-02: Add button micro-animations, form feedback animations, and link hover transitions
- [ ] 12-03: Implement scroll-triggered entrance animations with Intersection Observer
- [ ] 12-04: Enforce GPU-accelerated-only properties and add prefers-reduced-motion support

### Phase 13: Page-Level Integration

**Goal**: Every public-facing page applies the complete design system with strategic CTA placement, visual hierarchy that guides attention through the conversion flow, and professional visual elements that differentiate from generic templates.
**Depends on**: Phase 11, Phase 12
**Requirements**: TRST-01, TRST-02, TRST-03, TRST-04, TRST-08
**Success Criteria** (what must be TRUE):
  1. Hero section communicates emotional tone, clear value proposition, and prominent CTA with storytelling that draws visitors in
  2. Every key page has CTAs placed above fold, mid-page, and end-page, with WordPress booking and custom inquiry visually differentiated
  3. CTA copy is action-oriented ("Book Your $500 Site" not "Learn More") across all conversion points
  4. Visual hierarchy on each page guides visitor attention through a deliberate flow: value prop, proof, offer, action
  5. The overall design feels custom and intentional rather than a default template, with brand color prominence, custom gradients, and typography personality throughout
**Plans**: TBD

Plans:
- [ ] 13-01: Redesign hero section with storytelling, gradient, and prominent CTAs
- [ ] 13-02: Implement strategic CTA placement and dual CTA design across all pages
- [ ] 13-03: Apply visual hierarchy improvements and professional visual elements site-wide

### Phase 14: Performance & Accessibility Validation

**Goal**: The design polish maintains or improves the site's existing excellent performance and accessibility, with verified WCAG AA compliance, cross-browser compatibility, and Core Web Vitals within budget.
**Depends on**: Phase 13
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, A11Y-07, A11Y-08, A11Y-09, A11Y-10
**Success Criteria** (what must be TRUE):
  1. All pages pass WCAG 2.1 AA compliance checks including color contrast, semantic HTML structure, and proper ARIA labels
  2. Full keyboard navigation works with visible focus indicators, logical tab order, and focus management in modals and dynamic content
  3. All touch targets meet 44x44px minimum and the site renders correctly on real mobile device dimensions
  4. Dark mode renders with intentional color choices (not just inverted), and all states (hover, focus, active, disabled) maintain proper contrast
  5. Lighthouse scores remain at 90+ across all categories, and Core Web Vitals are within budget (LCP < 2.5s, CLS < 0.1, FID < 100ms) across Chrome, Safari, and Firefox
**Plans**: TBD

Plans:
- [ ] 14-01: WCAG 2.1 AA audit across all pages (contrast, semantic HTML, ARIA, screen reader)
- [ ] 14-02: Keyboard navigation, focus management, and touch target validation
- [ ] 14-03: Dark mode validation with intentional design review
- [ ] 14-04: Cross-browser testing, mobile responsive refinement, Lighthouse and Core Web Vitals verification

## Progress

**Execution Order:**
Phases execute in numeric order: 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14
(Phase 10 can begin in parallel with Phase 9 since both depend on Phase 8)
(Phase 12 can begin in parallel with Phase 11 since both depend on Phases 9 and 10)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Infrastructure | v1.0 | 5/5 | Complete | 2026-02-04 |
| 2. Projects & Home | v1.0 | 4/4 | Complete | 2026-02-04 |
| 3. Services & Contact | v1.0 | 7/7 | Complete | 2026-02-04 |
| 4. Admin Dashboard | v1.0 | 7/7 | Complete | 2026-02-04 |
| 5. SEO, AEO & Performance | v1.0 | 6/6 | Complete | 2026-02-04 |
| 6. WordPress Delivery System | v1.0 | 6/6 | Complete | 2026-02-04 |
| 7. Business Protection | v1.0 | 4/4 | Complete | 2026-02-04 |
| 8. Design Token Foundation | v1.1 | 3/3 | Complete | 2026-02-05 |
| 9. Component Variant Extensions | v1.1 | 3/3 | Complete | 2026-02-05 |
| 10. Typography & Color System | v1.1 | 0/3 | Not started | - |
| 11. Composition Components | v1.1 | 0/3 | Not started | - |
| 12. Animation Integration | v1.1 | 0/4 | Not started | - |
| 13. Page-Level Integration | v1.1 | 0/3 | Not started | - |
| 14. Performance & Accessibility Validation | v1.1 | 0/4 | Not started | - |

---

## Coverage

**v1.1 Requirements: 49/49 mapped**

| Category | Count | Phase(s) |
|----------|-------|----------|
| Foundation (FNDTN) | 10 | Phase 8 (3), Phase 10 (7) |
| Components (COMP) | 10 | Phase 9 (6), Phase 11 (4) |
| Interactions (INTR) | 10 | Phase 12 (10) |
| Trust Signals (TRST) | 9 | Phase 11 (4), Phase 13 (5) |
| Accessibility (A11Y) | 10 | Phase 14 (10) |

No orphaned requirements. No duplicate mappings.

---

*Roadmap created: 2026-02-04*
*Last updated: 2026-02-05 (Phase 9 complete)*
