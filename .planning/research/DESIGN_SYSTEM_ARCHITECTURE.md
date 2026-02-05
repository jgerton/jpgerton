# Design System Architecture: Tailwind v4 + shadcn/ui Integration

**Project:** jpgerton.com - Design Polish Milestone
**Domain:** Design System Integration in Next.js + Tailwind v4 + shadcn/ui
**Researched:** 2026-02-04
**Confidence:** HIGH

## Executive Summary

Tailwind CSS v4 introduces a **CSS-first design token architecture** using the `@theme` directive, fundamentally changing how design systems are structured. Combined with shadcn/ui's **layered CSS variable pattern**, this creates a powerful, maintainable system where:

- **Design tokens** are defined once in CSS using `@theme`
- **Semantic variables** create a flexible theming layer
- **Components** reference semantic tokens, not raw values
- **Updates** to shadcn/ui components are preserved through proper layering

For jpgerton.com's design polish milestone, this translates to:

1. **Design tokens** defined in `globals.css` using Tailwind v4's `@theme` directive
2. **shadcn/ui semantic layer** using CSS variables for theming (already in place)
3. **Component customization** via variant extension, not file modification
4. **Animation integration** using GPU-accelerated transforms in Server Components where possible
5. **Performance-first approach** maintaining current Lighthouse scores

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design Token Architecture                    │
│                                                                   │
│  Layer 1: Tailwind v4 @theme (Foundation)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ @theme {                                                 │   │
│  │   --color-*     → Brand colors, UI palette              │   │
│  │   --spacing-*   → Consistent spacing scale              │   │
│  │   --radius-*    → Border radius system                  │   │
│  │   --font-*      → Typography scale                      │   │
│  │   --shadow-*    → Elevation system                      │   │
│  │ }                                                         │   │
│  │                                                           │   │
│  │ → Generates Tailwind utilities automatically             │   │
│  │ → Available as CSS variables at runtime                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ↓                                     │
│  Layer 2: shadcn/ui Semantic Variables (Theming)                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ @layer base {                                            │   │
│  │   :root {                                                │   │
│  │     --background: hsl(...)                               │   │
│  │     --foreground: hsl(...)                               │   │
│  │     --primary: hsl(...)        ← Maps to brand color     │   │
│  │     --accent: hsl(...)                                   │   │
│  │     --muted: hsl(...)                                    │   │
│  │   }                                                       │   │
│  │                                                           │   │
│  │   .dark {                                                 │   │
│  │     --background: hsl(...)     ← Dark mode variants      │   │
│  │     --primary: hsl(...)                                  │   │
│  │   }                                                       │   │
│  │ }                                                         │   │
│  │                                                           │   │
│  │ → Semantic naming (purpose, not appearance)              │   │
│  │ → Dark mode support via .dark class                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ↓                                     │
│  Layer 3: Component Variants (CVA Pattern)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ const buttonVariants = cva(                              │   │
│  │   "base-classes",                                        │   │
│  │   {                                                       │   │
│  │     variants: {                                          │   │
│  │       variant: {                                         │   │
│  │         default: "bg-primary text-primary-foreground",   │   │
│  │         secondary: "bg-secondary ...",                   │   │
│  │       },                                                  │   │
│  │       size: { ... }                                      │   │
│  │     }                                                     │   │
│  │   }                                                       │   │
│  │ )                                                         │   │
│  │                                                           │   │
│  │ → References semantic variables                          │   │
│  │ → Type-safe variant composition                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ↓                                     │
│  Layer 4: Page Components (Usage)                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ <Button variant="default" size="lg">                     │   │
│  │   Click Me                                               │   │
│  │ </Button>                                                 │   │
│  │                                                           │   │
│  │ → Uses variants from Layer 3                             │   │
│  │ → Inherits theme from Layer 2                            │   │
│  │ → Powered by tokens from Layer 1                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Layer | Component | Responsibility | Where Defined | Update Frequency |
|-------|-----------|---------------|---------------|------------------|
| **1. Foundation** | Design Tokens | Raw values (colors, spacing, fonts) | `globals.css` @theme block | Rare (brand changes) |
| **2. Semantic** | Theme Variables | Purpose-based color mapping | `globals.css` @layer base | Moderate (theme refinement) |
| **3. Variants** | Component Styles | Visual variations and states | `components/ui/*.tsx` | Frequent (design polish) |
| **4. Composition** | Page Components | Assembled UI using variants | `components/portfolio/*`, `app/**/*.tsx` | Constant (feature work) |

## Recommended Project Structure

```
E:\Projects\wp-designer\
│
├── app/
│   ├── globals.css                    ← DESIGN TOKEN LAYER
│   │   ├── @theme { ... }              (Tailwind v4 tokens)
│   │   ├── @layer base { :root }       (shadcn/ui semantic variables)
│   │   └── @layer base { .dark }       (dark mode overrides)
│   │
│   ├── layout.tsx                      (applies globals.css, Inter font)
│   └── providers.tsx                   (ThemeProvider for dark mode)
│
├── components/
│   ├── ui/                             ← SHADCN/UI COMPONENTS
│   │   ├── button.tsx                  (CVA variants, semantic refs)
│   │   ├── card.tsx                    (semantic background, border)
│   │   └── ...                         (13 total components)
│   │
│   ├── portfolio/                      ← CUSTOM COMPOSITIONS
│   │   ├── hero-section.tsx            (uses ui components)
│   │   ├── project-card.tsx            (extends Card with custom classes)
│   │   └── ...
│   │
│   └── admin/                          ← ADMIN UI COMPOSITIONS
│       └── ...
│
├── lib/
│   └── utils.ts                        ← UTILITY (cn() for class merging)
│
├── tailwind.config.ts                  ← LEGACY CONFIG (v3 compatibility)
│   └── theme.extend                    (mirrors globals.css for tooling)
│
└── components.json                     ← SHADCN/UI CONFIG
    └── tailwind.cssVariables: true     (enables semantic variable mode)
```

