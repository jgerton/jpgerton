# Phase 13: Page-Level Integration - Research

**Researched:** 2026-02-05
**Domain:** Next.js page composition, conversion-focused design, visual hierarchy
**Confidence:** HIGH

## Summary

Page-level integration requires orchestrating existing design system components into conversion-focused experiences. The research validates the CONTEXT.md decisions around outcome-first hero messaging, differentiated dual CTAs (warm solid vs blue outline), alternating gradient/neutral section backgrounds, and benefit-focused copy. Modern web design emphasizes transparent pricing, strategic CTA placement at three key points (above fold, mid-page, end-page), and visual hierarchy that guides attention through deliberate flows using F-pattern or Z-pattern scanning behavior.

Next.js 14 App Router composition patterns confirm keeping page components as Server Components, moving interactivity down the tree to Client Components, and using the children prop pattern to compose layouts. Tailwind v4 provides gradient utilities (`bg-linear-to-*`, `from-*`, `via-*`, `to-*`) that pair with existing design tokens for section backgrounds. The existing component library (CTAButton, TestimonialCard, SocialProofDisplay, CaseStudyVisual) provides the building blocks needed for cohesive page experiences.

**Primary recommendation:** Implement pages as Server Components using composition patterns, create reusable section components (hero with gradient, mid-page CTA, end-page CTA banner) as Client Components where needed, use existing portfolio components for content blocks, apply alternating section backgrounds with Tailwind gradient utilities, and validate all gradient text contrasts at color stops (minimum 4.5:1 for normal text, 3:1 for large text/UI elements).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js 14 App Router | 14.x | Page composition, Server/Client Components | Official routing architecture with composition patterns |
| Tailwind CSS | v4 | Gradient backgrounds, section layout, spacing | Utility-first CSS with native gradient support |
| CVA (Class Variance Authority) | Latest | Component variant patterns | Already used in Button, Card, CTAButton |
| Radix UI (via shadcn/ui) | Latest | Accessible UI primitives | Foundation for Button, Card, Avatar components |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Convex | Latest | Data fetching for projects/testimonials | Server Component data fetching only |
| next/font/google | Built-in | Lora + Inter fonts | Already configured, no changes needed |
| lucide-react | Latest | Icons for CTAs, social proof | Existing dependency |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Server Components | Client Components everywhere | Would increase bundle size unnecessarily, violate Next.js best practices |
| Tailwind gradients | CSS custom properties | More verbose, less maintainable with utility-first approach |
| Composition pattern | Page-level components | Would lose Server Component benefits, increase complexity |

**Installation:**
No new dependencies needed. All required libraries already installed.

## Architecture Patterns

### Recommended Page Structure
```
app/
├── (home)/page.tsx          # Server Component
│   └── Uses: HeroSection, SocialProofDisplay, ProjectGrid, CTABanner
├── services/page.tsx        # Server Component
│   └── Uses: PricingCards, FAQ, CTABanner
├── about/page.tsx           # Server Component
│   └── Uses: Process cards, values, CTABanner (lighter)
└── projects/[slug]/page.tsx # Server Component
    └── Uses: CaseStudyVisual, back navigation

components/portfolio/
├── sections/                # New directory for page sections
│   ├── hero-with-gradient.tsx      # Client Component (animations)
│   ├── cta-banner.tsx              # Server Component (can be server)
│   ├── mid-page-cta.tsx            # Server Component
│   └── section-background.tsx      # Server Component (wrapper)
└── [existing components]
```

