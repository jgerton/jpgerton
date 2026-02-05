# Stack Research - Design Polish & Enhancement

**Domain:** Professional agency portfolio site design enhancement
**Researched:** 2026-02-04
**Confidence:** HIGH

## Executive Summary

For design polish of jpgerton.com, the validated core stack (Next.js 14, Tailwind v4, shadcn/ui) is already excellent. This research focuses on enhancement libraries and patterns to elevate from "generic template" to "verified professional agency."

Key findings:
- **Framer Motion** (v12.31.0) for micro-interactions and page transitions
- **Variable fonts** (Inter + Lora) for warm, approachable typography
- **Tailwind v4 features** underused: container queries, @property, design tokens
- **shadcn/ui components** underused: Accordion, Carousel, Tabs for content hierarchy
- **CVA patterns** for component variant consistency
- **Icon enhancement** via Phosphor Icons for multi-weight visual variety

The stack below addresses the "warm, approachable, professional" brand requirement while maintaining performance and avoiding bloat.

---

## Recommended Stack

### Animation & Motion

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **framer-motion** | ^12.31.0 | Page transitions, micro-interactions, scroll animations | Industry standard with 12M+ monthly downloads. Best DX for Next.js App Router. GPU-accelerated animations, declarative API. Perfect for portfolio showcases and interaction polish. |
| **tailwindcss-animate** | ^1.0.7 | ✅ Already installed | Lightweight utility animations. Keep for simple hover states and transitions. Use Framer Motion for complex animations. |

**Rationale:** Framer Motion is the fastest-growing animation library (Motion v12 has no breaking changes from v11). Despite App Router challenges with AnimatePresence, template.tsx approach works well for page transitions. Use for: hero animations, project card hovers, scroll-triggered reveals, form micro-interactions.

### Typography & Fonts

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Inter (Variable)** | Latest | ✅ Already using | Modern sans-serif, 414B+ Google Fonts requests/year. Excellent for UI/body text. Already configured via `--font-inter`. |
| **Lora (Variable)** | Latest | Serif headlines, project descriptions | Warm serif with calligraphic roots. Pairs perfectly with Inter for "approachable professional" vibe. Variable font = 100-200KB vs 400-800KB static files. |

**Font Pairing Strategy:**
- **Primary:** Inter (Variable) for UI, navigation, body text
- **Accent:** Lora (Variable) for hero headlines, project titles, pull quotes
- **Rationale:** "Lora + Nunito" and "Roboto + Lora" are top-rated warm/professional pairings. You already have Inter (similar to Roboto but better metrics). Lora adds warmth without sacrificing credibility.

**Implementation:**
```typescript
// app/layout.tsx - Add Lora
import { Inter, Lora } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', weight: ['400', '500', '600', '700'] })

// Add to className
className={`${inter.variable} ${lora.variable}`}
```

```css
/* globals.css - Add to @theme */
--font-serif: var(--font-lora), ui-serif, Georgia, serif;
```

### Icon System (Enhancement)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **lucide-react** | ^0.563.0 | ✅ Already installed | Keep for primary icons. Clean, consistent stroke icons. 1000+ icons, good defaults. |
| **@phosphor-icons/react** | ^2.1.7 | Accent icons with weight variety | Add for visual hierarchy. Offers thin/light/regular/bold/fill/duotone weights. Use sparingly for hero sections, service cards where visual weight matters. |

**Icon Strategy:**
- **Primary (90%):** Lucide React - navigation, UI, forms, consistent stroke style
- **Accent (10%):** Phosphor Icons - hero features, service benefits, visual differentiation
- **Rationale:** Lucide lacks variety (stroke-only). Phosphor adds 6 weight variations without switching libraries constantly. Install as optional enhancement, not replacement.

**When to use Phosphor:**
- Hero section feature highlights (use `duotone` for visual interest)
- Service tier comparisons (use `fill` for active state)
- Section dividers (use `thin` for subtle decoration)

### Component Variant Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **class-variance-authority** | ^0.7.1 | ✅ Already installed | CVA powers shadcn/ui variants. Use more intentionally for button variants, card styles, heading hierarchy. Ensures consistent component APIs across the site. |
| **clsx** | ^2.1.1 | ✅ Already installed | Conditional classes. Keep using. |
| **tailwind-merge** | ^3.4.0 | ✅ Already installed | Conflict resolution via `cn()` utility. Essential for component composition. |

