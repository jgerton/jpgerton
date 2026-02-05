# Requirements: jpgerton.com v1.1 Design Polish

**Defined:** 2026-02-04
**Core Value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.

## v1.1 Requirements

Requirements for Design Polish milestone. Each maps to roadmap phases (continuing from v1.0's Phase 7).

### Foundation

- [x] **FNDTN-01**: Design tokens defined in globals.css @theme (spacing scale xs-3xl, shadow system, animation durations)
- [x] **FNDTN-02**: Semantic variables audited and refined for both light and dark themes
- [ ] **FNDTN-03**: Typography system implemented with Lora (display/headlines) + Inter (body/UI) pairing
- [ ] **FNDTN-04**: Typography scale defined (H1-H6, body, small) with responsive fluid sizing
- [ ] **FNDTN-05**: Line height standards applied (1.125-1.200 body, 1.1-1.3 headings)
- [ ] **FNDTN-06**: Readable line lengths enforced (50-75 characters per line for body text)
- [x] **FNDTN-07**: Spacing rhythm consistent across all pages using token scale (4px/8px base)
- [ ] **FNDTN-08**: Color palette evaluated with warm, approachable, professional feel (brand prominence for corporate-blue, tech-blue, turquoise)
- [ ] **FNDTN-09**: WCAG AA color contrast verified (4.5:1 text, 3:1 UI) in both light and dark themes
- [ ] **FNDTN-10**: Dark mode color refinement (reduced saturation accents, intentional design, not just inverted)

### Components

- [ ] **COMP-01**: Button hierarchy system (primary/secondary/tertiary/gradient/outline) with CVA variants
- [ ] **COMP-02**: Button size variants including xl for hero CTAs
- [ ] **COMP-03**: Card elevation system (flat/sm/md/lg) with CVA variants
- [ ] **COMP-04**: Badge styling refined for tech stack tags
- [ ] **COMP-05**: Form component polish (inputs, labels, validation states, focus indicators)
- [ ] **COMP-06**: Navigation patterns refined (mobile hamburger + desktop, sticky behavior)
- [ ] **COMP-07**: Portfolio-specific composed components (ProjectCardEnhanced, HeroSection, CTAButton)
- [ ] **COMP-08**: Testimonial card component (photo + name + title + company + quote layout)
- [ ] **COMP-09**: Social proof display component (metrics callouts, years experience, projects completed)
- [ ] **COMP-10**: Consistent component language across all pages (same card style, same button hierarchy)

### Interactions

- [ ] **INTR-01**: Hover states on all interactive elements (buttons, links, cards, images)
- [ ] **INTR-02**: Button micro-animations (press/release states, loading indicators)
- [ ] **INTR-03**: Card hover effects (lift via scale transform, border highlight, shadow elevation)
- [ ] **INTR-04**: Link hover states (underline transitions, color shifts)
- [ ] **INTR-05**: Form feedback animations (validation states, error shake, success confirmation)
- [ ] **INTR-06**: Scroll-triggered entrance animations (fade-in-up on viewport entry)
- [ ] **INTR-07**: CSS keyframe animations defined in @theme (fade-in, fade-in-up, slide-in)
- [ ] **INTR-08**: Animation duration tokens enforced (150ms micro, 300ms standard, 500ms complex)
- [ ] **INTR-09**: GPU-accelerated properties only (transform, opacity) for all animations
- [ ] **INTR-10**: prefers-reduced-motion support (disable animations for sensitive users)

### Trust Signals

- [ ] **TRST-01**: Hero section storytelling (emotional tone, clear value prop, prominent CTA)
- [ ] **TRST-02**: CTA placement strategy (above fold, mid-page, end-page on key pages)
- [ ] **TRST-03**: Dual CTA design (WordPress booking vs custom inquiry, visually differentiated)
- [ ] **TRST-04**: Action-oriented CTA copy ("Book Your $500 Site" not "Learn More")
- [ ] **TRST-05**: Testimonial section design with real client presentation format
- [ ] **TRST-06**: Case study visual format (problem, solution, results with metrics)
- [ ] **TRST-07**: Metrics callouts near CTAs (projects completed, years experience, technologies)
- [ ] **TRST-08**: Visual hierarchy improvements guiding attention through conversion flow
- [ ] **TRST-09**: Professional visual elements that differentiate from generic templates (brand color prominence, custom gradients, typography personality)

### Accessibility & Dark Mode

- [ ] **A11Y-01**: WCAG 2.1 AA compliance across all pages (color contrast, semantic HTML, ARIA labels)
- [ ] **A11Y-02**: Keyboard navigation with visible focus indicators and logical tab order
- [ ] **A11Y-03**: Touch-friendly targets (44x44px minimum per WCAG 2.2)
- [ ] **A11Y-04**: Screen reader compatible (semantic HTML: nav, main, article, section)
- [ ] **A11Y-05**: Dark mode fully tested with intentional color choices (not just inverted)
- [ ] **A11Y-06**: Focus management in modals and dynamic content
- [ ] **A11Y-07**: Cross-browser validation (Chrome, Safari, Firefox)
- [ ] **A11Y-08**: Mobile responsive refinement tested on real device dimensions
- [ ] **A11Y-09**: Lighthouse scores maintained at 90+ across all categories post-polish
- [ ] **A11Y-10**: Core Web Vitals within budget (LCP < 2.5s, CLS < 0.1, FID < 100ms)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Interactions

- **ADV-01**: Kinetic typography effects (headers reacting to cursor proximity)
- **ADV-02**: Custom cursor interactions (cursor changes near interactive zones)
- **ADV-03**: Glassmorphism accents (translucent card overlays, navigation blur)
- **ADV-04**: Parallax scrolling (subtle hero section depth effect)
- **ADV-05**: Before/after showcase sliders for WordPress service proof

### Enhanced Patterns

- **ENH-01**: Custom 404/error page with brand personality
- **ENH-02**: Loading skeleton screens replacing spinners
- **ENH-03**: Scroll progress indicators for long-form content
- **ENH-04**: Split-screen dual-audience routing (visual bifurcation)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Overly complex animations | 7%/sec conversion loss, hurts performance, distracts from content |
| Auto-playing video/audio | Accessibility issue, performance cost, mobile data concerns |
| Anti-Design/chaotic aesthetic | Inappropriate for dual audience (business owners + hiring managers) |
| Stock photography | Signals generic template, reduces credibility |
| Hover-only information | Fails on 62% of mobile traffic |
| Parallax overuse | Nauseating, performance issues, mobile problems |
| Every UX trend at once | Scattered, no cohesive identity; pick 2-3 and execute well |
| Framer Motion (heavy) | +50KB bundle, -10 to -20 Lighthouse points; use CSS animations instead |
| 3D elements | Performance risk too high for current milestone |
| A/B testing infrastructure | Useful but out of scope for design polish pass |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDTN-01 | Phase 8 | Complete |
| FNDTN-02 | Phase 8 | Complete |
| FNDTN-03 | Phase 10 | Pending |
| FNDTN-04 | Phase 10 | Pending |
| FNDTN-05 | Phase 10 | Pending |
| FNDTN-06 | Phase 10 | Pending |
| FNDTN-07 | Phase 8 | Complete |
| FNDTN-08 | Phase 10 | Pending |
| FNDTN-09 | Phase 10 | Pending |
| FNDTN-10 | Phase 10 | Pending |
| COMP-01 | Phase 9 | Pending |
| COMP-02 | Phase 9 | Pending |
| COMP-03 | Phase 9 | Pending |
| COMP-04 | Phase 9 | Pending |
| COMP-05 | Phase 9 | Pending |
| COMP-06 | Phase 9 | Pending |
| COMP-07 | Phase 11 | Pending |
| COMP-08 | Phase 11 | Pending |
| COMP-09 | Phase 11 | Pending |
| COMP-10 | Phase 11 | Pending |
| INTR-01 | Phase 12 | Pending |
| INTR-02 | Phase 12 | Pending |
| INTR-03 | Phase 12 | Pending |
| INTR-04 | Phase 12 | Pending |
| INTR-05 | Phase 12 | Pending |
| INTR-06 | Phase 12 | Pending |
| INTR-07 | Phase 12 | Pending |
| INTR-08 | Phase 12 | Pending |
| INTR-09 | Phase 12 | Pending |
| INTR-10 | Phase 12 | Pending |
| TRST-01 | Phase 13 | Pending |
| TRST-02 | Phase 13 | Pending |
| TRST-03 | Phase 13 | Pending |
| TRST-04 | Phase 13 | Pending |
| TRST-05 | Phase 11 | Pending |
| TRST-06 | Phase 11 | Pending |
| TRST-07 | Phase 11 | Pending |
| TRST-08 | Phase 13 | Pending |
| TRST-09 | Phase 11 | Pending |
| A11Y-01 | Phase 14 | Pending |
| A11Y-02 | Phase 14 | Pending |
| A11Y-03 | Phase 14 | Pending |
| A11Y-04 | Phase 14 | Pending |
| A11Y-05 | Phase 14 | Pending |
| A11Y-06 | Phase 14 | Pending |
| A11Y-07 | Phase 14 | Pending |
| A11Y-08 | Phase 14 | Pending |
| A11Y-09 | Phase 14 | Pending |
| A11Y-10 | Phase 14 | Pending |

**Coverage:**
- v1.1 requirements: 49 total
- Mapped to phases: 49/49
- Unmapped: 0

---
*Requirements defined: 2026-02-04*
*Last updated: 2026-02-04 after roadmap creation*