### Pattern 1: Server Component Page Composition
**What:** Pages remain Server Components, compose smaller components via children prop
**When to use:** All public-facing pages (home, services, about, projects)
**Example:**
```tsx
// app/(home)/page.tsx - Server Component
import { HeroWithGradient } from "@/components/portfolio/sections/hero-with-gradient";
import { SocialProofDisplay } from "@/components/portfolio/social-proof-display";
import { CTABanner } from "@/components/portfolio/sections/cta-banner";

export default async function HomePage() {
  const projects = await fetchQuery(api.projects.list);

  return (
    <main>
      {/* Client Component for animations */}
      <HeroWithGradient />

      {/* Server Component sections with alternating backgrounds */}
      <SectionBackground variant="gradient">
        <ServicesOverview />
      </SectionBackground>

      <SectionBackground variant="neutral">
        <FeaturedProjects projects={projects} />
      </SectionBackground>

      <SectionBackground variant="gradient">
        <SocialProofDisplay metrics={metrics} />
      </SectionBackground>

      {/* End-page conversion point */}
      <CTABanner intent="warm" />
    </main>
  );
}
```

### Pattern 2: Gradient Section Backgrounds
**What:** Alternating gradient and neutral section backgrounds for visual rhythm
**When to use:** All pages with multiple sections, creates separation without explicit dividers
**Example:**
```tsx
// components/portfolio/sections/section-background.tsx
import { cn } from "@/lib/utils";

interface SectionBackgroundProps {
  variant: "gradient" | "neutral" | "muted";
  children: React.ReactNode;
  className?: string;
}

export function SectionBackground({
  variant,
  children,
  className
}: SectionBackgroundProps) {
  const backgrounds = {
    gradient: "bg-linear-to-br from-primary/5 via-tech-blue/5 to-primary/5",
    neutral: "bg-background",
    muted: "bg-muted/30"
  };

  return (
    <section className={cn(
      "py-3xl px-md", // Standard section padding from design tokens
      backgrounds[variant],
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
```

### Pattern 3: Dual CTA Strategy
**What:** Differentiated CTAs using color + style coding (warm solid vs blue outline)
**When to use:** Above fold, mid-page on Home/Services; lighter on About/Projects
**Example:**
```tsx
// Hero dual CTA
<div className="flex flex-col sm:flex-row gap-md justify-center">
  <CTAButton asChild intent="warm" size="xl">
    <Link href="/services">Get Your Business Online</Link>
  </CTAButton>
  <Button asChild variant="outline" size="lg">
    <Link href="/projects">See My Work</Link>
  </Button>
</div>

// Mid-page CTA (Services page after pricing table)
<div className="text-center py-2xl">
  <h2 className="font-serif text-h2 mb-md">Ready to Get Started?</h2>
  <CTAButton intent="warm" size="xl">Book Your Site</CTAButton>
</div>

// End-page CTA banner
<SectionBackground variant="gradient" className="py-3xl">
  <div className="text-center max-w-3xl mx-auto">
    <h2 className="font-serif text-h2 mb-md">
      Let's Build Something Great Together
    </h2>
    <p className="text-lg text-muted-foreground mb-xl">
      Whether you need a quick WordPress site or a custom solution,
      I'll help you get online and start growing.
    </p>
    <CTAButton intent="warm" size="xl">Start Your Project</CTAButton>
  </div>
</SectionBackground>
```

### Pattern 4: Visual Hierarchy with F-Pattern Layout
**What:** Structure content following natural eye-scanning patterns (F or Z)
**When to use:** All pages, especially home and services
**Example:**
```tsx
// Home page F-pattern
<main>
  {/* Top horizontal bar: Hero with headline + CTAs */}
  <HeroWithGradient />

  {/* Second horizontal bar: Services overview (3 cards) */}
  <SectionBackground variant="gradient">
    <h2>What I Offer</h2>
    <ServicesGrid /> {/* Left-aligned scanning */}
  </SectionBackground>

  {/* Vertical stem: Featured projects, testimonials */}
  <SectionBackground variant="neutral">
    <FeaturedProjects />
  </SectionBackground>

  {/* Bottom CTA: Full-width conversion */}
  <CTABanner />
</main>
```