### Key Files and Their Roles

| File | Purpose | Design System Role | When to Edit |
|------|---------|-------------------|--------------|
| `app/globals.css` | Single source of truth for design tokens | Defines @theme tokens and semantic variables | Brand changes, theme refinement |
| `tailwind.config.ts` | Tailwind v3 compatibility layer | Mirrors globals.css for editor tooling | Keep in sync with globals.css |
| `components/ui/*.tsx` | shadcn/ui component library | Implements CVA variants using semantic tokens | Extend variants, add new ones |
| `components/portfolio/*.tsx` | Custom compositions | Combines ui components with custom styling | Page-specific design |
| `lib/utils.ts` | Class merging utility | Enables className overrides via `cn()` | Rarely (utility stable) |

## Architectural Patterns

### Pattern 1: Design Token Architecture (Tailwind v4 @theme)

**What:** Define all design tokens in `@theme` directive in globals.css

**How it works:**

1. **Namespace system** generates Tailwind utilities:
   - `--color-*` → generates `text-*`, `bg-*`, `border-*` utilities
   - `--spacing-*` → generates `p-*`, `m-*`, `gap-*` utilities
   - `--radius-*` → generates `rounded-*` utilities
   - `--font-*` → generates `font-*` utilities

2. **CSS variables** available at runtime:
   ```css
   @theme {
     --color-corporate-blue: #003F75;
   }

   /* Automatically creates: */
   /* - Utility classes: bg-corporate-blue, text-corporate-blue */
   /* - CSS variable: var(--color-corporate-blue) */
   ```

3. **Integration with semantic layer:**
   ```css
   @theme {
     --color-corporate-blue: #003F75;
   }

   @layer base {
     :root {
       --primary: 210 100% 23%; /* corporate-blue as HSL */
       --color-primary: hsl(var(--primary)); /* Accessible in @theme */
     }
   }
   ```

**Benefits:**

- **Single source of truth**: All design tokens in one place
- **No JavaScript config**: Pure CSS, faster builds
- **Runtime access**: Can reference tokens in inline styles if needed
- **Automatic utilities**: No manual utility generation

**Current implementation in jpgerton.com:**

```css
/* app/globals.css - ALREADY IN PLACE */
@theme {
  /* Brand colors */
  --color-corporate-blue: #003F75;
  --color-tech-blue: #2884BD;
  --color-turquoise: #0FACB0;

  /* shadcn/ui semantic colors */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  /* ... */

  /* Border radius system */
  --radius-lg: 12px;
  --radius-md: 8px;
  --radius-sm: 4px;

  /* Typography */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui;
}
```

**Customization for design polish:**

```css
/* ADD to existing @theme block */
@theme {
  /* Extended spacing scale for design polish */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Shadow system for elevation */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Animation durations */
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
}
```

---

### Pattern 2: shadcn/ui Theming Layer (Semantic Variables)

**What:** Map foundation tokens to semantic, purpose-based CSS variables

**Architecture:**

```
Foundation Tokens           Semantic Variables          Usage
--color-corporate-blue  →   --primary                →  bg-primary
--color-tech-blue       →   --secondary              →  text-secondary
--color-turquoise       →   --accent                 →  border-accent
```

**Three-tier variable system:**

1. **Primitive layer** (foundation):
   ```css
   @theme {
     --color-corporate-blue: #003F75;
   }
   ```

2. **Semantic layer** (purpose):
   ```css
   @layer base {
     :root {
       --primary: 210 100% 23%;  /* maps to corporate-blue */
     }
   }
   ```

3. **Usage layer** (components):
   ```tsx
   <Button className="bg-primary" />  // references semantic variable
   ```

**Why HSL format?**

shadcn/ui uses HSL without `hsl()` wrapper for flexibility:

```css
:root {
  --primary: 210 100% 23%;  /* Just the values, no hsl() */
}

/* Components use: */
.bg-primary {
  background-color: hsl(var(--primary));  /* hsl() added by Tailwind */
}

/* Enables opacity modifiers: */
.bg-primary/50 {
  background-color: hsl(var(--primary) / 0.5);  /* Add alpha */
}
```

**Dark mode pattern:**

```css
@layer base {
  :root {
    --background: 0 0% 100%;     /* white */
    --foreground: 0 0% 10%;      /* near-black */
    --primary: 210 100% 23%;     /* corporate-blue */
  }

  .dark {
    --background: 0 0% 10%;      /* near-black */
    --foreground: 0 0% 95%;      /* near-white */
    --primary: 203 64% 44%;      /* tech-blue (lighter for dark mode) */
  }
}
```

**Benefits:**

- **Semantic naming**: "primary" describes purpose, not color
- **Theme switching**: Update variables, components auto-update
- **Dark mode**: .dark class swaps entire palette
- **No component edits**: Change theme without touching React files

**Current implementation:** Already in place, well-structured

**Customization for design polish:**

```css
/* ADD to existing @layer base block */
@layer base {
  :root {
    /* Admin-specific semantic tokens (already present) */
    --admin-bg: 220 14% 96%;
    --admin-sidebar: 220 14% 100%;
    --admin-border: 220 13% 91%;

    /* NEW: Add portfolio-specific semantic tokens */
    --hero-gradient-start: var(--primary);
    --hero-gradient-end: var(--accent);
    --card-hover-shadow: var(--shadow-lg);
    --link-underline: var(--accent);
  }

  .dark {
    /* Ensure dark mode variants for new tokens */
    --hero-gradient-start: var(--secondary);
    --hero-gradient-end: var(--accent);
  }
}
```

---

### Pattern 3: Component Variants (CVA Pattern)

**What:** Use class-variance-authority (CVA) to define type-safe component variants

**How it works:**

