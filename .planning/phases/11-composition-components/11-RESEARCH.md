# Phase 11: Composition Components - Research

**Researched:** 2026-02-05
**Domain:** React composition components, CVA variant patterns, portfolio UI components
**Confidence:** HIGH

## Summary

Phase 11 builds portfolio-specific composed components that combine shadcn/ui primitives with brand personality. The standard approach in React 2026 uses CVA (Class Variance Authority) for type-safe variant management, composition over inheritance for extending base components, and CSS-only GPU-accelerated animations for performance.

The project already has shadcn/ui primitives (Card, Button, Badge) with CVA variants and Tailwind v4 theming. Composition components will extend these primitives through wrapper components that add portfolio-specific styling, structure, and behavior while maintaining the established design system.

**Primary recommendation:** Build composition components as wrapper components that consume shadcn/ui primitives and add portfolio-specific structure, using CVA compound variants for conditional styling and maintaining GPU-accelerated animations (transform/opacity only) for Lighthouse 100 preservation.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| class-variance-authority | 0.7.1 (installed) | Type-safe variant management | Industry standard for variant styling in component libraries, used by shadcn/ui |
| @radix-ui/react-slot | 1.2.4 (installed) | Composition primitive for polymorphic components | Enables asChild pattern for flexible component composition |
| tailwind-merge | 3.4.0 (installed) | Smart className merging | Prevents Tailwind class conflicts in composed components |
| clsx | 2.1.1 (installed) | Conditional className utility | Lightweight utility for conditional class composition |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | 16.1.6 (installed) | Optimized image loading | Portfolio screenshots, testimonial photos, any images |
| lucide-react | 0.563.0 (installed) | Icon library | Visual indicators, UI accents in composition components |
| @radix-ui/react-avatar | 1.1.11 (installed) | Avatar primitive | Testimonial photos, author attribution |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CVA | Vanilla CSS modules | CVA provides type safety and variant API, CSS modules require manual prop handling |
| CSS-only animations | Framer Motion | CSS-only preserves Lighthouse 100, Framer Motion adds 50KB+ bundle size |
| shadcn/ui composition | Build from scratch | Composition reuses established primitives and design system, scratch loses consistency |

**Installation:**
All dependencies already installed. No additional packages required.

## Architecture Patterns

### Recommended Project Structure
```
components/
├── ui/                    # shadcn/ui primitives (Card, Button, Badge, Avatar)
├── portfolio/             # Composition components (domain-specific)
│   ├── hero-section.tsx       # Existing hero composition
│   ├── project-card.tsx       # Existing project card
│   ├── project-card-enhanced.tsx  # NEW: Enhanced version with brand styling
│   ├── cta-button.tsx         # NEW: Branded CTA button wrapper
│   ├── testimonial-card.tsx   # NEW: Client testimonial display
│   ├── case-study-visual.tsx  # NEW: Problem/solution/results layout
│   └── social-proof-display.tsx  # NEW: Metrics callout component
└── forms/                 # Form components (separate concern)
```

### Pattern 1: Wrapper Component Composition
**What:** Extend shadcn/ui primitives by wrapping them in portfolio-specific components that add structure and brand styling.
**When to use:** When you need consistent portfolio-specific behavior across multiple pages but want to preserve shadcn/ui theming and accessibility.

**Example:**
```typescript
// Source: Existing pattern in components/portfolio/project-card.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProjectCardEnhanced({ project }) {
  return (
    <Card elevation="lg" className="overflow-hidden group">
      <div className="relative aspect-video bg-muted">
        <Image
          src={project.screenshotUrl}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-[var(--duration-base)]"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-serif">{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
```

### Pattern 2: CVA Compound Variants for Conditional Styling
**What:** Use CVA's compound variants to apply styles when multiple variant conditions are met simultaneously.
**When to use:** When component appearance depends on multiple props (e.g., button intent + size combinations).

**Example:**
```typescript
// Source: Existing pattern in components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
  {
    variants: {
      variant: { primary: "bg-primary", outline: "border border-input" },
      size: { default: "h-10 px-4", lg: "h-11 px-8", xl: "h-14 px-12" },
    },
    compoundVariants: [
      { variant: "outline", size: "lg", class: "border-2" },
      { variant: "outline", size: "xl", class: "border-2" },
    ],
    defaultVariants: { variant: "primary", size: "default" },
  }
);
```