### Pattern 5: Decorative Geometric Shapes
**What:** Subtle CSS background patterns or positioned SVG shapes for depth
**When to use:** Hero sections, CTA banners (sparingly to maintain clean aesthetic)
**Example:**
```tsx
// Decorative circles as CSS pseudo-elements
<div className="relative overflow-hidden">
  {/* Content */}
  <div className="relative z-10">{children}</div>

  {/* Decorative shapes */}
  <div className="absolute top-0 right-0 w-64 h-64 rounded-full
                  bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
  <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full
                  bg-tech-blue/5 blur-3xl translate-y-1/2 -translate-x-1/2" />
</div>
```

### Anti-Patterns to Avoid
- **Importing Server Components into Client Components:** Next.js will serialize Server Components incorrectly. Use children prop pattern instead.
- **Uniform CTA placement across all pages:** Services/Home get full treatment (above fold + mid + end), About/Projects get lighter presence. Respect page context.
- **Text directly on gradient without contrast validation:** Gradients must meet 4.5:1 contrast at ALL color stops, not just one. Test lightest and darkest points.
- **Generic action-only CTA copy:** "Submit", "Click Here", "Book Now" underperform benefit-focused copy by up to 161%. Always communicate value.
- **Client Components at page level:** Unnecessary JavaScript bloat. Keep pages as Server Components, move interactivity down the tree.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Section backgrounds with consistent padding | Manual section elements per page | SectionBackground wrapper component | Ensures consistent py-3xl padding, max-w-7xl centering, gradient application across all pages |
| CTA banner layouts | Copy-paste CTA markup | CTABanner component with props | Standardizes end-page conversion point, maintains benefit-focused copy patterns |
| Gradient text contrast validation | Eyeball it or skip | WebAIM Contrast Checker at all color stops | WCAG 2.0 AA requires 4.5:1 for text, 3:1 for UI. Gradients have multiple stops to check. |
| F-pattern vs Z-pattern layout | Design from scratch | Established scanning patterns | Users scan in predictable sequences. F-pattern for text-heavy (services), Z-pattern for hero sections. |
| Server/Client Component boundaries | Make everything client | Next.js composition patterns | Server Components reduce bundle size, improve performance, keep sensitive data secure. Client Components only for interactivity. |

**Key insight:** Page-level integration is composition, not creation. The design system provides building blocks (CTAButton, Card variants, typography tokens, spacing scale). The task is orchestrating these into conversion flows, not building new primitives.

## Common Pitfalls

### Pitfall 1: Gradient Contrast Failures
**What goes wrong:** Text on gradient backgrounds fails WCAG contrast requirements because gradient has multiple color stops with varying contrast ratios.
**Why it happens:** Designers test contrast at one point (often the darkest), but gradient transitions to lighter colors where contrast drops below 4.5:1.
**How to avoid:** Test contrast at ALL color stops in gradient. For `bg-linear-to-r from-primary/5 via-tech-blue/5 to-primary/5` with dark text, verify 4.5:1 at from (primary/5), via (tech-blue/5), and to (primary/5) positions. Use WebAIM Contrast Checker.
**Warning signs:** Light text on light gradient sections, busy gradient backgrounds under body text, gradient CTAs where button text isn't clearly readable.

### Pitfall 2: Server Component Serialization Errors
**What goes wrong:** Importing Server Components directly into Client Components causes "Error: Server Components cannot be imported into Client Components" or unexpected serialization behavior.
**Why it happens:** Trying to use pattern like `import ServerComp from './server'` inside a `"use client"` file violates Next.js architecture.
**How to avoid:** Use children prop pattern. Pass Server Components as children to Client Components from a parent Server Component. Never import Server Components into Client Components.
**Warning signs:** Errors mentioning serialization, "use client" at top of file that imports other components, trying to pass functions or closures as props.