CVA creates a composable API for component styling:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles applied to ALL variants
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      // Visual style variants
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      // Size variants
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Usage
<Button variant="secondary" size="lg" />
```

**Key benefits:**

1. **Type safety**: TypeScript autocomplete for variants
2. **Composition**: Combine variants automatically
3. **Centralized**: All styles in one place
4. **Extensible**: Add new variants without breaking existing code
5. **Clean JSX**: No ternaries or string interpolation

**Integration with cn() utility:**

```typescript
import { cn } from "@/lib/utils";

const Button = ({ className, variant, size, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
```

The `cn()` utility (from `lib/utils.ts`) merges classes using `tailwind-merge`, preventing conflicts:

```typescript
// Without cn():
<Button className="bg-red-500" variant="default" />
// Result: bg-primary bg-red-500 (conflict, bg-primary wins)

// With cn():
<Button className="bg-red-500" variant="default" />
// Result: bg-red-500 (tailwind-merge intelligently merges, last wins)
```

**Customization pattern for design polish:**

**DO: Extend variants in place**

```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // ADD NEW VARIANTS:
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        // ADD NEW SIZE:
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**DON'T: Modify base styles that break shadcn/ui updates**

```typescript
// BAD: Changing base styles makes updates hard
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full ...", // Changed rounded-md to rounded-full
  // ...
);

// GOOD: Add rounded as a variant instead
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      variant: { /* ... */ },
      size: { /* ... */ },
      // NEW: rounded variant
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);
```

---

### Pattern 4: Composition Over Modification

**What:** Create new components that compose shadcn/ui components instead of editing them

**Why:** Preserves update path for shadcn/ui components

**Implementation:**

**Scenario:** Want a custom "ProjectCard" with specific styling

**BAD: Modify Card directly**

```typescript
// components/ui/card.tsx - DON'T DO THIS
const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "hover:shadow-lg transition-shadow", // ADDED: custom behavior
      className
    )}
    {...props}
  />
);
```

**GOOD: Create composed component**

```typescript
// components/portfolio/project-card.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function ProjectCard({ children, ...props }) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-300"
      {...props}
    >
      {children}
    </Card>
  );
}
```

**Benefits:**

- shadcn/ui components remain pristine
- `npx shadcn@latest diff card` shows no changes
- Updates can be applied safely
- Custom behavior isolated to composed components

**Pattern for jpgerton.com:**

```
shadcn/ui components (components/ui/*)
    ↓ compose into
Portfolio components (components/portfolio/*)
    ↓ use in
Page components (app/**/*.tsx)
```

---

### Pattern 5: Animation Integration Strategy

**What:** Add animations without impacting performance or Lighthouse scores

**Constraints:**

- Next.js App Router: Most components are Server Components
- Tailwind CSS: No runtime JavaScript for styles
- Performance target: Maintain current Lighthouse scores
- Core Web Vitals: No Cumulative Layout Shift (CLS) from animations

**Animation Classification:**

| Type | Implementation | Server/Client | Performance Impact |
|------|---------------|---------------|-------------------|
| **Hover effects** | Tailwind utilities (hover:) | Server Component | Zero (CSS only) |
| **Transitions** | Tailwind transition-* | Server Component | Minimal (GPU accelerated) |
| **Scroll triggers** | Intersection Observer | Client Component | Low (passive event) |
| **Page transitions** | View Transitions API | Client Component | Medium (needs "use client") |
| **Complex animations** | Framer Motion | Client Component | High (large bundle) |

**Recommended approach for design polish:**

**1. Server Component animations (preferred):**

Use Tailwind's built-in animation utilities for static effects:

```tsx
// app/page.tsx - Server Component
export default function Home() {
  return (
    <div className="transform hover:scale-105 transition-transform duration-300">
      <h1 className="animate-fade-in">Jon Gerton</h1>
    </div>
  );
}
```

**2. GPU-accelerated properties only:**

```css
/* globals.css - Add custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px); /* GPU-accelerated */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@theme {
  /* Register animation */
  --animate-fade-in: fade-in 0.5s ease-out;
}
```

Then use: `className="animate-fade-in"`

**3. Client-only for interactive animations:**

```tsx
// components/portfolio/animated-project-card.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export function AnimatedProjectCard({ children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "transition-all duration-300",
        isHovered && "scale-105 shadow-xl"
      )}
    >
      {children}
    </Card>
  );
}
```

**Performance checklist:**

- [ ] Use `transform` and `opacity` only (GPU-accelerated)
- [ ] Avoid animating `width`, `height`, `top`, `left` (triggers reflow)
- [ ] Use `will-change` sparingly (Tailwind: `will-change-transform`)
- [ ] Remove `will-change` after animation completes
- [ ] Test with Lighthouse (target: 90+ performance score)
- [ ] Check CLS score (target: < 0.1)

**Integration with tailwindcss-animate:**

Already installed (`tailwindcss-animate` plugin). Provides utilities:

```tsx
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
  Animated content
</div>
```

**Where to add "use client":**

```
Server Components (default):
  ├── app/page.tsx (home page)
  ├── app/projects/page.tsx (projects list)
  └── components/portfolio/hero-section.tsx (static hero)

Client Components ("use client" required):
  ├── components/portfolio/animated-hero.tsx (scroll-triggered animation)
  ├── components/portfolio/project-card-animated.tsx (hover effects)
  └── components/admin/* (already client components)
```

**Rule of thumb:** If it uses `useState`, `useEffect`, event handlers, or browser APIs → needs "use client"

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Mixing Tailwind v3 and v4 Config

**What:** Defining tokens in both `tailwind.config.ts` and `@theme`

**Why bad:**

- Source of truth unclear
- Conflicts between configs
- Harder to maintain
- v4 @theme takes precedence, v3 config ignored

**Example:**

```typescript
// tailwind.config.ts - AVOID
export default {
  theme: {
    extend: {
      colors: {
        primary: "#003F75",  // CONFLICT: also in @theme
      }
    }
  }
}
```

```css
/* globals.css */
@theme {
  --color-primary: #2884BD;  /* Different value! */
}
```

**Instead:** Use `@theme` as single source of truth:

```css
/* globals.css - CORRECT */
@theme {
  --color-primary: #003F75;
}
```

```typescript
// tailwind.config.ts - MINIMAL (for tooling only)
export default {
  darkMode: "class",
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  plugins: [tailwindcssAnimate],
};
```

**Current state in jpgerton.com:** Some duplication exists (tailwind.config.ts mirrors globals.css). Safe to keep for editor tooling, but **do not** add new tokens to tailwind.config.ts.

---

### Anti-Pattern 2: Editing shadcn/ui Component Files Directly

**What:** Modifying base styling in `components/ui/*.tsx` files

**Why bad:**

- Breaks update path
- `npx shadcn@latest diff` shows conflicts
- Manual merging required for updates
- Loses track of customizations

**Example:**

```typescript
// components/ui/button.tsx - AVOID
const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium",
      "shadow-lg border-2 border-primary",  // CUSTOM: breaks updates
      className
    )}
    {...props}
  />
);
```

**Instead:** Extend via composition:

```typescript
// components/portfolio/cta-button.tsx - CORRECT
import { Button } from "@/components/ui/button";

export function CTAButton({ children, ...props }) {
  return (
    <Button
      className="shadow-lg border-2 border-primary"
      {...props}
    >
      {children}
    </Button>
  );
}
```

**Or add variants in CVA:**

```typescript
// components/ui/button.tsx - ACCEPTABLE
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        // NEW VARIANT (clearly separated):
        cta: "shadow-lg border-2 border-primary bg-gradient-to-r from-primary to-accent",
      }
    }
  }
);
```

**Rule:** If it's in `components/ui/`, only add variants. If you need custom behavior, create a new component in `components/portfolio/` or `components/admin/`.

---

### Anti-Pattern 3: Using Non-Semantic Color Values

**What:** Hardcoding color values or using foundation tokens directly in components

**Why bad:**

- Dark mode breaks (hardcoded colors don't switch)
- Theme changes require editing all components
- Inconsistent visual language

**Example:**

```tsx
// BAD: Hardcoded color
<div className="bg-[#003F75] text-white">

// BAD: Foundation token (bypasses semantic layer)
<div className="bg-corporate-blue text-white">

// GOOD: Semantic token
<div className="bg-primary text-primary-foreground">
```

**Why semantic tokens matter:**

```css
/* Light mode */
:root {
  --primary: 210 100% 23%;  /* dark blue */
}

/* Dark mode */
.dark {
  --primary: 203 64% 44%;   /* lighter blue (better contrast) */
}
```

With semantic tokens, component automatically adapts:

```tsx
<Button variant="default" />
// Light mode: dark blue background
// Dark mode: lighter blue background (auto-adjusted)
```

**Rule:** Always use semantic tokens (`primary`, `secondary`, `accent`, `muted`) instead of foundation tokens (`corporate-blue`, `tech-blue`) in components.

---

### Anti-Pattern 4: Overusing "use client"

**What:** Adding `"use client"` to components that don't need it

**Why bad:**

- Larger JavaScript bundle
- Slower initial page load
- Unnecessary hydration
- Lost benefits of Server Components

**Example:**

```tsx
// BAD: Unnecessary "use client"
"use client";

export function ProjectCard({ title, description }) {
  return (
    <div className="hover:shadow-lg transition-shadow">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
// ↑ No state, no events, no browser APIs → doesn't need "use client"
```

**When "use client" IS needed:**

```tsx
// CORRECT: Needs "use client" for useState
"use client";

import { useState } from "react";

export function AnimatedCard({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {children}
    </div>
  );
}
```

**Rule:** Default to Server Component. Add "use client" only when you need:
- `useState`, `useEffect`, `useContext`
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, etc.)
- Third-party libraries that require client-side rendering

**Current state in jpgerton.com:** Providers properly use "use client", most page components are Server Components. Good separation already in place.

---

### Anti-Pattern 5: Animating Layout-Shifting Properties

**What:** Using transitions on properties that trigger reflow (`width`, `height`, `top`, `left`, `margin`)

**Why bad:**

- Triggers browser layout recalculation (slow)
- Causes Cumulative Layout Shift (CLS)
- Hurts Lighthouse performance score
- Not GPU-accelerated (janky on mobile)

**Example:**

```css
/* BAD: Animates width (triggers reflow) */
.card {
  width: 300px;
  transition: width 0.3s;
}
.card:hover {
  width: 320px;  /* Forces layout recalculation */
}
```

**Instead: Use transform (GPU-accelerated):**

```css
/* GOOD: Animates scale (GPU-accelerated) */
.card {
  transition: transform 0.3s;
}
.card:hover {
  transform: scale(1.05);  /* GPU handles this */
}
```

**GPU-accelerated properties (safe to animate):**

- `transform` (translate, scale, rotate, skew)
- `opacity`
- `filter` (blur, brightness, etc.)

**Properties that trigger reflow (avoid animating):**

- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`

**Tailwind utilities for safe animations:**

```tsx
<div className="
  transition-transform duration-300 hover:scale-105
  transition-opacity duration-200 hover:opacity-80
">
  Safe animation (GPU-accelerated)
</div>
```

**Performance testing:**

```bash
# Before deploying animations:
npm run build
npm start

# Open Lighthouse in Chrome DevTools
# Target scores:
# - Performance: 90+
# - Accessibility: 100
# - Best Practices: 100
# - SEO: 100
```

---

### Anti-Pattern 6: Inline Styles for Design Tokens

**What:** Using inline `style={{}}` instead of Tailwind utilities

**Why bad:**

- Bypasses design system
- No dark mode support
- Harder to maintain
- Loses Tailwind optimizations

**Example:**

```tsx
// BAD: Inline styles
<div style={{
  backgroundColor: '#003F75',
  padding: '1rem',
  borderRadius: '8px'
}}>
  ...
</div>

// GOOD: Tailwind utilities
<div className="bg-primary p-4 rounded-md">
  ...
</div>
```

**Exception:** Dynamic values that can't be known at build time:

```tsx
// ACCEPTABLE: Truly dynamic value
<div style={{
  transform: `translateX(${scrollPosition}px)`
}}>
```

But even then, consider CSS variables:

```tsx
// BETTER: Use CSS variable
<div
  style={{ '--scroll-x': `${scrollPosition}px` }}
  className="translate-x-[var(--scroll-x)]"
>
```

**Rule:** Default to Tailwind utilities. Use inline styles only for truly dynamic runtime values.

---

## Data Flow: Design Tokens to Rendered Components

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Define Design Tokens                                │
│ app/globals.css                                             │
├─────────────────────────────────────────────────────────────┤
│ @theme {                                                     │
│   --color-corporate-blue: #003F75;                          │
│   --spacing-md: 1rem;                                       │
│   --radius-md: 8px;                                         │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (Tailwind processes @theme)
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Generate Utilities                                  │
│ Tailwind v4 Output                                          │
├─────────────────────────────────────────────────────────────┤
│ .bg-corporate-blue { background-color: #003F75; }          │
│ .p-md { padding: 1rem; }                                    │
│ .rounded-md { border-radius: 8px; }                         │
│                                                              │
│ /* CSS variables also available: */                         │
│ :root {                                                      │
│   --color-corporate-blue: #003F75;                          │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (Referenced in semantic layer)
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Map to Semantic Variables                           │
│ app/globals.css @layer base                                 │
├─────────────────────────────────────────────────────────────┤
│ :root {                                                      │
│   --primary: 210 100% 23%;  /* corporate-blue as HSL */    │
│   --background: 0 0% 100%;                                  │
│ }                                                            │
│                                                              │
│ .dark {                                                      │
│   --primary: 203 64% 44%;   /* lighter for dark mode */    │
│   --background: 0 0% 10%;                                   │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (Used in Tailwind utilities)
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Tailwind Generates Semantic Utilities              │
│ Tailwind Output (from tailwind.config.ts)                  │
├─────────────────────────────────────────────────────────────┤
│ .bg-primary {                                               │
│   background-color: hsl(var(--primary));                    │
│ }                                                            │
│ .text-primary-foreground {                                  │
│   color: hsl(var(--primary-foreground));                    │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (Referenced in CVA variants)
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Component Variants (CVA)                            │
│ components/ui/button.tsx                                    │
├─────────────────────────────────────────────────────────────┤
│ const buttonVariants = cva(                                 │
│   "base-styles",                                            │
│   {                                                          │
│     variants: {                                             │
│       variant: {                                            │
│         default: "bg-primary text-primary-foreground",      │
│       }                                                      │
│     }                                                        │
│   }                                                          │
│ );                                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (Used in React component)
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Rendered Component                                  │
│ app/page.tsx                                                │
├─────────────────────────────────────────────────────────────┤
│ <Button variant="default">Click Me</Button>                 │
│                                                              │
│ ↓ Renders as:                                               │
│                                                              │
│ <button class="bg-primary text-primary-foreground ...">     │
│   Click Me                                                   │
│ </button>                                                    │
│                                                              │
│ ↓ Browser applies:                                          │
│                                                              │
│ background-color: hsl(210 100% 23%);  /* --primary */       │
│ color: hsl(0 0% 100%);                /* --primary-fg */    │
└─────────────────────────────────────────────────────────────┘
```

**Key insight:** Changes ripple up the chain:

- Change `--color-corporate-blue` → updates `bg-corporate-blue` utility
- Change `--primary` → updates all `bg-primary` uses
- Change Button variant → updates all `<Button variant="default">` instances
- Change theme class (`.dark`) → entire app re-themes instantly

---

## Integration Points

### 1. Tailwind v4 @theme ↔ shadcn/ui Variables

**Integration:** `@theme` defines foundation, `@layer base` maps to semantic

**Current implementation (globals.css):**

```css
@theme {
  /* Foundation: Brand colors */
  --color-corporate-blue: #003F75;
  --color-tech-blue: #2884BD;
  --color-turquoise: #0FACB0;

  /* Integration: shadcn/ui semantic colors reference @layer base variables */
  --color-primary: hsl(var(--primary));
  --color-secondary: hsl(var(--secondary));
}

@layer base {
  :root {
    /* Semantic: Map brand colors to shadcn/ui tokens */
    --primary: 210 100% 23%;      /* corporate-blue */
    --secondary: 203 64% 44%;     /* tech-blue */
    --accent: 178 92% 37%;        /* turquoise */
  }
}
```

**Flow:**

```
Brand color defined    Mapped to semantic    Used in @theme       Generated utility
#003F75             →  --primary: 210...  →  --color-primary   →  bg-primary
```

**Customization workflow:**

1. Pick new brand color: `#FF5733`
2. Convert to HSL: `hsl(9 100% 60%)`
3. Add to semantic layer:
   ```css
   :root {
     --accent-secondary: 9 100% 60%;
   }
   ```
4. Reference in @theme:
   ```css
   @theme {
     --color-accent-secondary: hsl(var(--accent-secondary));
   }
   ```
5. Use in components:
   ```tsx
   <div className="bg-accent-secondary">
   ```

---

### 2. CVA Variants ↔ Tailwind Utilities

**Integration:** CVA composes Tailwind utilities into type-safe variant APIs

**Pattern:**

```typescript
// CVA definition references Tailwind utilities
const buttonVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",  // Tailwind utilities
      }
    }
  }
);

// TypeScript infers variant types
type ButtonProps = VariantProps<typeof buttonVariants>;
// → { variant?: "default" | "secondary" | ... }
```

**Benefit:** Change Tailwind config, CVA variants auto-update

**Example:** Add new spacing token:

```css
/* globals.css */
@theme {
  --spacing-2xl: 3rem;  /* NEW */
}
```

Immediately available in CVA:

```typescript
const cardVariants = cva("...", {
  variants: {
    padding: {
      xl: "p-2xl",  // Uses new token
    }
  }
});
```

---

### 3. next-themes ↔ Tailwind Dark Mode

**Integration:** next-themes manages `.dark` class, Tailwind applies dark: variants

**Current setup (app/providers.tsx):**

```tsx
<ThemeProvider
  attribute="class"           // Uses class-based dark mode
  defaultTheme="system"       // Respects OS preference
  enableSystem                // Syncs with system
  disableTransitionOnChange   // Prevents flash on theme switch
>
```

**Flow:**

```
User toggles theme
    ↓
next-themes updates <html class="dark">
    ↓
Tailwind applies .dark { --primary: ... }
    ↓
All components re-theme instantly (CSS variable swap)
```

**No JavaScript re-render needed** - pure CSS update.

**Dark mode implementation:**

```css
/* globals.css */
@layer base {
  :root {
    --primary: 210 100% 23%;  /* Light: dark blue */
  }

  .dark {
    --primary: 203 64% 44%;   /* Dark: lighter blue */
  }
}
```

Components automatically adapt:

```tsx
<Button variant="default" />
// Light mode: bg-color hsl(210 100% 23%)
// Dark mode: bg-color hsl(203 64% 44%)
```

**Testing dark mode:**

```tsx
// components/theme-toggle.tsx (already exists)
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}
```

---

### 4. Server Components ↔ Client Components with Styling

**Integration:** Styling works seamlessly across server/client boundary

**Key insight:** Tailwind classes are just CSS - no React context needed

**Pattern:**

```tsx
// app/page.tsx - Server Component (no "use client")
import { AnimatedCard } from "@/components/portfolio/animated-card";

export default function Home() {
  return (
    <div className="bg-background text-foreground">  {/* Tailwind works */}
      <AnimatedCard />  {/* Client Component island */}
    </div>
  );
}
```

```tsx
// components/portfolio/animated-card.tsx - Client Component
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export function AnimatedCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className={isHovered ? "scale-105" : ""}>  {/* Tailwind works */}
      Content
    </Card>
  );
}
```

**Both use the same design tokens** - no prop drilling needed.

**Anti-pattern to avoid:**

```tsx
// BAD: Passing theme values as props
<AnimatedCard primaryColor="#003F75" />

// GOOD: Use CSS variables
<AnimatedCard className="bg-primary" />
```

---

### 5. Animations ↔ Performance Monitoring

**Integration:** Lighthouse audits performance impact of animations

**Workflow:**

1. Add animation:
   ```tsx
   <div className="transition-transform hover:scale-105">
   ```

2. Build and test:
   ```bash
   npm run build
   npm start
   ```

3. Run Lighthouse:
   - Open Chrome DevTools
   - Lighthouse tab
   - Run audit

4. Check Core Web Vitals:
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **FID** (First Input Delay): < 100ms
   - **CLS** (Cumulative Layout Shift): < 0.1

5. If CLS increases:
   - Remove animation
   - Or switch to `transform`-based animation

**Example CLS fix:**

```css
/* BAD: Causes layout shift */
.card:hover {
  width: 320px;  /* Grows, pushes other elements */
}

/* GOOD: No layout shift */
.card:hover {
  transform: scale(1.05);  /* Grows visually, layout unchanged */
}
```

**Monitoring in production:**

```tsx
// components/analytics/web-vitals.tsx (already exists)
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);  // Send to analytics
  });
}
```

---

## Build Order for Design Polish

Based on architectural dependencies, recommended implementation sequence:

### Phase 1: Design Token Refinement (Week 1)

**Goal:** Establish polished design foundation

**Tasks:**

1. **Audit current tokens** (already in globals.css):
   - Colors: corporate-blue, tech-blue, turquoise (✓ in place)
   - Spacing: Currently using Tailwind defaults (needs custom scale?)
   - Typography: Inter font (✓ in place)
   - Shadows: Not defined (add elevation system)

2. **Add missing token categories**:
   ```css
   /* globals.css - ADD to @theme */
   @theme {
     /* Spacing scale */
     --spacing-xs: 0.25rem;
     --spacing-sm: 0.5rem;
     --spacing-md: 1rem;
     --spacing-lg: 1.5rem;
     --spacing-xl: 2rem;
     --spacing-2xl: 3rem;
     --spacing-3xl: 4rem;

     /* Shadow system */
     --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
     --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
     --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
     --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
     --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

     /* Animation durations */
     --duration-fast: 150ms;
     --duration-base: 300ms;
     --duration-slow: 500ms;
   }
   ```

3. **Test token generation**:
   - Run `npm run dev`
   - Verify utilities generated: `p-xl`, `shadow-lg`, `duration-base`
   - Check dark mode variants work

**Why first:** All subsequent work depends on design tokens

---

### Phase 2: Component Variant Extensions (Week 1-2)

**Goal:** Add design polish variants to existing shadcn/ui components

**Tasks:**

1. **Audit current component usage**:
   - Button: Used in CTAs, admin actions
   - Card: Used in project grid, pricing cards
   - Badge: Used for tech stack tags

2. **Extend Button variants**:
   ```typescript
   // components/ui/button.tsx
   const buttonVariants = cva(
     "...",
     {
       variants: {
         variant: {
           default: "...",
           // ADD:
           gradient: "bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg",
           outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
         },
         size: {
           default: "...",
           // ADD:
           xl: "h-14 px-10 text-lg",
         }
       }
     }
   );
   ```

3. **Extend Card variants**:
   ```typescript
   // components/ui/card.tsx
   const cardVariants = cva(
     "rounded-lg border bg-card text-card-foreground",
     {
       variants: {
         elevation: {
           flat: "shadow-none",
           sm: "shadow-sm",
           md: "shadow-md",
           lg: "shadow-lg hover:shadow-xl transition-shadow",
         }
       },
       defaultVariants: {
         elevation: "sm",
       }
     }
   );
   ```

4. **Test variants in isolation**:
   ```tsx
   // Test page: app/design-system/page.tsx
   export default function DesignSystemTest() {
     return (
       <div>
         <Button variant="gradient" size="xl">Gradient Button</Button>
         <Card elevation="lg">Elevated Card</Card>
       </div>
     );
   }
   ```

**Why second:** Variants are reusable across pages, establish before page-level work

---

### Phase 3: Composition Components (Week 2)

**Goal:** Create portfolio-specific composed components

**Tasks:**

1. **Identify composition patterns**:
   - ProjectCard: Card + hover effects + tech badge list
   - HeroSection: Gradient background + animated heading
   - CTAButton: Button with specific variant + icon

2. **Create composed components**:
   ```tsx
   // components/portfolio/project-card-enhanced.tsx
   import { Card, CardHeader, CardContent } from "@/components/ui/card";
   import { Badge } from "@/components/ui/badge";

   export function ProjectCardEnhanced({ project }) {
     return (
       <Card elevation="lg" className="hover:scale-105 transition-transform">
         <CardHeader>
           <h3>{project.title}</h3>
         </CardHeader>
         <CardContent>
           <div className="flex gap-2">
             {project.techStack.map(tech => (
               <Badge key={tech}>{tech}</Badge>
             ))}
           </div>
         </CardContent>
       </Card>
     );
   }
   ```

3. **Maintain Server Component compatibility**:
   - Composed components should be Server Components unless they need interactivity
   - Add "use client" only when necessary

**Why third:** Composition leverages variants from Phase 2, applied before page integration

---

### Phase 4: Static Animations (Week 2-3)

**Goal:** Add CSS-only animations (no "use client" needed)

**Tasks:**

1. **Define keyframe animations**:
   ```css
   /* globals.css - ADD */
   @keyframes fade-in-up {
     from {
       opacity: 0;
       transform: translateY(20px);
     }
     to {
       opacity: 1;
       transform: translateY(0);
     }
   }

   @theme {
     --animate-fade-in-up: fade-in-up 0.6s ease-out;
   }
   ```

2. **Apply to Server Components**:
   ```tsx
   // app/page.tsx - Server Component
   export default function Home() {
     return (
       <div className="animate-fade-in-up">
         <h1>Jon Gerton</h1>
       </div>
     );
   }
   ```

3. **Test performance**:
   - Build: `npm run build`
   - Lighthouse audit
   - Target: Performance 90+, CLS < 0.1

**Why fourth:** Static animations enhance without JavaScript overhead, test before interactive animations

---

### Phase 5: Interactive Animations (Week 3)

**Goal:** Add client-side animations where needed

**Tasks:**

1. **Identify interactive animation needs**:
   - Project card hover (needs state for complex effects)
   - Hero scroll-triggered fade-in (needs Intersection Observer)
   - Admin drag-and-drop (already implemented with @dnd-kit)

2. **Create Client Component wrappers**:
   ```tsx
   // components/portfolio/animated-project-card.tsx
   "use client";

   import { useState } from "react";
   import { ProjectCardEnhanced } from "./project-card-enhanced";

   export function AnimatedProjectCard({ project }) {
     const [isHovered, setIsHovered] = useState(false);

     return (
       <div
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
       >
         <ProjectCardEnhanced
           project={project}
           className={isHovered ? "scale-105" : ""}
         />
       </div>
     );
   }
   ```

3. **Consider tailwindcss-animate utilities**:
   ```tsx
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
     Animated content
   </div>
   ```

4. **Performance validation**:
   - Lighthouse audit after adding each animation
   - Monitor bundle size impact
   - Check Core Web Vitals in production (WebVitals component already in place)

**Why fifth:** Interactive animations are enhancement, not foundation. Add after core design is solid.

---

### Phase 6: Page-Level Integration (Week 3-4)

**Goal:** Apply design system across all pages

**Tasks:**

1. **Update page hierarchy**:
   - Home page: Hero with gradient, animated CTAs
   - Projects page: Enhanced project cards with hover effects
   - Services page: Pricing cards with elevation variants
   - About page: Typography polish, spacing refinement
   - Contact page: Form styling consistency

2. **Implement systematically**:
   ```tsx
   // app/page.tsx - BEFORE
   export default function Home() {
     return (
       <div>
         <h1>Jon Gerton</h1>
         <Button>Contact Me</Button>
       </div>
     );
   }

   // app/page.tsx - AFTER
   export default function Home() {
     return (
       <section className="bg-gradient-to-br from-primary to-accent p-3xl">
         <h1 className="animate-fade-in-up text-5xl font-bold text-white">
           Jon Gerton
         </h1>
         <Button variant="gradient" size="xl" className="mt-lg shadow-xl">
           Contact Me
         </Button>
       </section>
     );
   }
   ```

3. **Consistency checklist**:
   - [ ] All CTAs use same button variant
   - [ ] All cards use same elevation system
   - [ ] All spacing uses token scale (p-md, gap-lg, etc.)
   - [ ] All animations use GPU-accelerated properties
   - [ ] Dark mode tested on every page

**Why sixth:** Page integration is final assembly, depends on all foundation work

---

### Phase 7: Performance Validation & Polish (Week 4)

**Goal:** Ensure design polish doesn't degrade performance

**Tasks:**

1. **Production build audit**:
   ```bash
   npm run build
   npm start
   ```

2. **Lighthouse audit (all pages)**:
   - Home: Target 90+ performance
   - Projects: Check LCP (hero image)
   - Services: Check CLS (pricing cards)
   - Contact: Check FID (form interactions)
   - About: Baseline (static content)

3. **Fix performance regressions**:
   - If CLS > 0.1: Remove layout-shifting animations
   - If FID > 100ms: Reduce JavaScript bundle (check "use client" usage)
   - If LCP > 2.5s: Optimize images (next/image already in use)

4. **Dark mode final check**:
   - Test all pages in dark mode
   - Verify contrast ratios (WCAG AA minimum)
   - Check for missed semantic tokens

5. **Cross-browser testing**:
   - Chrome (primary)
   - Safari (iOS users)
   - Firefox (for Tailwind compatibility)

**Why last:** Performance validation catches regressions before launch

---

## Dependency Graph

```
Phase 1 (Tokens)
    ├──> Phase 2 (Variants) [uses tokens]
    │       ├──> Phase 3 (Composition) [uses variants]
    │       │       └──> Phase 6 (Page Integration) [uses compositions]
    │       │
    │       └──> Phase 4 (Static Animations) [uses tokens + variants]
    │               └──> Phase 5 (Interactive Animations) [builds on static]
    │                       └──> Phase 6 (Page Integration)
    │
    └──> Phase 7 (Performance) [validates all phases]
```

**Critical path:** Tokens → Variants → Composition → Page Integration → Performance
**Parallel work:** Static and Interactive Animations can develop alongside Composition

---

## Performance Impact Assessment

| Change Type | Bundle Size Impact | Runtime Impact | Lighthouse Score Impact |
|-------------|-------------------|----------------|------------------------|
| **Design tokens** (@theme) | None (CSS only) | None (CSS variables) | Zero |
| **Semantic variables** | None (CSS only) | None (CSS variables) | Zero |
| **CVA variants** | +2KB per component | None (static classes) | Zero |
| **Tailwind utilities** | Minimal (PurgeCSS) | None (static CSS) | Zero |
| **Static animations** | None (CSS keyframes) | Minimal (GPU-accelerated) | Zero if transform/opacity only |
| **"use client" per component** | +5-10KB per component | Hydration cost | -5 to -10 points if overused |
| **tailwindcss-animate** | +3KB (already installed) | None (CSS only) | Zero |
| **Framer Motion** | +50KB (NOT recommended) | High (runtime animations) | -10 to -20 points |

**Current jpgerton.com baseline (from existing research):**
- Tailwind v4: Already configured (CSS-first, fast builds)
- shadcn/ui: 13 components installed (~30KB total)
- tailwindcss-animate: Already installed

**Projected impact of design polish milestone:**
- Additional bundle size: +5-10KB (variant extensions)
- Performance score: Unchanged (all CSS-based)
- LCP impact: None (no new images/fonts)
- CLS impact: Zero if transform-based animations only
- FID impact: +10-20ms if adding 2-3 new Client Components

**Stay within budget:**
- Total JavaScript: Keep < 100KB (currently ~60KB with Convex client)
- CSS: Tailwind purges unused classes (production ~20KB)
- Lighthouse Performance: Maintain 90+ score

---

## Sources

**High Confidence (Official Documentation):**

- [Tailwind CSS v4.0 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui CLI](https://ui.shadcn.com/docs/cli)
- [Class Variance Authority (CVA)](https://cva.style/docs)
- [Next.js use client Directive](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [Tailwind CSS will-change](https://tailwindcss.com/docs/will-change)
- [Tailwind CSS transform](https://tailwindcss.com/docs/transform)
- [Tailwind CSS animation](https://tailwindcss.com/docs/animation)

**Medium Confidence (Industry Best Practices):**

- [Tailwind CSS 4 @theme: The Future of Design Tokens (2025 Guide)](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06)
- [Tailwind CSS Best Practices 2025-2026: Design Tokens, Typography & Responsive Patterns](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Customizing shadcn/ui Themes Without Breaking Updates](https://medium.com/@sureshdotariya/customizing-shadcn-ui-themes-without-breaking-updates-a3140726ca1e)
- [The anatomy of shadcn/ui](https://manupa.dev/blog/anatomy-of-shadcn-ui)
- [Exploring globals.css - Vercel Academy](https://vercel.com/academy/shadcn-ui/exploring-globals-css)
- [Why shadcn/ui is Different - Vercel Academy](https://vercel.com/academy/shadcn-ui/why-shadcn-ui-is-different)
- [The Anatomy of shadcn/ui Components - Vercel Academy](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components)
- [Updating and Maintaining Components - Vercel Academy](https://vercel.com/academy/shadcn-ui/updating-and-maintaining-components)
- [Next.js 15 App Router: Complete Guide to Server and Client Components](https://dev.to/devjordan/nextjs-15-app-router-complete-guide-to-server-and-client-components-5h6k)
- [How to Create Smooth Motion Animations with Tailwind CSS](https://strapi.io/blog/create-strapi-motion-animations-tailwind-css)
- [Advanced Tailwind CSS Transitions: Creating Complex and Responsive Animations](https://blog.openreplay.com/advanced-tailwind-transitions/)
- [Optimizing Core Web Vitals in Next.js 15 Apps with Tailwind CSS 4](https://medium.com/@sureshdotariya/optimizing-core-web-vitals-in-next-js-15-apps-with-tailwind-css-4-f40f854b9b65)
- [Next.js performance tuning: practical fixes for better Lighthouse scores](https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores)
- [The Pyramid Design Token Structure](https://stefaniefluin.medium.com/the-pyramid-design-token-structure-the-best-way-to-format-organize-and-name-your-design-tokens-ca81b9d8836d)
- [Naming Tokens in Design Systems - EightShapes](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)

---

*Design system architecture research for jpgerton.com design polish milestone*
*Researched: 2026-02-04*
*Focus: Tailwind v4 + shadcn/ui integration patterns*
