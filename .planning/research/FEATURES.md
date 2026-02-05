# Feature Research: UI/UX Design Polish

**Domain:** Professional Agency/Portfolio Website Design Quality
**Researched:** 2026-02-04
**Confidence:** MEDIUM-HIGH (WebSearch verified with multiple sources, design pattern analysis)

## Executive Summary

This research focuses on the visual and experiential design elements that distinguish professional custom agency/portfolio sites from template-based designs. The site jpgerton.com is functionally complete but needs design polish to match the quality expected from someone selling web design services.

The research identifies three critical design layers:
1. **Foundation Design** - Typography, spacing, color systems that create visual hierarchy
2. **Interactive Polish** - Micro-interactions, animations, hover states that signal attention to detail
3. **Trust Signals** - Visual presentation patterns that build credibility (testimonials, case studies, social proof)

Key insight: The difference between "template-y" and "custom professional" is not about adding features but about refining what exists. Professional sites show intentionality through consistent spacing rhythms, purposeful motion design, and clear visual hierarchy that guides attention without demanding it.

## Feature Landscape

### Table Stakes (Users Expect These)

Visual and UX design elements every professional agency/portfolio site must have in 2026.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Consistent Typography Hierarchy** | Users need clear visual priority structure | Medium | H1 (48px), body (16px), 1.125-1.200 line height standard |
| **Generous Whitespace** | Creates breathing room, professional feel, improves readability | Low-Medium | Use consistent spacing tokens (4px/8px scales) |
| **Mobile-First Responsive** | 62.54% of web traffic is mobile, Google indexes mobile-first | High | Common breakpoints: 576px/768px/992px/1200px |
| **Fast Performance** | Speed destroys trust faster than poor color choice | High | Latency is design element, users immediately feel absence |
| **Clear Visual Hierarchy** | Guides attention without user thinking about it | Medium | Scale, weight, color, spacing work together |
| **Professional Color System** | Balanced palette with strategic accent use | Medium | Soft base tones, defined accents, WCAG AA contrast minimum |
| **Hover States on Interactive** | Confirms clickability, modern UX expectation | Low | Buttons, links, cards all need visible state changes |
| **Consistent Spacing Rhythm** | Creates cohesion, subconscious organization | Medium | Elements close together = grouped, generous gaps = separate |
| **Purpose-Driven Motion** | Functional micro-interactions provide feedback | Medium | Button states, form feedback, loading indicators (not decoration) |
| **Touch-Friendly Targets** | Mobile usability, WCAG 2.2 requirement | Low | Minimum 44x44px tap targets (WCAG 2.2 criterion) |
| **Readable Line Lengths** | Optimal 50-75 characters per line for body text | Low | Too wide = hard to track, too narrow = choppy reading |
| **WCAG 2.1 AA Compliance** | Legal requirement for gov sites (April 2026), best practice | Medium | Color contrast 4.5:1 text, 3:1 UI, keyboard nav, focus indicators |

### Differentiators (Competitive Advantage)