### Pitfall 3: Premature Optimization to Client Components
**What goes wrong:** Making entire pages Client Components "just in case" or because one small section needs interactivity, bloating bundle size and losing performance benefits.
**Why it happens:** Misunderstanding that interactivity requires entire tree to be client-side. React Server Components allow mixing.
**How to avoid:** Start with Server Component pages. Only add "use client" to leaf components that need interactivity (animations, onClick handlers, useState/useEffect). Push Client Components down the tree as far as possible.
**Warning signs:** "use client" at page level, large bundle sizes, hydration of static content, data fetching on client when it could be server-side.

### Pitfall 4: Generic CTA Copy
**What goes wrong:** CTAs say "Learn More", "Submit", "Click Here" instead of benefit-focused copy, resulting in lower conversion rates.
**Why it happens:** Default button text patterns, not thinking from visitor's perspective about value received.
**How to avoid:** Every CTA must answer "What do I get?" Examples: "Get Your Business Online" (not "Book Your $500 Site"), "Start Growing Today" (not "Sign Up"), "See How It Works" (not "Learn More").
**Warning signs:** Action-only verbs without benefits, vague language, CTAs that don't differentiate from generic templates.

### Pitfall 5: Inconsistent Section Spacing
**What goes wrong:** Sections have varying padding (py-2xl on some, py-3xl on others, custom values), creating uneven rhythm and unprofessional appearance.
**Why it happens:** No centralized section wrapper, different developers adding padding per section, not using design tokens consistently.
**How to avoid:** Create SectionBackground component with standard py-3xl padding. Use design tokens only (xs, sm, md, lg, xl, 2xl, 3xl). Never use arbitrary values like py-[80px].
**Warning signs:** Sections that feel cramped or too spacious, inconsistent white space between page sections, arbitrary Tailwind values in markup.

### Pitfall 6: Mobile Layout Degradation
**What goes wrong:** Desktop layouts with side-by-side content break poorly on mobile (overlapping, tiny text, horizontal scroll).
**Why it happens:** Not testing mobile breakpoints, using fixed widths, not considering touch targets for CTAs.
**How to avoid:** Use responsive grid patterns (grid-cols-1 md:grid-cols-3), test all breakpoints, ensure CTAs are minimum 44x44px touch targets, stack content vertically on mobile with appropriate gap spacing.
**Warning signs:** Horizontal scroll on mobile, CTAs too small to tap accurately, overlapping content, loss of visual hierarchy on narrow viewports.

### Pitfall 7: Overusing Decorative Elements
**What goes wrong:** Too many geometric shapes, gradients, or visual flourishes distract from content and conversion goals.
**Why it happens:** Desire to differentiate from templates leads to over-decoration. CONTEXT.md says "strategic highlights only" for amber accent.
**How to avoid:** Decorative shapes only in hero and end-page CTA banner. Limit to 2-3 subtle shapes per section using blur-3xl and low opacity (/5). Amber accent reserved for WordPress CTAs and key metrics only.
**Warning signs:** Visitor comments about "busy" design, attention drawn away from CTAs, decorative elements competing with content, amber used frequently (loses specialness).

## Code Examples

Verified patterns from official sources:

### Next.js Server/Client Composition (Official Docs)
```tsx
// Source: https://nextjs.org/docs/14/app/building-your-application/rendering/composition-patterns

// app/services/page.tsx (Server Component)
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CTABanner } from "@/components/portfolio/sections/cta-banner";
import { PricingSection } from "@/components/portfolio/sections/pricing-section";

export default async function ServicesPage() {
  // Server-side data fetching
  const testimonials = await fetchQuery(api.testimonials.list);

  return (
    <main>
      <PricingSection /> {/* Can be Server Component */}
      <TestimonialsSection testimonials={testimonials} /> {/* Server Component */}
      <CTABanner intent="warm" /> {/* Server Component */}
    </main>
  );
}

// components/portfolio/sections/hero-with-gradient.tsx (Client Component for animations)
"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

export function HeroWithGradient() {
  const { elementRef, isVisible } = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={elementRef}
      className="relative py-3xl px-md text-center overflow-hidden"
    >
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-linear-to-br from-primary via-tech-blue to-primary opacity-10" />

      {/* Content with animation */}
      <div className={cn(
        "relative z-10 max-w-4xl mx-auto",
        "opacity-0 translate-y-5 transition-[opacity,transform] duration-[var(--duration-entrance)]",
        isVisible && "opacity-100 translate-y-0"
      )}>
        <h1 className="font-serif text-hero leading-tight mb-md">
          Get Your Business Online in 5 Days
        </h1>
        {/* ... CTAs ... */}
      </div>
    </section>
  );
}
```