### Pattern 3: GPU-Accelerated CSS-Only Animations
**What:** Use only `transform` and `opacity` properties for animations to ensure GPU acceleration and maintain Lighthouse 100 scores.
**When to use:** All hover states, transitions, and animations in composition components.

**Example:**
```typescript
// Source: Existing pattern in components/ui/card.tsx
const cardVariants = cva("rounded-lg bg-card text-card-foreground", {
  variants: {
    elevation: {
      lg: [
        "border border-border shadow-lg",
        "transition-[transform,box-shadow] duration-[var(--duration-base)] ease-smooth",
        "hover:shadow-xl hover:scale-[1.02]",  // GPU-accelerated transform
      ].join(" "),
    },
  },
});
```

### Pattern 4: Semantic HTML with Accessible Structure
**What:** Use semantic HTML elements and proper ARIA labels to ensure accessibility.
**When to use:** All composition components, especially testimonials and case studies with complex content.

**Example:**
```typescript
// Best practice for testimonial component
export function TestimonialCard({ testimonial }) {
  return (
    <figure className="rounded-lg bg-card p-6">
      <blockquote className="text-foreground mb-4">
        <p>"{testimonial.quote}"</p>
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={testimonial.photo} alt={testimonial.name} />
          <AvatarFallback>{testimonial.initials}</AvatarFallback>
        </Avatar>
        <div>
          <cite className="font-semibold not-italic">{testimonial.name}</cite>
          <p className="text-sm text-muted-foreground">
            {testimonial.title} at {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
```

### Anti-Patterns to Avoid

