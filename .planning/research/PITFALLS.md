# Domain Pitfalls

**Domain:** Portfolio/Agency Site Design Polish (Next.js + Tailwind v4 + shadcn/ui)
**Researched:** 2026-02-04
**Confidence:** HIGH

## Executive Summary

When polishing an existing portfolio site that sells web design services, the most dangerous pitfall is the "cobbler's children" paradox: making the designer's own site look worse than the default template it replaced. The research reveals three critical failure modes:

1. **Performance regression through design polish** - Animation, custom fonts, and visual effects that tank the existing 100/96/100 Lighthouse scores
2. **Accessibility breakage through aesthetic changes** - Color contrast failures, focus state removal, semantic structure loss that violate WCAG and hurt SEO
3. **Brand confusion through over-customization** - Breaking shadcn/ui's cohesive design system while creating inconsistent spacing, typography, and component behavior

The dual audience (non-technical local business owners + technical hiring managers) makes this especially treacherous: changes that impress one audience can alienate the other. Local business owners want warm and professional, hiring managers want clean code and good performance metrics.

---

## Critical Pitfalls

### Pitfall 1: Tailwind v4 Migration Gotchas

**What goes wrong:**
Project is using Tailwind v4 (config shows `tailwindcss: ^4.1.18`). V4 has breaking changes that look fine in dev but break in production, especially around CSS variable syntax, dark mode, and plugin compatibility. The transition-transform property now uses 4 separate properties (transform, translate, scale, rotate) that the upgrade tool doesn't catch.

**Why it happens:**
- V4's CSS-first approach replaces JavaScript config with @theme directive
- CSS variable syntax changed: `bg-[--brand-color]` becomes `bg-(--brand-color)`
- Dark mode behavior changed fundamentally
- Browser support now requires Safari 16.4+, Chrome 111+, Firefox 128+

**How to avoid:**
- Run visual regression tests before/after any Tailwind customization
- Test dark mode explicitly - it "does not seem to work the same way as it did in v3"
- Validate CSS variable usage follows v4 parentheses syntax
- Check that custom brand colors (corporate-blue, tech-blue, turquoise) work in both light/dark modes
- Never assume upgrade tool caught everything - manually review transition and transform utilities

**Warning signs:**
- Dark mode toggle stops working or colors look wrong
- Custom animations stutter or behave differently
- Browser console shows CSS @property errors
- Styles work in dev but break in production build

**Phase to address:** Foundation phase (Phase 1-2)

---

### Pitfall 2: Over-Animation Performance Cliff

**What goes wrong:**
Adding animations to "polish" the site (fade-ins, parallax, hover effects, page transitions) tanks page load from <3s to >8s and drops Lighthouse performance from 100 to sub-70. JavaScript-based animations cause jank and performance bottlenecks. Google explicitly states a responsive site that takes 8+ seconds to load "isn't really responsive - it's hostile."

**Why it happens:**
- Developers confuse "polished" with "animated"
- Animating properties beyond transform/opacity forces CPU rendering
- Multiple simultaneous animations overwhelm lower-end devices
- React component re-renders triggered by animation state
- Animation libraries (Framer Motion, GSAP) add bundle size

**How to avoid:**
- Restrict animations to GPU-accelerated properties only (transform, opacity)
- Animate wrapper divs with CSS to force GPU usage for 60fps
- Use Tailwind's built-in animations (already has tailwindcss-animate plugin)
- Limit simultaneous animations - if more than 3 elements animate at once, cut it
- Test on mobile/low-end devices, not just dev machine
- Add reduce-motion support: `@media (prefers-reduced-motion: reduce)`
- Weekly Lighthouse runs to catch regressions before they compound

**Warning signs:**
- Lighthouse performance score drops below 90
- Page load exceeds 3 seconds
- Janky scrolling or hover effects
- High CPU usage in Chrome DevTools Performance tab
- First Contentful Paint (FCP) regresses

**Phase to address:** Throughout all phases (continuous monitoring)

---

### Pitfall 3: shadcn/ui Customization Hell

**What goes wrong:**
Customizing shadcn/ui components to look "less generic" breaks the design system consistency, creates maintenance nightmares, and accidentally removes accessibility features. Components become YOUR problem - dependency issues (like the cmdk Combobox breakage), bundle size bloat, and manual update burden.