Design elements that elevate above template quality and signal custom professional work.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Custom Bento Grid Layout** | Modern modular approach, 67% of SaaS sites use variants | Medium | Asymmetric cards, varied element sizes, stacks cleanly on mobile |
| **Intentional Micro-Animations** | Builds trust through polish, "micro-delight" philosophy | Medium | Subtle button bounces, form field reactions, entrance animations |
| **Scroll-Triggered Animations** | Reveals content progressively, shows technical craft | Medium-High | Entrance animations as elements come into viewport |
| **Kinetic Typography** | Text that moves/reacts to interactions, modern 2026 trend | High | Type that stretches, rotates, responds to cursor proximity |
| **Glassmorphism Effects** | Translucent surfaces, blurred backgrounds, adds depth | Medium | Creates hierarchy without clutter, popular in 2026 |
| **Custom Cursor Interactions** | Cursor changes near clickable areas, shows attention | Medium | Signals interactive zones before hover state |
| **Parallax Scrolling (Subtle)** | Gentle depth effect on hero sections | Medium | Must not sacrifice performance or mobile UX |
| **Split-Screen Patterns** | Dual-audience routing made visual | Medium | Adapts cleanly between desktop/mobile breakpoints |
| **Brand-Specific Color Theory** | Goes beyond template palettes to intentional emotion | Medium | Deep navies/blues = trust, grays = flexibility, warm accents = approachable |
| **Card-Based Content Modules** | Perfect for portfolio projects, testimonials, services | Low-Medium | Responsive grid, individual clickable units |
| **Strategic Typography Pairing** | Display font + readable body, clear contrast | Medium | Bold headers with contrasting weights, generous kerning |
| **Before/After Showcases** | Visual transformation proof for WordPress service | Low-Medium | Slider or side-by-side comparison, requires client permission |
| **Testimonial Design Patterns** | Customer photos + quotes + company logos in card layout | Low-Medium | Real photos (not stock), names/titles, verification badges |
| **Case Study Visual Format** | Problem → Solution → Results with metrics, 1-2 min read | Medium | Screenshots, specific numbers, client quotes |
| **Hero Section Storytelling** | Emotional tone first, clarity second, CTA third | Medium | Large typography, clear value prop, visual hierarchy |
| **Proof-Driven Content** | Metrics, screenshots, client logos near CTAs | Low | Reduces skepticism at conversion points |
| **Context-Aware Animations** | Motion responds to user behavior (scroll position, hover) | High | Cursor proximity effects, scroll-based reveals |
| **Consistent Button System** | Primary/secondary/tertiary hierarchy with clear states | Low-Medium | Size, color, weight differentiate importance |
| **Custom 404/Error Pages** | Brand personality extends to error states | Low | Shows attention to complete experience |

### Anti-Features (Commonly Requested, Often Problematic)

Design trends to avoid for warm, approachable, professional agency brand serving dual audiences.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Overly Complex Animations** | Showcasing technical skills | Distracts from content, hurts performance (7%/sec conversion loss), frustrates users | Subtle purposeful micro-interactions only |
| **Auto-Playing Videos/Audio** | Engagement, showcase work | Annoying, accessibility issue, performance cost, mobile data concerns | Click-to-play only, with visible play button |
| **Dark Patterns in UI** | Boost metrics short-term | Destroys trust, users evaluate honesty instantly (2026 trend) | Ethical design, clear CTAs, honest interactions |
| **Excessive Glassmorphism** | Trendy in 2026 | Can reduce readability if overused, accessibility concerns | Use sparingly for depth, maintain contrast |
| **Anti-Design 2.0 (Chaotic)** | Edgy, stands out | Inappropriate for dual audience (business owners + hiring managers) | Clean, professional, approachable (not edgy) |
| **Too Many Colors** | Showcase design skills | Looks like "branding-patchwork disaster" | Stick to one cohesive palette throughout |
| **Clever Over Clear** | Creative differentiation | If visitors think too hard about what you do, they leave | Lead with clarity, save creativity for subheadings |
| **Maximalist Navigation** | Show all capabilities | Cluttered, removes focus from work | Minimal navigation, keep focus on projects |
| **Decorative Animation** | Looks modern | Motion must serve clarity/feedback, not decoration (2026 philosophy) | Functional animations only (state changes, feedback) |
| **Stock Photography** | Fill visual gaps | Signals generic template, reduces credibility | Real client work, actual project screenshots |
| **Generic Template Vibes** | Fast to implement | Signals "can't write custom code" for developer portfolio | Custom components on framework foundation |
| **Parallax Overuse** | Show technical skill | Can be nauseating, performance issues, mobile problems | Gentle hero parallax only, test on mobile |
| **Excessive Page Transitions** | Smooth experience | Adds latency, frustrates task-oriented users | Instant navigation, subtle in-page animations only |
| **Hover-Only Information** | Clean minimal design | Fails on mobile (62% of traffic), accessibility issue | Show key info by default, hover enhances |
| **Every UX Trend at Once** | Stay current | Looks scattered, no cohesive identity | Pick 2-3 trends that fit brand, execute well |
| **One-Page Everything** | Simplified navigation | Poor SEO, hard to share specific sections, performance | Strategic multi-page with clear hierarchy |