**CVA Best Practice:** Create variant-driven components for buttons, cards, badges, headings. Example:
```typescript
const headingVariants = cva("font-serif", {
  variants: {
    level: {
      h1: "text-5xl md:text-6xl font-bold tracking-tight",
      h2: "text-4xl md:text-5xl font-semibold",
      h3: "text-3xl font-medium",
    },
    style: {
      serif: "font-lora",
      sans: "font-inter",
    }
  },
  defaultVariants: { level: "h2", style: "serif" }
})
```

### Form Enhancement

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **react-hook-form** | ^7.71.1 | ✅ Already installed | Industry standard. Keep using with shadcn Form components. |
| **zod** | ^4.3.6 | ✅ Already installed | TypeScript-first validation. Keep using with zodResolver. |

**Note:** Shadcn/ui is deprecating `<Form>` abstraction in favor of `<Field>` component. Monitor for updates, but current pattern (FormField + FormControl + FormMessage) works well.

### Theme & Dark Mode

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **next-themes** | ^0.4.6 | ✅ Already installed | Perfect integration with Tailwind. System preference support. No flash on load. Keep current implementation. |

**Dark Mode Best Practices (2026):**
- ✅ Use dark gray (#121212) not pure black
- ✅ Reduce saturation of accent colors in dark mode
- ✅ Maintain 4.5:1 contrast for body text, 3:1 for large text
- ✅ Use `disableTransitionOnChange` to prevent flash

**Review:** Check `globals.css` dark mode colors against 2026 contrast guidelines. Your current HSL approach is correct.

---

## Supporting Libraries

### Underused shadcn/ui Components (Already Available)

| Component | Purpose | When to Use | Design Impact |
|-----------|---------|-------------|---------------|
| **Accordion** | Content hierarchy, FAQ, service details | Services page (tier comparison details), About page (experience timeline) | Reduces cognitive load, reveals complexity progressively |
| **Tabs** | Content organization | Projects page (filter by category), Services page (view by tier) | Cleaner than filter dropdowns, familiar pattern |
| **Carousel** | Image galleries, testimonials | Project detail pages (screenshots), Home (client logos) | Professional showcase pattern, mobile-friendly |
| **Badge** | Status indicators, tags | Project cards (tech stack tags), Service tiers (labels) | Visual categorization, scannability |

**Action:** Audit current pages and replace custom implementations with these accessible primitives. They're built on Radix UI (WAI-ARIA compliant) and already installed.

### Tailwind v4 Features to Leverage

| Feature | Purpose | Implementation | Design Impact |
|---------|---------|----------------|---------------|
| **Container Queries** | Responsive components based on container width | Use `@container` and `@min-*/@max-*` variants | Cards that adapt to sidebar width, not viewport. More flexible layouts. |
| **@property** | Typed CSS variables with transitions | Define gradient transitions, animated color shifts | Smooth gradient animations (can't do this with standard CSS vars) |
| **Design Tokens via @theme** | Centralized design system | ✅ You're already using this correctly | Maintain current approach. Ensure all spacing uses tokens, not arbitrary values. |
| **Color-mix()** | Dynamic color blending | Generate hover states, opacity variants | Reduces custom color definitions |

**Container Query Example:**
```css
/* For project cards that need to adapt to grid column width */
.project-card {
  @container;
}

.project-card-content {
  @apply flex flex-col;

  @media @min-md {
    @apply flex-row items-center;
  }
}
```

---

## Installation

```bash
# Animation
bun add framer-motion

# Typography (use Next.js font loader, no install needed)
# Inter: Already configured
# Lora: Add to layout.tsx import

# Icon enhancement (optional, strategic use)
bun add @phosphor-icons/react

# Everything else is already installed
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Framer Motion** | GSAP | Complex timeline-based animations, marketing sites with heavy animation. Overkill for portfolio. 69KB vs 119KB but steeper learning curve. |
| **Framer Motion** | React Spring | Physics-based animations (drag, throw). Good for interactive playgrounds. Less intuitive for page transitions. |
| **Framer Motion** | AutoAnimate | Zero-config list animations. Too limited for portfolio polish needs. |
| **Inter + Lora** | Montserrat + Karla | More geometric/modern. Use if pivoting to "tech startup" vs "agency" brand. |
| **Inter + Lora** | PT Sans + Libre Baskerville | More literary/editorial. Use for content-heavy blog, not services site. |
| **Phosphor Icons** | React Icons (40K+ icons) | Need access to Font Awesome, Material, Ionicons in one package. 40K icons = decision fatigue. Phosphor's 1500 icons with 6 weights is better constrained choice. |
| **Phosphor Icons** | Heroicons | Made by Tailwind team, only 290 icons, 2 styles. Too limited for variety needs. Keep Lucide as primary. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Anime.js** | Less optimized than Framer Motion for React. Not declarative. | Framer Motion for all animations |
| **React Transition Group** | Low-level, requires more code. Framer Motion is higher-level abstraction. | Framer Motion `<AnimatePresence>` |
| **Pure black (#000) backgrounds** | Creates harsh contrast, visual strain in dark mode | Dark gray (#121212) already in use |
| **Font Awesome (via CDN)** | Render-blocking, licensing complexity, bundle size | Lucide React (already installed) |
| **Multiple icon libraries** | Inconsistent visual style, decision fatigue | Lucide (primary) + Phosphor (strategic accents only) |
| **Arbitrary Tailwind values everywhere** | `text-[17px]`, `mt-[23px]` breaks design system | Use design tokens from @theme config |
| **Custom animation keyframes in CSS** | Not GPU-accelerated, harder to maintain | Framer Motion (GPU-accelerated, declarative) |
| **@apply for one-off utilities** | Defeats purpose of utility-first CSS | Use @apply only for true component patterns (CVA) |

---

## Stack Patterns by Use Case

### Micro-Interactions (Buttons, Cards, Hovers)

**Pattern:** Framer Motion `whileHover`, `whileTap`, `whileFocus`

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  <Card>...</Card>
</motion.div>
```

**Why:** GPU-accelerated transforms, spring physics feel natural, consistent across all interactive elements.

### Page Transitions (Route Changes)

**Pattern:** `template.tsx` with Framer Motion exit animations

```tsx
// app/template.tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {children}
</motion.div>
```

**Why:** App Router limitation workaround. Template re-renders on navigation. Avoid AnimatePresence (fragile in App Router).

### Scroll Animations (Reveal on Scroll)

**Pattern:** Framer Motion `whileInView` with viewport detection

```tsx
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
  <ProjectShowcase />
</motion.section>
```

**Why:** Built-in Intersection Observer. `once: true` prevents re-animation on scroll up. Margin triggers before element is fully visible.

### Typography Hierarchy

**Pattern:** CVA + font family variables

```tsx
const heading = cva("tracking-tight", {
  variants: {
    level: {
      h1: "font-lora text-5xl md:text-6xl font-bold",
      h2: "font-lora text-4xl md:text-5xl font-semibold",
      h3: "font-inter text-2xl md:text-3xl font-medium",
    }
  }
})
```

**Why:** h1/h2 use Lora (warm, approachable). h3+ use Inter (clean, professional). Consistent API across components.

### Icon Usage

**Pattern:** Lucide for UI, Phosphor for visual accents

```tsx
// Navigation, forms, UI controls
import { Menu, X, ChevronRight } from 'lucide-react'

// Hero features, service benefits (visual hierarchy)
import { Lightbulb, RocketLaunch, CheckCircle } from '@phosphor-icons/react'
<RocketLaunch size={48} weight="duotone" className="text-accent" />
```

**Why:** Lucide provides consistency. Phosphor's weight variants add visual hierarchy without icon style clash.

### Component Variants (Buttons, Cards)

**Pattern:** CVA with compoundVariants

```tsx
const button = cva("inline-flex items-center justify-center rounded-md", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent",
    },
    size: {
      default: "h-10 px-4 py-2",
      lg: "h-11 px-8",
    }
  },
  compoundVariants: [
    {
      variant: "outline",
      size: "lg",
      className: "border-2" // Stronger border for large outlined buttons
    }
  ],
  defaultVariants: { variant: "default", size: "default" }
})
```

**Why:** Type-safe variants. Compound variants for edge cases. Shadcn/ui uses this pattern extensively.

---

## Version Compatibility

| Package | Current in package.json | Recommended | Notes |
|---------|-------------------------|-------------|-------|
| tailwindcss | 4.1.18 | ✅ Current | Latest stable. Container queries, @property support. |
| framer-motion | Not installed | 12.31.0 | Install. No breaking changes from v11. React 19 compatible. |
| @phosphor-icons/react | Not installed | 2.1.7 (latest) | Optional. Strategic enhancement only. |
| lucide-react | 0.563.0 | ✅ Current | Updated Dec 2024. 1000+ icons. |
| class-variance-authority | 0.7.1 | ✅ Current | Stable. No breaking changes expected. |
| next-themes | 0.4.6 | ✅ Current | Latest. Next.js 14+ compatible. |
| react-hook-form | 7.71.1 | ✅ Current | Latest stable. React 19 compatible. |
| zod | 4.3.6 | ✅ Current | Major version bump from v3. Check for breaking changes if upgrading from older project. |

**Compatibility Check:** All recommended packages work with:
- Next.js 14+ (App Router)
- React 19
- Tailwind CSS v4
- TypeScript 5.9+

---

## Sources

### Tailwind v4 Features
- [Tailwind CSS v4.0 Official Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Tailwind v4 Container Queries](https://vueschool.io/lessons/tailwind-version-4-container-queries)

### Animation Libraries
- [Beyond Eye Candy: Top 7 React Animation Libraries for 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries)
- [Comparing React Animation Libraries for 2026](https://blog.logrocket.com/best-react-animation-libraries/)
- [Framer Motion npm page](https://www.npmjs.com/package/framer-motion)
- [Motion v12 Documentation](https://motion.dev/)

### Typography & Fonts
- [20+ Beautiful Google Font Pairings for 2026](https://www.landingpageflow.com/post/google-font-pairings-for-websites)
- [Font Pairing Chart for Web Design 2026](https://elementor.com/blog/font-pairing-chart/)
- [The 40 Best Google Fonts 2026](https://www.typewolf.com/google-fonts)
- [Best Free Google Fonts for 2026](https://muz.li/blog/best-free-google-fonts-for-2026/)

### Icon Systems
- [Better Than Lucide: 8 Icon Libraries](https://hugeicons.com/blog/design/8-lucide-icons-alternatives-that-offer-better-icons)
- [5 Best Icon Libraries for shadcn/ui](https://www.shadcndesign.com/blog/5-best-icon-libraries-for-shadcn-ui)
- [Best React Icon Libraries for 2026](https://mighil.com/best-react-icon-libraries)

### shadcn/ui & Component Patterns
- [Radix UI vs Shadcn UI Comparison](https://shadcnstudio.com/blog/radix-ui-vs-shadcn-ui)
- [What are Radix Primitives?](https://vercel.com/academy/shadcn-ui/what-are-radix-primitives)
- [Building Forms with React Hook Form & Zod](https://ui.shadcn.com/docs/forms/react-hook-form)
- [Class Variance Authority Documentation](https://cva.style/docs)

### Micro-Interactions & Design Patterns
- [Micro Interactions 2025 Best Practices](https://www.stan.vision/journal/micro-interactions-2025-in-web-design)
- [10 Micro-interaction Examples to Improve UX](https://www.designstudiouiux.com/blog/micro-interactions-examples/)
- [Dark Mode Best Practices 2026](https://natebal.com/best-practices-for-dark-mode/)
- [Next.js Dark Mode with next-themes](https://ui.shadcn.com/docs/dark-mode/next)

### Utility Functions
- [Tailwind Merge & clsx Guide](https://dzone.com/articles/mastering-tailwind-css-with-tailwind-merge-and-clsx)
- [The Story Behind Tailwind's CN Function](https://tigerabrodi.blog/the-story-behind-tailwinds-cn-function)

---

*Stack research for: jpgerton.com design polish milestone*
*Researched: 2026-02-04*
*Focus: Design enhancement tools, animation, typography, component patterns*
*Confidence: HIGH (verified with Context7, official docs, and current 2026 sources)*