- **Over-fragmentation**: Don't create excessive small components (e.g., separate components for every card section). Group related structure into single composition components.
- **Business Logic in Reusable Components**: Keep data fetching and business logic in page/container components. Composition components should be presentational.
- **Modifying shadcn/ui Source Files**: Never edit components/ui/* directly. Always extend via wrapper components or CVA variants.
- **Non-GPU Properties in Animations**: Avoid animating width, height, background-color, or other non-GPU properties. Stick to transform and opacity.
- **Bypassing TypeScript Variant Types**: Always use `VariantProps<typeof componentVariants>` to maintain type safety.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Avatar with fallback | Custom image component with error handling | @radix-ui/react-avatar (installed) | Handles loading states, fallback text generation, accessibility attributes automatically |
| Polymorphic components (asChild) | Custom render prop pattern | @radix-ui/react-slot (installed) | Type-safe polymorphism, used by shadcn/ui throughout |
| Image optimization | Custom lazy loading / srcset | next/image (installed) | Automatic WebP/AVIF conversion, lazy loading, responsive images, prevents layout shift |
| ClassName merging | Custom string concatenation | tailwind-merge + clsx (installed) | Resolves Tailwind class conflicts intelligently (e.g., "px-4 px-6" becomes "px-6") |
| Variant type inference | Manual prop types | CVA VariantProps utility | Automatically generates TypeScript types from variant definitions |
| Focus management in modals | Custom keyboard handlers | Built into @radix-ui/react-dialog (installed) | Focus trap, escape handling, scroll lock, restoration on close |

**Key insight:** shadcn/ui already provides battle-tested accessibility, keyboard navigation, and focus management. Composition components inherit these benefits automatically by wrapping primitives rather than rebuilding from scratch.

## Common Pitfalls

### Pitfall 1: Image Layout Shift in Card Grids
**What goes wrong:** Portfolio images load without dimensions, causing layout jumps and poor CLS scores.
**Why it happens:** Next.js Image requires explicit width/height or `fill` prop to calculate aspect ratio and reserve space.
**How to avoid:**
- Use `fill` prop with parent container having aspect-ratio
- Specify explicit `sizes` prop for responsive images
- Apply `className="object-cover"` for consistent cropping
**Warning signs:** CLS warnings in Lighthouse, visible content jumping when images load

**Prevention code:**
```typescript
// BAD: No dimensions, causes layout shift
<Image src={url} alt="Project" />

// GOOD: Fill pattern with aspect ratio container
<div className="relative aspect-video">
  <Image
    src={url}
    alt="Project"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
  />
</div>
```

### Pitfall 2: CVA Variant Type Errors with Required Props
**What goes wrong:** TypeScript errors when trying to enforce required variants: "Property 'size' is missing in type '{}' but required".
**Why it happens:** CVA doesn't have built-in support for required variants; you must manually extend the generated types.
**How to avoid:**
- Use defaultVariants for all variants that should have fallbacks
- For truly required variants, extend the interface explicitly
- Don't rely on CVA alone for required prop validation
**Warning signs:** TypeScript errors about missing properties, runtime errors when variants are undefined

**Prevention code:**
```typescript
// Define variants with defaults
const ctaButtonVariants = cva("...", {
  variants: { intent: { primary: "...", secondary: "..." } },
  defaultVariants: { intent: "primary" },  // Provides fallback
});

// For required props, extend explicitly
interface CTAButtonProps extends VariantProps<typeof ctaButtonVariants> {
  intent: "primary" | "secondary";  // Make it required at type level
}
```

### Pitfall 3: Breaking GPU Acceleration with Animating Layout Properties
**What goes wrong:** Smooth animations turn janky, Lighthouse performance score drops below 100.
**Why it happens:** Animating non-composited properties (width, height, background-color, border) forces layout/paint on main thread.
**How to avoid:**
- Only animate `transform` and `opacity`
- Use `scale()` instead of width/height changes
- Use `will-change: transform` sparingly (only on active animations)
**Warning signs:** Janky animations, performance warnings in DevTools, Lighthouse score < 100

**Prevention code:**
```typescript
// BAD: Animates non-GPU property
"hover:w-full transition-all"  // Forces layout calculation

// GOOD: GPU-accelerated transform
"hover:scale-105 transition-transform duration-[var(--duration-base)]"
```

### Pitfall 4: Semantic HTML Violations in Testimonials
**What goes wrong:** Screen readers can't identify testimonial structure, ARIA issues flagged in accessibility audits.
**Why it happens:** Using generic `<div>` elements instead of semantic HTML like `<figure>`, `<blockquote>`, `<cite>`.
**How to avoid:**
- Use `<figure>` for testimonial containers
- Use `<blockquote>` for quote text
- Use `<cite>` for attribution (name, title, company)
- Use `<figcaption>` for attribution wrapper
**Warning signs:** Accessibility audits flagging missing structure, screen reader testing reveals unclear content

**Prevention code:**
```typescript
// BAD: Generic divs with no semantic meaning
<div className="testimonial">
  <div className="quote">{quote}</div>
  <div className="author">{name}</div>
</div>

// GOOD: Semantic HTML with proper structure
<figure className="testimonial">
  <blockquote><p>"{quote}"</p></blockquote>
  <figcaption>
    <cite>{name}</cite>, {title} at {company}
  </figcaption>
</figure>
```

### Pitfall 5: Inconsistent Component Language Across Compositions
**What goes wrong:** Different composition components use different card elevations, button sizes, spacing tokens, creating visual inconsistency.
**Why it happens:** Developers hard-code values or use arbitrary Tailwind classes instead of referencing design system tokens.
**How to avoid:**
- Always reference spacing tokens from @theme (--spacing-*)
- Use consistent card elevation prop across all compositions
- Establish component sizing conventions (e.g., "lg buttons in hero, default elsewhere")
- Document component language patterns in code comments
**Warning signs:** Visual inconsistency between sections, mixing spacing patterns (e.g., p-6 in one card, p-8 in another)

**Prevention code:**
```typescript
// BAD: Arbitrary spacing, inconsistent patterns
<Card className="p-6 shadow-md">  // Different from other cards
  <Button size="sm">...</Button>   // Inconsistent sizing
</Card>

// GOOD: Consistent tokens and patterns
<Card elevation="lg" className="p-6">  // Standard elevation for interactive cards
  <Button size="lg">...</Button>       // Consistent sizing for CTAs
</Card>
```

## Code Examples

Verified patterns from official sources and existing codebase:

### CVA Variant Definition with Compound Variants
```typescript
// Source: components/ui/button.tsx (existing project pattern)
import { cva, type VariantProps } from "class-variance-authority";

const ctaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-[var(--duration-base)]",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        xl: "h-14 px-12 text-lg",
      },
    },
    compoundVariants: [
      {
        intent: "primary",
        size: "xl",
        class: "font-semibold shadow-lg",
      },
    ],
    defaultVariants: {
      intent: "primary",
      size: "default",
    },
  }
);

export interface CTAButtonProps extends VariantProps<typeof ctaButtonVariants> {
  // Additional props
}
```

### Next.js Image in Responsive Card Grid
```typescript
// Source: Next.js docs + existing components/portfolio/project-card.tsx pattern
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";

export function ProjectCardEnhanced({ project }) {
  return (
    <Card elevation="lg" className="overflow-hidden group">
      {/* Responsive image container with aspect ratio */}
      <div className="relative aspect-video bg-muted">
        <Image
          src={project.screenshotUrl}
          alt={`${project.name} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-[var(--duration-base)] ease-smooth"
          priority={false}  // Lazy load by default
        />
      </div>
      <CardHeader>
        <h3 className="font-serif text-h5 leading-snug">{project.name}</h3>
      </CardHeader>
    </Card>
  );
}
```

### Testimonial Component with Semantic HTML
```typescript
// Source: React accessibility best practices + @radix-ui/react-avatar
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  photo?: string;
}

export function TestimonialCard({ quote, name, title, company, photo }: TestimonialCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <Card elevation="sm" className="p-6">
      <figure>
        <blockquote className="text-foreground mb-4 text-base leading-relaxed">
          <p className="before:content-['\201C'] after:content-['\201D']">
            {quote}
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <cite className="font-semibold not-italic text-foreground">
              {name}
            </cite>
            <p className="text-sm text-muted-foreground">
              {title} at {company}
            </p>
          </div>
        </figcaption>
      </figure>
    </Card>
  );
}
```

### Social Proof Metrics Display
```typescript
// Source: React composition patterns + existing design system
import { Card } from "@/components/ui/card";

interface Metric {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SocialProofDisplayProps {
  metrics: Metric[];
}

export function SocialProofDisplay({ metrics }: SocialProofDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          elevation="flat"
          className="p-6 text-center transition-[transform,box-shadow] duration-[var(--duration-base)] hover:shadow-md hover:scale-105"
        >
          {metric.icon && (
            <div className="flex justify-center mb-sm text-primary">
              {metric.icon}
            </div>
          )}
          <div className="font-serif text-h2 leading-tight text-primary mb-xs">
            {metric.value}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {metric.label}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Case Study Visual Format
```typescript
// Source: Portfolio best practices + existing card patterns
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CaseStudySection {
  heading: string;
  content: string;
  metrics?: string[];
}

interface CaseStudyVisualProps {
  problem: CaseStudySection;
  solution: CaseStudySection;
  results: CaseStudySection;
}

export function CaseStudyVisual({ problem, solution, results }: CaseStudyVisualProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      {/* Problem Section */}
      <Card elevation="sm">
        <CardHeader className="pb-4">
          <Badge variant="destructive" className="w-fit mb-2">Challenge</Badge>
          <h3 className="font-serif text-h4 leading-snug">{problem.heading}</h3>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {problem.content}
        </CardContent>
      </Card>

      {/* Solution Section */}
      <Card elevation="sm">
        <CardHeader className="pb-4">
          <Badge variant="secondary" className="w-fit mb-2">Approach</Badge>
          <h3 className="font-serif text-h4 leading-snug">{solution.heading}</h3>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {solution.content}
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card elevation="sm">
        <CardHeader className="pb-4">
          <Badge variant="default" className="w-fit mb-2">Impact</Badge>
          <h3 className="font-serif text-h4 leading-snug">{results.heading}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{results.content}</p>
          {results.metrics && (
            <ul className="space-y-2">
              {results.metrics.map((metric, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span className="font-semibold">{metric}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS Modules for variants | CVA (class-variance-authority) | 2023-2024 | Type-safe variants, better DX, less boilerplate |
| Inline styles for component variations | Tailwind + CVA compound variants | 2024-2025 | Utility-first consistency, easier maintenance |
| Custom image components | next/image with automatic optimization | Next.js 13+ | Automatic WebP/AVIF, responsive images, lazy loading built-in |
| Framer Motion for all animations | CSS-only GPU-accelerated animations | 2025-2026 | Lighthouse 100 scores, smaller bundles, better performance |
| ARIA attributes manually added | Radix UI primitives with built-in accessibility | 2024+ | Automatic focus management, keyboard navigation, ARIA |
| Class components | Function components with hooks | React 16.8+ (2019) | Simpler code, better composition, smaller bundles |

**Deprecated/outdated:**
- **styled-components/emotion**: CSS-in-JS libraries now considered legacy for most use cases. Tailwind + CVA is the modern standard.
- **Class components**: Function components with hooks are the de facto standard. No new class components should be written.
- **Inheritance patterns**: React officially recommends composition over inheritance. Don't extend components via class inheritance.
- **Manual variant prop handling**: CVA and `VariantProps` utility automate this completely. Don't manually type variant props.

## Open Questions

Things that couldn't be fully resolved:

1. **Testimonial photo aspect ratios**
   - What we know: Avatar component supports square images, can handle fallback initials
   - What's unclear: Whether testimonial layout should use Avatar (circular) or rectangular photos for more professional appearance
   - Recommendation: Use Avatar for consistency with other UI patterns, but could test rectangular photos with rounded corners if user feedback suggests it looks more professional

2. **Social proof metrics animation timing**
   - What we know: GPU-accelerated animations should use transform/opacity only, design system has --duration-base (300ms) token
   - What's unclear: Whether metrics should animate on viewport entry (requires intersection observer) or only on hover
   - Recommendation: Start with hover-only animations to avoid intersection observer complexity. Can add viewport animations in Phase 12 if desired.

3. **Case study visual metrics display format**
   - What we know: Results section should show metrics in scannable format, existing Badge variants work for labels
   - What's unclear: Whether to use structured list, grid of metric cards, or inline badges for impact statements
   - Recommendation: Use bulleted list with checkmark icons (as shown in code examples) for simplicity and scannability. Can A/B test alternatives post-launch.

## Sources

### Primary (HIGH confidence)
- [CVA Variants Documentation](https://cva.style/docs/getting-started/variants) - Compound variants and CVA API
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - Image optimization and responsive patterns
- [Vercel Academy: shadcn/ui Anatomy](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components) - Component composition patterns
- Existing codebase (`components/ui/button.tsx`, `components/ui/card.tsx`, `components/portfolio/project-card.tsx`) - Verified CVA and composition patterns

### Secondary (MEDIUM confidence)
- [React Composition Pattern - patterns.dev](https://www.patterns.dev/react/compound-pattern/) - Compound components
- [Advanced React Component Composition - Frontend Mastery](https://frontendmastery.com/posts/advanced-react-component-composition-guide/) - Composition strategies
- [CSS GPU Animation - Smashing Magazine](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/) - GPU acceleration best practices
- [React Accessibility - React Docs](https://legacy.reactjs.org/docs/accessibility.html) - Semantic HTML and ARIA
- [Hardware-Accelerated Animations - Chrome Developers](https://developer.chrome.com/blog/hardware-accelerated-animations) - Transform/opacity performance

### Tertiary (LOW confidence)
- [React Best Practices 2026 - Technostacks](https://technostacks.com/blog/react-best-practices/) - General patterns overview
- [React Design Patterns 2026 - DesignRush](https://www.designrush.com/best-designs/websites/trends/react-design-patterns) - Pattern survey
- [Social Proof Components - Launch UI](https://www.launchuicomponents.com/docs/sections/social-proof) - Social proof patterns (unverified against official sources)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed, CVA and Radix UI patterns verified in existing code
- Architecture: HIGH - Composition pattern verified in existing components, CVA patterns documented officially
- Pitfalls: HIGH - GPU acceleration verified via Chrome/MDN docs, CVA type issues documented in GitHub issues, image optimization verified in Next.js docs
- Code examples: HIGH - All examples derived from existing codebase patterns or official documentation

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable ecosystem, React/Next.js patterns evolve slowly)