## Feature Dependencies

```
DESIGN FOUNDATION (Do First):
├── Typography System
│   ├── Font pairing selection (display + body)
│   ├── Scale definition (H1-H6, body, small)
│   ├── Line height standards (1.125-1.200 body, 1.1-1.3 headings)
│   └── Responsive sizing (fluid typography)
├── Spacing System
│   ├── Token definition (4px/8px base scale)
│   ├── Consistent rhythm across all components
│   └── Whitespace rules (grouping vs separation)
├── Color System
│   ├── Base palette (neutrals, backgrounds)
│   ├── Accent colors (CTAs, highlights)
│   ├── Semantic colors (success, error, warning)
│   └── WCAG AA contrast verification
└── Component Design System
    ├── Button hierarchy (primary/secondary/tertiary)
    ├── Card patterns (projects, testimonials, services)
    ├── Form styling (inputs, labels, validation states)
    └── Navigation patterns (mobile + desktop)

INTERACTIVE POLISH (After Foundation):
├── Hover States
│   ├── Buttons (color shift, scale, shadow)
│   ├── Links (underline, color change)
│   ├── Cards (lift effect, border highlight)
│   └── Images (zoom, overlay reveal)
├── Micro-Animations
│   ├── Button interactions (press, release, disabled)
│   ├── Form feedback (validation, submission)
│   ├── Loading states (spinners, skeleton screens)
│   └── Success confirmations (checkmarks, toasts)
├── Scroll Animations
│   ├── Entrance effects (fade-in, slide-up) on viewport entry
│   ├── Parallax (subtle hero section only)
│   └── Scroll progress indicators (if long-form content)
└── Transition System
    ├── Duration standards (150ms micro, 300ms standard, 500ms complex)
    ├── Easing curves (ease-out for enter, ease-in for exit)
    └── Performance budget (60fps, no jank)

TRUST SIGNAL DESIGN (After Polish):
├── Testimonial Presentation
│   ├── Photo + name + title + company layout
│   ├── Quote styling (visual hierarchy, readability)
│   ├── Star ratings or verification badges
│   └── Card or carousel pattern
├── Case Study Format
│   ├── Hero image + title
│   ├── Problem statement (visual callout)
│   ├── Solution steps (numbered or timeline)
│   ├── Results metrics (large numbers, visual emphasis)
│   └── Client quote (highlighted section)
├── Social Proof Display
│   ├── Client logo grid (grayscale + hover color)
│   ├── Before/after sliders (WordPress service)
│   ├── Google Reviews integration (stars + count)
│   └── Metrics callouts (projects completed, years experience)
└── CTA Design Patterns
    ├── Strategic placement (above fold, mid-page, end-page)
    ├── Dual CTAs (WordPress booking vs custom inquiry)
    ├── Action-oriented copy ("Book Your $500 Site" not "Learn More")
    └── Mobile-first tap zones (thumb-friendly positioning)

ACCESSIBILITY LAYER (Parallel to All):
├── WCAG 2.1 AA Compliance
│   ├── Color contrast (4.5:1 text, 3:1 UI)
│   ├── Keyboard navigation (focus indicators, tab order)
│   ├── Screen reader support (semantic HTML, ARIA labels)
│   └── Touch targets (44x44px minimum)
├── Focus Management
│   ├── Visible focus indicators (not outline: none)
│   ├── Logical tab order
│   └── Focus trap in modals
└── Reduced Motion Support
    ├── prefers-reduced-motion media query
    ├── Disable animations for sensitive users
    └── Ensure functionality without animation
```

## MVP Definition

### Launch With (v1.1 - Design Polish)

**Foundation (Week 1):**
1. Typography system implementation (font pairing, scale, line height)
2. Spacing system refinement (consistent tokens, rhythm fixes)
3. Color system audit (WCAG AA compliance, strategic accents)
4. Component styling (buttons, cards, forms with hierarchy)