**Why it happens:**
- shadcn/ui copies components into your codebase - you own them
- No central theme means brand color updates require touching dozens of files
- Developers customize without understanding component structure
- Breaking changes in underlying libraries (Radix UI) break your custom components
- Button API has "questionable designs" that tempt bad customization

**How to avoid:**
- Create a central theme BEFORE customizing individual components
- Document every customization with rationale (why it differs from default)
- When changing shadcn component, test ALL interactive states (hover, focus, disabled, error, loading)
- Use semantic color tokens, not literal values: `bg-primary` not `bg-blue-500`
- Keep shadcn component customizations in a single directory (`components/ui/`)
- If updating a component, diff against current shadcn version to see what changed upstream
- Test with keyboard navigation to ensure accessibility preserved

**Warning signs:**
- Spacing inconsistencies across similar components
- Focus outlines missing or invisible
- Color contrast fails WCAG checks
- Components behave differently in light vs dark mode
- ESLint jsx-a11y warnings (project has this plugin enabled)

**Phase to address:** Design System Foundation (Phase 2)

---

### Pitfall 4: Color Contrast Failures in Dark Mode

**What goes wrong:**
83.6% of websites fail WCAG color contrast requirements. When polishing colors for "warm, approachable, professional" feel, subtle color changes on dark backgrounds become invisible. Pure black (#000000) creates halation effect and eye strain. Focus outlines blend into interface. Interactive states (hover, disabled) fail contrast checks. Sites offer dark mode toggle thinking it fixes contrast issues - it doesn't.

**Why it happens:**
- Designers test on good monitors with high contrast ratio
- HSL color variables look fine in light mode, fail in dark mode
- Simple color inversion (light to dark) creates high contrast discomfort
- Focus states rely on subtle color shifts that disappear on dark backgrounds
- Contrast checking happens as afterthought, not during design

**How to avoid:**
- Test every color combination with contrast checker (aim for WCAG AA minimum 4.5:1 for text, 3:1 for UI)
- Avoid pure black (#000000) and pure white (#ffffff) - use #0a0a0a and #fafafa instead
- Test dark mode on ACTUAL dark theme, not just inverted palette
- Ensure focus indicators are visible in BOTH themes (minimum 3:1 contrast against background)
- Check all interactive states: default, hover, focus, active, disabled, error
- Use `next-themes` package (already in deps) to test theme switching
- More than 80% of users opt for dark mode when given choice - don't treat it as afterthought

**Warning signs:**
- Browser accessibility DevTools flags contrast violations
- Focus states hard to see when tabbing through interface
- Text on colored backgrounds feels hard to read
- Dark mode looks like simple color inversion
- Hiring managers comment that site "feels hard to use"

**Phase to address:** Color System (Phase 3)

---

### Pitfall 5: Design Token Inconsistency

**What goes wrong:**
Ad-hoc spacing decisions create visual chaos: one section uses `gap-4`, another `gap-6`, third uses `gap-5`. Typography sizes vary randomly (text-base here, text-lg there). No consistent spacing scale means "fixing" one area breaks visual rhythm elsewhere. Without central tokens, updating brand color requires 40+ file changes.

**Why it happens:**
- Tailwind makes it TOO easy to use arbitrary values
- Developers pick spacing that "looks right" without system
- No design tokens defined upfront
- Each component built in isolation
- Copy-paste leads to divergent values

**How to avoid:**
- Define spacing scale in CSS variables BEFORE building components
- Tailwind config (lines 55-58) has radius variables - extend this to spacing
- Create spacing scale: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- Typography scale: `--text-xs` through `--text-5xl` with consistent line-heights
- Document the system: "Use --spacing-md (1rem) for component internal padding"
- Lint for arbitrary values: `[&:not(.arbitrary-allowed)]:gap-[17px]` should fail CI
- Run spacing audit: grep for `gap-`, `p-`, `m-` and document most common values

**Warning signs:**
- Same component has different spacing on different pages
- Visual rhythm feels "off" but can't pinpoint why
- Spacing values include oddities like `gap-7`, `p-11`, `mt-13`
- Typography line-heights inconsistent (some tight, some loose)
- Developers ask "what spacing should I use?" repeatedly

**Phase to address:** Design System Foundation (Phase 2)

---

### Pitfall 6: Mobile Responsive Regression

**What goes wrong:**
Polishing desktop design breaks mobile experience. Navigation becomes unusable, content gets cut off, touch targets too small, performance craters. Google's mobile-first indexing means sites not accessible on mobile "will not be indexed at all, regardless of their desktop performance." This is "the definitive end of desktop-first web development."

**Why it happens:**
- Designers test on desktop, assume mobile "just works"
- Responsive design treated as afterthought after desktop polish
- Fixed widths or heights break on smaller screens
- Desktop hover states don't translate to touch
- Images optimized for desktop are huge on mobile

**How to avoid:**
- Mobile-first design: build small screen first, enhance for desktop
- Test on REAL mobile devices, not just DevTools responsive mode
- Touch targets minimum 44x44px (Apple) or 48x48px (Google)
- No hover-only interactions - provide touch alternatives
- Use Next.js Image component (already using) with responsive sizes prop
- Test hamburger menu on actual phone - does it work with thumb?
- Validate scroll behavior - no horizontal scroll on mobile
- Check Lighthouse mobile score (currently 96) doesn't regress

**Warning signs:**
- Lighthouse mobile score drops below 90
- Navigation menu hard to open/close on phone
- Text requires pinch-to-zoom
- Buttons too small to tap accurately
- Horizontal scrollbar appears
- Layout shifts when rotating device

**Phase to address:** Throughout all phases (continuous validation)

---

### Pitfall 7: SEO/Accessibility Coupling Breakage

**What goes wrong:**
Design changes break accessibility AND SEO simultaneously. Technical SEO and accessibility "break in the same places" - div soup confuses screen readers and crawlers identically. Infinite scroll traps keyboard users. Hover-only navigation fails for screen readers and Google. When accessibility breaks, crawlability suffers. Organizations now correlate web accessibility with SEO performance, AI response quality, usability, and conversion rates.

**Why it happens:**
- Semantic HTML replaced with divs for "design flexibility"
- ARIA attributes removed or used incorrectly
- Heading hierarchy broken for visual design
- Links styled as buttons (or vice versa)
- JavaScript-only content that can't be parsed without pre-rendering
- Focus on visual polish ignores document structure

**How to avoid:**
- Semantic HTML first: use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`
- Heading hierarchy matters: h1 → h2 → h3, no skipping levels
- Links for navigation (`<a href>`), buttons for actions (`<button>`)
- Test with keyboard only: Tab, Shift+Tab, Enter, Space
- Use next-aeo package (already in deps) to verify structured data
- Screen reader testing: NVDA (free on Windows) or VoiceOver (Mac)
- Lighthouse accessibility audit catches 57% of issues - remaining 43% need manual testing

**Warning signs:**
- Lighthouse accessibility score drops below 100
- Can't navigate site with keyboard only
- Headings don't form logical outline
- Links announce as "link" with no context
- Google Search Console shows indexing issues
- eslint-plugin-jsx-a11y (already installed) shows warnings

**Phase to address:** Throughout all phases (validation gate)

---

### Pitfall 8: "Looks Done But Isn't" - The Generic Template Trap

**What goes wrong:**
Site gets "polished" but still looks like default shadcn/ui template. This is THE core problem: making a web designer's portfolio that screams "I used a template." Visual hierarchy weak, spacing generic, no personality, CTAs blend into content. For someone selling web design services, this is fatal credibility loss.

**Why it happens:**
- Default shadcn components used without customization
- No custom brand elements (illustrations, patterns, textures)
- Typography uses default Inter font without hierarchy
- Colors use default slate grays instead of warm brand palette
- Layout follows standard "hero → cards → footer" pattern
- No unique visual elements that say "this is Jon Gerton"

**How to avoid:**
- Identify "template smell": if it could be anyone's site, it fails
- Custom brand elements: hand-crafted illustrations, unique patterns, subtle textures
- Typography personality: adjust font weights, letter spacing, line heights
- Use the defined brand colors (corporate-blue, tech-blue, turquoise) prominently
- Visual storytelling: large banner/slider headers are cliche - avoid them
- Add personality through micro-interactions, not just big animations
- "After years of polished grids and AI-generated sameness, the industry is quietly rebelling with warmth, texture, and personality"

**Warning signs:**
- Could swap logo and it looks like someone else's site
- All components use default shadcn styling
- Color palette is slate-based neutrals only
- No custom visual elements beyond stock photos
- Typography lacks hierarchy (everything looks same weight)
- Feedback from users: "nice site" but no memorable elements

**Phase to address:** Brand Identity (Phase 4)

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or suboptimal UX.

### Pitfall 9: Weak Portfolio CTA Strategy

**What goes wrong:** CTAs say "Explore My Journey" instead of "Book Your $500 Website"
**Impact:** Conversion rate suffers - visitors unsure what action to take
**Fix:** Action hierarchy - Primary (see work), Secondary (learn about you), Tertiary (contact)
**Stats:** Right CTA in right location increases conversions 22-48%, arrow on button adds 26% clicks
**Phase:** CTA Optimization (Phase 5)

### Pitfall 10: Multiple Competing CTAs

**What goes wrong:** Every section has different CTA, creating "button festival"
**Impact:** Decision paralysis - visitors don't know which action is primary
**Fix:** One primary CTA per page, secondary CTAs visually subordinate
**Phase:** CTA Optimization (Phase 5)

### Pitfall 11: Missing Urgency Signals

**What goes wrong:** No indication of availability, booking timeline, or demand
**Impact:** Visitors delay decision, never return
**Fix:** Subtle urgency: "Currently booking projects for Q2 2026", "3 slots available this month"
**Phase:** CTA Optimization (Phase 5)

---

## Technical Debt Patterns

### Pattern 1: CSS Variable Scope Confusion
**Problem:** Mixing Tailwind v4 CSS-first config with v3 JavaScript config patterns
**Detection:** Look for mix of `@theme` directive and tailwind.config.ts extensions
**Fix:** Choose one system - v4 uses CSS `@theme`, not JS config
**Cost to fix later:** 4-8 hours refactor + regression testing

### Pattern 2: Arbitrary Value Proliferation
**Problem:** `gap-[23px]`, `text-[17px]`, `mt-[13px]` scattered throughout codebase
**Detection:** Grep for `\[.*px\]` pattern in class names
**Fix:** Replace with design tokens or add to Tailwind theme
**Cost to fix later:** 2-3 hours + visual regression testing

### Pattern 3: Inline Style Escape Hatch Overuse
**Problem:** Using `style={{}}` props instead of Tailwind classes
**Detection:** Grep for `style={{` in components
**Fix:** Convert to Tailwind utilities or CSS variables
**Cost to fix later:** 1-2 hours per component

### Pattern 4: Component Variant Duplication
**Problem:** Same button styled 5 different ways across site
**Detection:** Count button class name variations
**Fix:** Use class-variance-authority (already in deps) to centralize variants
**Cost to fix later:** 3-5 hours + testing all button instances

---

## Performance Traps

### Trap 1: Unoptimized Custom Fonts
**Risk:** Adding Google Fonts or custom typefaces incorrectly tanks FCP
**Prevention:** Use Next.js font optimization (`next/font/google`), preload font files, subset fonts
**Monitoring:** Watch First Contentful Paint in Lighthouse

### Trap 2: Large Background Images/Videos
**Risk:** Hero sections with 5MB background videos or 3000px images
**Prevention:** Use Next.js Image with priority prop for above-fold images, video poster images, lazy load below-fold content
**Monitoring:** Largest Contentful Paint (LCP) metric

### Trap 3: Render-Blocking CSS
**Risk:** Custom CSS files block initial render
**Prevention:** Inline critical CSS, defer non-critical CSS, use Tailwind's built-in tree-shaking
**Monitoring:** Total Blocking Time (TBT) metric

### Trap 4: JavaScript Bundle Bloat
**Risk:** Animation libraries, UI libraries, utilities add 200KB+ to bundle
**Prevention:** Code split with dynamic imports, tree-shake unused exports, check bundle analyzer
**Monitoring:** Lighthouse performance score, bundle size in build output

---

## "Looks Done But Isn't" Checklist

Use this to validate design polish actually improves the site:

**Visual Identity**
- [ ] Brand colors (corporate-blue, tech-blue, turquoise) used prominently, not just defined
- [ ] Typography hierarchy clear: h1 distinct from h2, p from small text
- [ ] Spacing follows consistent scale (no random gap-7, p-11, mt-13)
- [ ] Components have consistent border-radius (config has --radius variable)
- [ ] Dark mode intentionally designed, not just color inversion

**Performance**
- [ ] Lighthouse performance 90+ (currently 100, don't regress)
- [ ] Lighthouse accessibility 100 (maintain)
- [ ] Lighthouse best practices 100 (currently 100, maintain)
- [ ] Page load under 3 seconds (currently sub-3s)
- [ ] First Contentful Paint under 1.8s
- [ ] Largest Contentful Paint under 2.5s
- [ ] Cumulative Layout Shift under 0.1

**Accessibility**
- [ ] All interactive elements keyboard accessible (Tab navigation works)
- [ ] Focus indicators visible in light AND dark mode
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Semantic HTML (nav, main, article, section, aside)
- [ ] Heading hierarchy logical (no skipped levels)
- [ ] ARIA labels on icon-only buttons
- [ ] Form inputs have associated labels
- [ ] Error messages announce to screen readers

**Brand Personality**
- [ ] Site feels like "Jon Gerton" not "generic developer"
- [ ] Visual elements beyond stock components (custom illustrations, patterns, textures)
- [ ] Typography has personality (weights, spacing, rhythm)
- [ ] Micro-interactions add delight without hurting performance
- [ ] Color palette reflects "warm, approachable, professional" (not cold slate grays)
- [ ] Layout breaks away from standard template patterns

**Conversion Flow**
- [ ] Primary CTA obvious on every page (Book Your $500 Website)
- [ ] CTA hierarchy clear (primary visually dominant)
- [ ] No competing CTAs creating confusion
- [ ] Urgency signals present but not aggressive
- [ ] Path to Calendly booking frictionless
- [ ] Services page clearly explains $500 offer value

**Technical Quality**
- [ ] No console errors or warnings
- [ ] ESLint passes (no jsx-a11y violations)
- [ ] TypeScript strict mode passes
- [ ] Build succeeds without warnings
- [ ] All images use Next.js Image component
- [ ] Responsive design tested on real mobile devices
- [ ] Works in Safari, Chrome, Firefox

---

## Recovery Strategies

### If Performance Tanks
1. **Identify the culprit:** Run Lighthouse before/after specific changes
2. **Check bundle size:** `bun run build` shows size breakdown
3. **Profile with DevTools:** Performance tab shows what's slow
4. **Remove animations first:** Often the quickest win
5. **Optimize images:** Check all images use Next.js Image with proper sizes
6. **Code split:** Dynamic imports for below-fold content

### If Accessibility Breaks
1. **Run Lighthouse:** Catches 57% of issues automatically
2. **Keyboard test:** Can you navigate entire site with Tab/Enter only?
3. **Screen reader test:** NVDA on Windows, VoiceOver on Mac
4. **Contrast check:** Use browser DevTools accessibility panel
5. **Semantic HTML:** View page source, ensure proper tags
6. **Fix ESLint:** `bun run lint` shows jsx-a11y violations

### If Dark Mode Fails
1. **Test theme toggle:** Use next-themes `useTheme` hook to verify switching
2. **Check CSS variables:** All colors use `hsl(var(--variable))` syntax?
3. **Validate contrast:** Light mode passing doesn't mean dark mode does
4. **Test all states:** Hover, focus, active, disabled in both themes
5. **Browser DevTools:** Force color scheme to test without toggle

### If Design Feels Generic
1. **Audit components:** Count how many use default shadcn styling
2. **Brand color usage:** Grep for corporate-blue, tech-blue, turquoise usage
3. **Typography audit:** Check font weights, sizes, spacing variations
4. **Layout patterns:** Does structure match common templates?
5. **Visual elements:** List custom illustrations, patterns, textures (should be >3)

---

## Pitfall-to-Phase Mapping

| Pitfall | Risk Level | Phase(s) Affected | Mitigation Timing |
|---------|------------|-------------------|-------------------|
| Tailwind v4 Migration Gotchas | CRITICAL | 1-2 Foundation | Before any customization |
| Over-Animation Performance | HIGH | All phases | Continuous monitoring |
| shadcn/ui Customization Hell | HIGH | 2 Design System | Before component changes |
| Color Contrast Dark Mode | HIGH | 3 Color System | During color changes |
| Design Token Inconsistency | MEDIUM | 2 Design System | Before component work |
| Mobile Responsive Regression | HIGH | All phases | Continuous validation |
| SEO/Accessibility Coupling | CRITICAL | All phases | Validation gate |
| Generic Template Trap | MEDIUM | 4 Brand Identity | During visual polish |
| Weak CTA Strategy | MEDIUM | 5 CTA Optimization | During conversion work |

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Foundation | Tailwind v4 breaking changes | Test dark mode explicitly before building on it |
| Design System | Design token inconsistency | Define spacing/typography scale BEFORE components |
| Color System | Dark mode contrast failures | Test WCAG contrast in both themes simultaneously |
| Brand Identity | Generic template trap | Add 3+ custom visual elements (illustrations, patterns) |
| CTA Optimization | Multiple competing CTAs | One primary CTA per page, others subordinate |

---

## Sources

**Tailwind v4:**
- [Tailwind CSS v4.0 Complete Migration Guide](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)
- [Upgrading to Tailwind v4: Missing Defaults, Broken Dark Mode](https://github.com/tailwindlabs/tailwindcss/discussions/16517)
- [Tailwind CSS 4: What's New and Should You Migrate?](https://www.codewithseb.com/blog/tailwind-css-4-whats-new-migration-guide)

**Performance:**
- [React & Next.js Best Practices 2026: Performance](https://fabwebstudio.com/blog/react-nextjs-best-practices-2026-performance-scale)
- [Website Animations in 2026: Pros, Cons & Best Practices](https://www.shadowdigital.cc/resources/do-you-need-website-animations)
- [How We Boosted React Website Performance with Heavy Animations](https://medium.com/@ssd_design/how-to-improve-performance-on-a-react-website-with-heavy-design-and-animation-ae7d655da349)

**shadcn/ui:**
- [What I DON'T Like About shadcn/ui](https://dev.to/this-is-learning/what-i-dont-like-about-shadcnui-3amf)
- [How to Make Shadcn UI Components Actually Yours](https://ui.spectrumhq.in/blog/shadcn-customization-guide)
- [Customizing shadcn/ui Themes Without Breaking Updates](https://medium.com/@sureshdotariya/customizing-shadcn-ui-themes-without-breaking-updates-a3140726ca1e)

**Accessibility & SEO:**
- [SEO Accessibility: Make Your Site Searchable for All](https://searchengineland.com/guide/seo-accessibility)
- [Accessibility as a Ranking Factor: Hidden SEO Benefit [2026]](https://searchatlas.com/blog/accessibility-a11y-seo-ranking-factor-2026/)
- [Color Contrast Accessibility: Complete WCAG 2025 Guide](https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025)
- [Dark Mode Design Best Practices in 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)

**Portfolio Design:**
- [5 Mistakes Developers Make in Their Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [How to Design Portfolio Homepages That Land You Job in 2026](https://uxplaybook.org/articles/6-ux-portfolio-homepage-mistakes-2026)
- [6 Wildly Common Portfolio Mistakes Designers Make](https://workspace.fiverr.com/blog/6-wildly-common-portfolio-mistakes-designers-might-make/)

**Responsive Design:**
- [Responsive Web Design in 2026: Why Mobile-First](https://www.alfdesigngroup.com/post/responsive-web-design-why-mobile-first-ux)
- [Responsive Design Best Practices: Complete 2026 Guide](https://pxlpeak.com/blog/web-design/responsive-design-best-practices)

**Design Systems:**
- [Tailwind CSS Best Practices 2025-2026: Design Tokens](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Design Systems & Design Tokens Complete Guide](https://design.dev/guides/design-systems/)

**CTA Optimization:**
- [7 CTA Best Practices in 2026](https://thelakehousedigital.com/cta-best-practices/)
- [Conversion Optimization 2026: Small Business Guide](https://theclaymedia.com/conversion-optimization-2026/)

---

*Pitfalls research for: jpgerton.com design polish*
*Researched: 2026-02-04*
*Stack context: Next.js 16, Tailwind v4, shadcn/ui, Convex*