### Tailwind CSS Gradient Backgrounds (Official Docs)
```tsx
// Source: https://tailwindcss.com/docs/background-image

// Linear gradient with color stops
<div className="bg-linear-to-r from-primary via-tech-blue to-primary">
  Gradient background
</div>

// Gradient with position control
<div className="bg-linear-to-br from-primary/10 from-10% via-tech-blue/5 via-50% to-primary/10 to-90%">
  Subtle section background
</div>

// Alternating section backgrounds (pattern from research)
<main>
  <section className="py-3xl px-md bg-linear-to-br from-primary/5 via-tech-blue/5 to-primary/5">
    <div className="max-w-7xl mx-auto">{/* Services overview */}</div>
  </section>

  <section className="py-3xl px-md bg-background">
    <div className="max-w-7xl mx-auto">{/* Featured projects */}</div>
  </section>

  <section className="py-3xl px-md bg-muted/30">
    <div className="max-w-7xl mx-auto">{/* Social proof */}</div>
  </section>
</main>
```

### Benefit-Focused CTA Copy (Research-Verified)
```tsx
// Source: Multiple conversion optimization studies (WebSearch results)
// Benefit-focused copy converts 42-161% better than action-only

// ❌ AVOID: Action-only copy
<CTAButton>Book Your $500 Site</CTAButton>
<CTAButton>Learn More</CTAButton>
<CTAButton>Submit</CTAButton>

// ✅ CORRECT: Benefit-focused copy
<CTAButton>Get Your Business Online</CTAButton>
<CTAButton>See How It Works</CTAButton>
<CTAButton>Start Growing Today</CTAButton>

// Pattern: "Get [benefit]" or "Start [outcome]" or "See [proof]"
// Focus on what visitor receives, not what they do
```

### Strategic CTA Placement (Research-Validated)
```tsx
// Source: Multiple CTA placement studies (WebSearch results)
// Above fold + mid-page + end-page pattern for Home/Services

// Above fold (Hero)
<HeroWithGradient>
  <div className="flex gap-md justify-center">
    <CTAButton intent="warm" size="xl">Get Your Business Online</CTAButton>
    <Button variant="outline" size="lg">See My Work</Button>
  </div>
</HeroWithGradient>

// Mid-page (After value demonstration)
<SectionBackground variant="neutral">
  <FeaturedProjects projects={projects} />

  <div className="text-center mt-2xl">
    <h3 className="font-serif text-h3 mb-md">
      Ready to Stand Out Online?
    </h3>
    <CTAButton intent="warm" size="lg">Start Your Project</CTAButton>
  </div>
</SectionBackground>

// End-page (Strong closer)
<CTABanner
  headline="Let's Build Something Great Together"
  description="Whether you need a quick WordPress site or custom solution..."
  intent="warm"
/>
```