**Polish (Week 2):**
5. Hover states on all interactive elements
6. Micro-animations for button/form feedback
7. Entrance animations on scroll (fade-in, slide-up)
8. Mobile-responsive touch targets (44x44px minimum)

**Trust Signals (Week 3):**
9. Testimonial card redesign (photos, names, titles, layout)
10. Case study visual format (problem-solution-results structure)
11. CTA refinement (placement, copy, visual hierarchy)
12. Social proof display (client logos, metrics callouts)

### Add After Validation (v1.2-v1.x)

**Advanced Interactions:**
- Kinetic typography effects (headers, hero section)
- Custom cursor interactions (proximity effects)
- Glassmorphism accents (card overlays, navigation)
- Parallax scrolling (subtle hero section only)

**Enhanced Patterns:**
- Before/after showcase sliders (WordPress service)
- Scroll progress indicators (if case studies added)
- Custom 404/error page design
- Loading skeleton screens

**Optimization:**
- Reduced motion support (accessibility)
- Performance budget enforcement (60fps animations)
- Advanced color theory (contextual accent shifts)

### Future Consideration (v2+)

**Experimental:**
- 3D elements (if performance allows)
- Advanced scroll-triggered narratives
- Video backgrounds (hero section, performance-tested)
- Split-screen dual-audience routing (visual bifurcation)

**Maintenance:**
- Quarterly design audit (remove dated patterns)
- A/B testing visual variations (CTA design, testimonial layout)
- Seasonal color palette shifts
- Trend incorporation (selective, brand-appropriate)

## Feature Prioritization Matrix

| Feature Category | Impact | Effort | Priority | Notes |
|------------------|--------|--------|----------|-------|
| Typography System | High | Medium | P0 | Foundation for all other design work |
| Spacing System | High | Medium | P0 | Fixes "template-y" feel immediately |
| Color Contrast Fix | High | Low | P0 | WCAG compliance, trust signal |
| Button Hierarchy | High | Low | P0 | Clear CTAs = conversions |
| Hover States | Medium | Low | P1 | Expected polish, quick wins |
| Micro-Animations | Medium | Medium | P1 | Differentiator, signals custom work |
| Testimonial Design | High | Low | P1 | Trust signal, conversion driver |
| Card Patterns | Medium | Low | P1 | Consistent component language |
| Scroll Animations | Low | Medium | P2 | Nice-to-have, performance risk |
| Glassmorphism | Low | Medium | P2 | Trendy but not essential |
| Kinetic Typography | Low | High | P3 | High effort, low conversion impact |
| Parallax Effects | Low | Medium | P3 | Overused trend, performance cost |
| Custom Cursors | Low | Low | P3 | Subtle enhancement, easy to add |

**Priority Definitions:**
- P0: Must have for professional appearance (launch blockers)
- P1: Should have for competitive differentiation (post-launch sprint)
- P2: Nice to have for elevated polish (iterative improvements)
- P3: Experimental enhancements (A/B test, optional)

## Competitor Feature Analysis

### Common Patterns in Professional Portfolios (2026)

**Typography Trends:**
- Bold display fonts (60-80px headers on desktop)
- Generous line height (1.5-1.75 for body, 1.1-1.3 for headers)
- Inter, Roboto, Open Sans for professional credibility
- Wide lettering + generous spacing = confident, authoritative feel

**Layout Trends:**
- Bento grids (67% of current SaaS landing pages)
- Card-based modules (projects, testimonials, services)
- Split-screen hero sections (dual messaging)
- Asymmetric layouts (custom feel vs centered templates)

**Color Trends:**
- Soft base tones (off-white, warm grays, not pure white)
- Strategic accent use (guides attention, not dominates)
- Dark mode toggle (common expectation for dev portfolios)
- Blue/navy for trust, warm accents for approachability

**Animation Trends:**
- Micro-interactions (functional feedback, not decoration)
- Entrance animations on scroll (fade-in standard)
- Hover states with lift effects (cards, buttons)
- Loading states (skeleton screens, not spinners)

**Trust Signal Trends:**
- Real client photos in testimonials (not stock imagery)
- Metrics in case studies (specific numbers, not vague praise)
- Client logo grids (grayscale + hover color reveal)
- Before/after comparisons (visual transformation proof)

### What Makes "Custom Professional" vs "Template-y"

| Custom Professional | Template-y |
|---------------------|------------|
| Consistent spacing rhythm (4px/8px tokens) | Inconsistent gaps, arbitrary margins |
| Intentional typography hierarchy | Default Bootstrap/Tailwind scale |
| Strategic color accents (guides attention) | Default theme colors, no contextual use |
| Purposeful micro-animations (feedback) | No interactions or excessive decoration |
| Real client work screenshots | Stock photography placeholders |
| Generous whitespace (breathing room) | Cramped or overly sparse (no rhythm) |
| Custom component design | Obvious library defaults |
| Cohesive design language | Mixed component styles |
| Subtle hover states everywhere | No feedback or jarring transitions |
| Asymmetric, bento-style layouts | Centered, symmetrical grids only |

## Audience-Specific Design Considerations

### Local Business Owners (WordPress Clients)

**Design Priorities:**
- Simplicity over sophistication (not intimidating)
- Large, clear CTAs (Book Your $500 Site)
- Visual proof (before/after sliders, local client testimonials)
- Friendly, warm color accents (approachable, not corporate)
- Minimal navigation (no confusion, direct path to booking)
- Mobile-first (likely browsing on phone during commute)

**Design Anti-Patterns:**
- Overly technical animations (confusing, not impressive)
- Corporate/cold aesthetic (need warmth, personality)
- Hidden CTAs (make booking obvious and easy)
- Developer jargon in UI (labels, tooltips should be plain language)

### Hiring Managers / Technical Evaluators

**Design Priorities:**
- Attention to detail signals (consistent spacing, micro-interactions)
- Modern design patterns (2026 trends, not dated)
- Technical craft demonstration (custom animations, performance)
- Clean code aesthetic (clear hierarchy, systematic)
- GitHub/LinkedIn integration (professional network signals)
- Case studies with depth (metrics, technical challenges solved)

**Design Anti-Patterns:**
- Overly simplified (need to show technical capability)
- Too sales-y (authenticity over marketing speak)
- No depth (surface-level project cards insufficient)
- Performance issues (speed = technical credibility signal)

**Shared Design Needs:**
- Fast load times (both audiences abandon slow sites)
- Mobile responsive (62% of traffic is mobile)
- Professional polish (credibility for both)
- Clear value proposition (understand offering quickly)
- Easy contact (friction-free conversion path)

## Implementation Notes

### Week 1: Foundation
Focus on systematic design tokens before visual polish:
- Define spacing scale (4px/8px)
- Choose font pairing (1 display + 1 body)
- Create color palette (neutrals, accents, semantics)
- Build component library (buttons, cards, forms)
- Audit WCAG AA compliance

### Week 2: Interactive Polish
Layer micro-interactions on solid foundation:
- Add hover states (buttons, links, cards, images)
- Implement button animations (press, release states)
- Form feedback (validation, error states)
- Entrance animations (scroll-triggered, fade-in/slide-up)
- Touch target audit (44x44px minimum)

### Week 3: Trust Signals
Redesign conversion-critical sections:
- Testimonials (photo + name + title card layout)
- Case studies (problem-solution-results format)
- CTA placement (above fold, mid-page, end-page)
- Social proof (client logos, metrics, reviews)
- Before/after showcases (WordPress service proof)

### Performance Budget
All animations must maintain:
- 60fps minimum (no jank)
- < 3s page load (7% conversion loss per second after)
- Mobile-first (test on actual devices, not just DevTools)
- Lighthouse score > 90 (maintain current scores)

### Testing Checklist
Before shipping each design feature:
- [ ] Mobile tested (iOS + Android)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] WCAG AA contrast verified
- [ ] Hover states + touch states present
- [ ] Reduced motion fallback
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Performance budget maintained