### F-Pattern Visual Hierarchy
```tsx
// Source: Eye-tracking research (WebSearch results)
// Users scan in F-pattern: two horizontal bars, one vertical stem

<main className="min-h-screen">
  {/* Top horizontal bar: Hero with gradient, outcome-first messaging */}
  <section className="py-3xl">
    <h1 className="font-serif text-hero text-center">
      Get Your Business Online in 5 Days
    </h1>
    <div className="flex justify-center gap-md">
      <CTAButton intent="warm">Primary Action</CTAButton>
      <Button variant="outline">Secondary</Button>
    </div>
  </section>

  {/* Second horizontal bar: Services overview (3 cards, left-to-right scan) */}
  <section className="py-3xl bg-linear-to-br from-primary/5 to-primary/5">
    <h2 className="font-serif text-h2">What I Offer</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
      {services.map(service => <ServiceCard key={service.id} {...service} />)}
    </div>
  </section>

  {/* Vertical stem: Deeper content (projects, testimonials) */}
  <section className="py-3xl">
    <FeaturedProjects />
  </section>

  <section className="py-3xl bg-muted/30">
    <Testimonials />
  </section>

  {/* Bottom conversion point */}
  <CTABanner />
</main>
```

### Case Study Format (Research Pattern)
```tsx
// Source: UX case study structure research (WebSearch results)
// Challenge -> Approach -> Impact with metrics

// app/projects/[slug]/page.tsx
import { CaseStudyVisual } from "@/components/portfolio/case-study-visual";

export default async function ProjectDetailPage({ params }) {
  const project = await fetchQuery(api.projects.getBySlug, {
    slug: (await params).slug
  });

  return (
    <main className="py-2xl px-md">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <Link href="/projects" className="inline-flex items-center gap-xs mb-lg">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Hero image */}
        <Image src={project.screenshotUrl} alt={project.name} />

        {/* Case study format */}
        <CaseStudyVisual
          problem={{
            heading: "The Challenge",
            content: "Client needed online presence but had zero technical knowledge..."
          }}
          solution={{
            heading: "My Approach",
            content: "Created streamlined WordPress setup with focus on ease of use..."
          }}
          results={{
            heading: "The Impact",
            content: "Client now manages their own content updates...",
            metrics: [
              "5-day delivery timeline met",
              "100% client satisfaction",
              "Zero technical support needed post-launch"
            ]
          }}
        />
      </div>
    </main>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages directory | App Router with Server/Client Components | Next.js 13 (2023) | Better composition patterns, reduced bundle size, clearer boundaries |
| Media queries only | Container queries + media queries | CSS Container Queries spec (2023) | Components respond to parent size, not viewport |
| Generic CTA copy | Benefit-focused copy | Ongoing conversion research | 42-161% higher conversion rates |
| Uniform CTA placement | Context-aware placement strategy | UX research evolution | Home/Services get 3 CTAs, About/Projects get lighter presence |
| Background images | CSS gradients + decorative shapes | Performance + accessibility focus | Faster load, better contrast control, no image optimization needed |
| Breadcrumb navigation | Back link navigation | Simpler portfolio sites (2024+) | Reduces cognitive load for simple hierarchies (portfolio has 2 levels max) |

**Deprecated/outdated:**
- **Pages directory composition:** App Router provides superior patterns with Server/Client Component boundaries
- **Full-page Client Components:** Bloats bundle unnecessarily when Server Components can handle most content
- **Action-only CTA copy:** "Learn More", "Submit", "Click Here" underperform benefit-focused alternatives significantly
- **Fixed section padding:** Arbitrary values (py-[80px]) should use design tokens (py-3xl) for consistency

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal gradient color stop positions for brand gradients**
   - What we know: Tailwind supports percentage-based stops (from-10%, via-50%, to-90%), existing tokens are --color-corporate-blue, --color-tech-blue, --color-turquoise
   - What's unclear: Whether even distribution (0%, 50%, 100%) or custom positions create better visual rhythm for alternating section backgrounds
   - Recommendation: Start with default even distribution, adjust based on visual testing. Contrast validation at all stops is mandatory regardless of positions.

2. **Decorative shape complexity vs performance impact**
   - What we know: CSS blur-3xl on positioned divs creates soft shapes, research shows decorative backgrounds are common pattern
   - What's unclear: Performance impact of multiple blur filters on mobile devices, optimal number of shapes per section
   - Recommendation: Limit to 2-3 shapes per section, use will-change: transform on animated shapes, test on low-end devices. Remove if Lighthouse score drops below 90.

3. **Mobile section reordering for conversion flow**
   - What we know: Flexbox/Grid support order property, F-pattern may not apply on mobile (Z-pattern more common)
   - What's unclear: Whether Home page "Services first" decision (CONTEXT.md) should change to "Featured project first" on mobile for visual impact
   - Recommendation: Keep order consistent across breakpoints initially (services before projects). A/B test if conversion data suggests mobile visitors engage more with project visuals than service descriptions.

4. **Mid-page CTA component design variation**
   - What we know: Above fold and end-page CTAs are specified (hero dual CTA, full-width banner), mid-page CTA is "Claude's Discretion" per CONTEXT.md
   - What's unclear: Whether mid-page CTA should be simple centered button, card-style callout, or inline flow breaker
   - Recommendation: Create three variants (simple, card, inline) as props on MidPageCTA component. Default to simple centered (least intrusive). Services page uses card variant after pricing table for emphasis.

## Sources

### Primary (HIGH confidence)
- [Next.js 14 Rendering: Composition Patterns](https://nextjs.org/docs/14/app/building-your-application/rendering/composition-patterns) - Server/Client Component patterns verified
- [Tailwind CSS background-image documentation](https://tailwindcss.com/docs/background-image) - Gradient utilities and color stop syntax verified
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG 2.0 contrast requirements
- [ACHECKS: Gradients Accessible Colour Contrasts](https://www.achecks.org/gradients-accessible-colour-contrasts-with-gradient-backgrounds/) - Gradient contrast testing methodology

### Secondary (MEDIUM confidence)
- [Visual Hierarchy in Web Design 2026: Guide to User Attention](https://theorangebyte.com/visual-hierarchy-web-design/) - F-pattern and Z-pattern scanning behavior
- [The Best CTA Placement Strategies For 2026 Landing Pages](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) - Above fold, mid-page, end-page strategy
- [9 High-Performing CTA Button Examples and Why They Work](https://www.crazyegg.com/blog/high-converting-cta-buttons/) - Benefit-focused copy impact (42-161% higher conversion)
- [The Ultimate UX Case Study Template & Structure (2026 Guide)](https://blog.uxfol.io/ux-case-study-template/) - Challenge/Approach/Impact format
- [13 Pricing Page Best Practices to Boost Conversion Rates](https://userpilot.com/blog/pricing-page-best-practices/) - Transparency and pricing table design
- [Breadcrumbs: 11 Design Guidelines for Desktop and Mobile](https://www.nngroup.com/articles/breadcrumbs/) - Navigation patterns (validated simple back link for portfolio sites)

### Tertiary (LOW confidence)
- [Web Design Trends to Expect in 2026](https://elementor.com/blog/web-design-trends-2026/) - General trends around gradients and soft design
- [Responsive Design in 2026: What's New and What's Next](https://medium.com/@netizens_technologies/responsive-design-in-2026-whats-new-and-what-s-next-137285d4f0c6) - Container queries and responsive patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, Next.js patterns from official docs
- Architecture patterns: HIGH - Server/Client composition verified with official Next.js documentation, Tailwind gradient utilities confirmed
- CTA strategy: MEDIUM - Multiple sources confirm benefit-focused copy and 3-point placement, but specific copy effectiveness requires A/B testing
- Visual hierarchy: MEDIUM - F-pattern research consistent across sources, but application to specific page layouts is interpretive
- Decorative elements: LOW - Pattern exists in research, but optimal implementation (number of shapes, blur intensity, performance impact) requires testing

**Research date:** 2026-02-05
**Valid until:** 2026-03-07 (30 days - stable domain, slow-moving best practices)