## Sources

### UI Design Trends & Patterns (2026)
- [Landdding: UI Design Trends 2026](https://landdding.com/blog/ui-design-trends-2026)
- [Interaction Design Foundation: 10 Most Inspirational UX Design Portfolio Examples](https://www.interaction-design.org/literature/article/the-10-most-inspirational-ux-design-portfolio-examples)
- [99designs: Best Portfolio Web Design Ideas 2026](https://99designs.com/inspiration/websites/portfolio)
- [Index.dev: 12 UI/UX Design Trends That Will Dominate 2026](https://www.index.dev/blog/ui-ux-design-trends)

### Custom vs Template Design
- [X1 Marketing: Why a Custom Website Matters More Than a Template in 2026](https://x1marketinginc.com/why-a-custom-website-matters-more-than-a-template-in-2026/)
- [Webby Template: Website Templates vs Custom Design](https://www.webbytemplate.com/blog/website-templates-vs-custom-design/)
- [Framer: Best No-Code Portfolio Websites for Designers 2026](https://supercharge.design/blog/no-code-portfolio-websites-2025)

### Micro-Interactions & Animations
- [TheeDigital: 20 Top Web Design Trends 2026](https://www.theedigital.com/blog/web-design-trends)
- [Kontra Agency: Top Web Design Trends for 2026](https://kontra.agency/top-web-design-trends-for-2026/)
- [Digital Upward: 2026 Web Design Trends - Glassmorphism, Micro-Animations](https://www.digitalupward.com/blog/2026-web-design-trends-glassmorphism-micro-animations-ai-magic/)
- [Index.dev: Web Design Trends 2026 - AI, 3D, Ambient UI & Performance](https://www.index.dev/blog/web-design-trends)

### Typography, Color & Spacing
- [NWS Digital: Website Design Trends for 2026](https://www.nwsdigital.com/Blog/Website-Design-Trends-for-2026)
- [Figma: Ultimate Guide to Typography in Design](https://www.figma.com/resource-library/typography-in-design/)
- [Bits Kingdom: Typography, Color, and Texture in 2026](https://bitskingdom.com/blog/2026-typography-color-texture/)
- [Sanjay Dey: 8 Minimalist UI Design Trends Transforming Websites in 2026](https://www.sanjaydey.com/minimalist-ui-design-clean-website-design-web-trends-2026/)
- [Toptal: How to Structure an Effective Typographic Hierarchy](https://www.toptal.com/designers/typography/typographic-hierarchy)
- [Hook Agency: 101+ Website Color Schemes For 2026](https://hookagency.com/blog/website-color-schemes/)

### Trust Signals & Social Proof
- [Storm Brain: Boost Website Credibility with Trust Signals & Social Proof](https://stormbrain.com/trust-signals-social-proof/)
- [Eagle Eye: The Singularity Observes Web Design in 2026](https://eagleeyet.net/blog/web-design/the-singularity-observes-web-design-in-2026-interfaces-intelligence-and-trust/)
- [LogRocket: 19 Social Proof Examples for Designers](https://blog.logrocket.com/ux-design/19-social-proof-examples/)
- [Blend B2B: How to Use Website Social Proof](https://www.blendb2b.com/blog/website-social-proof)

### Portfolio Design Best Practices
- [Colorlib: 19 Best Portfolio Design Trends (In 2026)](https://colorlib.com/wp/portfolio-design-trends/)
- [Site Builder Report: Portfolio Websites - 25+ Inspiring Examples (2026)](https://www.sitebuilderreport.com/inspiration/portfolio-websites)
- [Typewolf: Top 40 Favorite Designer Portfolio Sites in 2026](https://www.typewolf.com/portfolio-sites)
- [Templyo: 15 Inspiring Digital Portfolio Examples for 2026](https://templyo.io/portfolio-examples/15-inspiring-digital-portfolio-examples-for-2026)

### CTA Design & Conversion Patterns
- [Unsection: CTA Section Design Inspiration](https://www.unsection.com/category/cta-section-design)
- [EmbedSocial: 10 AI-Powered CTA Section Examples](https://embedsocial.com/blog/ai-cta-examples/)
- [Landing Page Flow: Best CTA Placement Strategies For 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- [CTA Gallery: Best Call-to-Action Inspiration for Designers](https://www.cta.gallery/)

### Design Mistakes to Avoid
- [Zach Sean: 8 Common Website Design Mistakes to Avoid in 2026](https://www.zachsean.com/post/8-common-website-design-mistakes-to-avoid-in-2026-for-better-conversions-and-user-experience)
- [Grayscale360: 10 Website Design Mistakes You Need to Stop Making in 2026](https://grayscale360.my/blog/10-website-design-mistakes-you-need-to-stop-making-in-2026/)
- [Dev Portfolio Templates: 5 Mistakes Developers Make](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [Interaction Design Foundation: Design Portfolio Mistakes That Are Costing You Jobs](https://www.interaction-design.org/literature/article/avoid-design-portfolio-mistakes-costing-jobs)

### Mobile & Responsive Design
- [Figma: Top Web Design Trends for 2026](https://www.figma.com/resource-library/web-design-trends/)
- [Whitehat SEO: Responsive Web Design - The Complete UK Guide for 2026](https://whitehat-seo.co.uk/blog/mobile-responsive-web-design)
- [Contentsquare: 10 Types of Web App Design Patterns](https://contentsquare.com/guides/web-app-design/patterns/)
- [MyTasker: Modern Web Design Trends 2026 - Best Practices](https://mytasker.com/blog/modern-web-design-trends-best-practices)

### Case Study Presentation
- [Toptal: All About Process - Dissecting Case Study Portfolios](https://www.toptal.com/designers/ui/case-study-portfolio)
- [UXFol: The Ultimate UX Case Study Template & Structure (2026)](https://blog.uxfol.io/ux-case-study-template/)
- [DesignerUp: 10 Exceptional Product Design Portfolios with Case Study Breakdowns](https://designerup.co/blog/10-exceptional-product-design-portfolios-with-case-study-breakdowns/)
- [UX Playbook: How to Write UX Case Studies That Land You Job (2026)](https://uxplaybook.org/articles/ux-case-study-minto-pyramid-structure-guide)

### Hero Section Design
- [Paper Street: Top 10 Hero Sections of 2026](https://www.paperstreet.com/blog/top-10-hero-sections/)
- [Unsection: Hero Section Design Inspiration](https://www.unsection.com/category/hero-section-design)
- [Perfect Afternoon: Hero Section Design - Best Practices & Examples for 2026](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Thrive Themes: I've Studied 50+ Hero Section Examples](https://thrivethemes.com/hero-section-examples/)

### Testimonial Design
- [Unsection: Testimonial Section Design Inspiration](https://www.unsection.com/category/testimonial-section-design)
- [Slider Revolution: Stunning Testimonial Page Design Examples](https://www.sliderrevolution.com/design/testimonial-page-design/)
- [Webflow: 8 Stellar Examples of Testimonials on a Website](https://webflow.com/blog/testimonials-on-website)
- [Framer: 8 Compelling Examples of Testimonials for Your Website](https://www.framer.com/blog/testimonials-on-website-examples/)

### Accessibility (WCAG 2026)
- [WebAIM: 2026 Predictions - The Next Big Shifts in Web Accessibility](https://webaim.org/blog/2026-predictions/)
- [accessiBe: WCAG 2.2 - What You Need to Know in 2026](https://accessibe.com/blog/knowledgebase/wcag-two-point-two)
- [W3C: WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Accessibility.works: 2026 WCAG & ADA Website Compliance Requirements](https://www.accessibility.works/blog/wcag-ada-website-compliance-standards-requirements/)

---
*Feature research for: jpgerton.com UI/UX design polish milestone*
*Researched: 2026-02-04*
*Focus: Visual and experiential design elements, not functional features*
