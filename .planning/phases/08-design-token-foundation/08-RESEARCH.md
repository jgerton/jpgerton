# Phase 8: Design Token Foundation - Research

**Researched:** 2026-02-04
**Domain:** Tailwind CSS v4 Design Tokens (@theme directive), shadcn/ui theming, spacing scales, shadow systems, animation durations
**Confidence:** HIGH

## Summary

Phase 8 establishes a comprehensive design token system using Tailwind CSS v4's @theme directive, moving from arbitrary values to a consistent token-based design language. The research reveals that Tailwind v4 introduced a fundamental shift from JavaScript configuration to CSS-first design tokens, where tokens defined in @theme automatically generate utility classes AND become available as CSS variables at runtime.

The project currently has a hybrid setup: Tailwind v4 is installed with a basic @theme block in globals.css (colors, radius, fonts only), but still has a legacy tailwind.config.ts file from the v3 era. The codebase shows significant usage of arbitrary values (e.g., `rounded-[calc(var(--radius-xl)-1px)]`), inconsistent spacing (mix of p-1, p-3, p-6, p-8 with no clear scale), minimal animation tokens, and no shadow elevation system beyond the defaults.

shadcn/ui's semantic color system is partially implemented, with all required variables present in both :root and .dark modes, but the current setup doesn't leverage Tailwind v4's full capabilities. The background/foreground convention is working, but colors are defined twice (once in @theme as --color-* referencing HSL variables, again in :root as bare CSS variables), which is redundant in v4.

Key findings show that successful design token systems follow a three-tier hierarchy (global, semantic, component), use 8pt grid spacing systems (4px/8px base with multiples), implement 5-level shadow elevation (xs, sm, md, lg, xl), and define semantic animation durations (fast ~150ms, base ~300ms, slow ~500ms). The @theme directive makes tokens both compile-time utilities and runtime CSS variables, eliminating the need for separate definitions.

**Primary recommendation:** Define spacing scale (xs: 4px through 3xl: 64px), shadow elevation system (xs through xl with distinct blur/spread values), and animation duration tokens (fast/base/slow) in globals.css @theme block. Audit semantic colors to ensure all HSL values are intentional (not defaulted). Eliminate tailwind.config.ts in favor of CSS-first configuration. Replace arbitrary spacing values with token-based utilities across the codebase.

## Standard Stack

The established libraries/tools for Tailwind v4 design token systems:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.1.18+ | CSS-first framework with @theme | v4's @theme directive generates utilities from CSS variables, 3.5x faster builds, eliminates JS config |
| @tailwindcss/postcss | 4.1.18+ | PostCSS plugin for v4 | Required for v4, processes @theme and generates utilities |
| tailwindcss-animate | 1.0.7 | Animation utilities | Community standard for shadcn/ui, provides fade-in/out, slide, zoom utilities |
| shadcn/ui | Latest | Component system | Industry-leading component library, CSS variable theming, background/foreground convention |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.1+ | Component variant management | Extending shadcn/ui with custom variants without modifying source |
| tailwind-merge | 3.4.0+ | Class name conflict resolution | Merging utility classes dynamically, already in project (cn() utility) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 @theme | Tailwind v3 config.js | Lose CSS-first benefits, slower builds, no runtime CSS variables |
| CSS variables | CSS-in-JS tokens | Lose Tailwind utility generation, more complex theming |
| 8pt grid | Custom scale | Miss industry-standard spacing rhythm, harder for designers to collaborate |
| shadcn/ui colors | Custom semantic system | Lose component compatibility, must redefine all component color logic |

**Installation:**
All required packages already installed in package.json. No additional dependencies needed.

## Architecture Patterns

### Recommended Project Structure
```
app/
├── globals.css              # @theme tokens, semantic colors, base styles
│   ├── @theme {             # Design tokens (spacing, shadows, animations)
│   │   --spacing-*          # xs through 3xl
│   │   --shadow-*           # xs through xl
│   │   --ease-*             # Custom timing functions
│   │   --duration-*         # fast, base, slow
│   │   --radius-*           # Border radius tokens
│   ├── @layer base {        # Semantic color variables
│   │   :root                # Light mode HSL values
│   │   .dark                # Dark mode HSL values
components/
├── ui/                      # shadcn/ui components (use semantic colors)
└── [custom]/                # Custom components (extend via CVA variants)
```

### Pattern 1: Spacing Scale in @theme

**What:** Define spacing tokens that generate p-*, m-*, gap-*, w-*, h-* utilities
**When to use:** Every layout and component spacing decision
**Example:**
```css
/* app/globals.css */
@theme {
  /* Spacing scale - 8pt grid with 4px half-steps */
  --spacing-xs: 4px;      /* 0.25rem - tight spacing, icons */
  --spacing-sm: 8px;      /* 0.5rem - compact elements */
  --spacing-md: 16px;     /* 1rem - standard spacing */
  --spacing-lg: 24px;     /* 1.5rem - comfortable spacing */
  --spacing-xl: 32px;     /* 2rem - section spacing */
  --spacing-2xl: 48px;    /* 3rem - large sections */
  --spacing-3xl: 64px;    /* 4rem - hero spacing */
}

/* Generates utilities automatically: */
/* p-xs, p-sm, p-md, p-lg, p-xl, p-2xl, p-3xl */
/* m-xs, m-sm, m-md, m-lg, m-xl, m-2xl, m-3xl */
/* gap-xs, gap-sm, gap-md, gap-lg, gap-xl, gap-2xl, gap-3xl */
/* w-xs, w-sm, w-md, w-lg, w-xl, w-2xl, w-3xl */
/* h-xs, h-sm, h-md, h-lg, h-xl, h-2xl, h-3xl */
```

**Usage:**
```tsx
// Before (arbitrary values)
<div className="p-6 gap-4">

// After (token-based)
<div className="p-md gap-sm">
```

**Source:** [Tailwind CSS v4 @theme directive](https://tailwindcss.com/docs/theme)

### Pattern 2: Shadow Elevation System

**What:** Five-level shadow system for UI hierarchy (xs, sm, md, lg, xl)
**When to use:** Cards, modals, dropdowns, hover states
**Example:**
```css
/* app/globals.css */
@theme {
  /* Shadow elevation system */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Generates utilities: shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl */
```

**Usage guidelines:**
- **xs:** Subtle elevation, borders, slight separation
- **sm:** Interactive elements (cards, buttons on hover)
- **md:** Elevated cards, active states
- **lg:** Floating elements (dropdowns, tooltips)
- **xl:** Modals, overlays, maximum elevation

**Source:** [Design System Shadow Tokens](https://designsystem.digital.gov/design-tokens/shadow/)

### Pattern 3: Animation Duration Tokens

**What:** Semantic animation durations for consistent motion
**When to use:** All transitions, animations, hover effects
**Example:**
```css
/* app/globals.css */
@theme {
  /* Animation duration tokens */
  --duration-fast: 150ms;   /* Quick interactions (hover, focus) */
  --duration-base: 300ms;   /* Standard transitions (cards, modals) */
  --duration-slow: 500ms;   /* Deliberate animations (page transitions) */

  /* Custom easing functions */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Generates utilities: */
/* duration-fast, duration-base, duration-slow */
/* ease-smooth, ease-bounce */
```

**Usage:**
```tsx
// GPU-accelerated properties only (transform, opacity)
<div className="transition-transform duration-base ease-smooth hover:scale-105">

// Multiple properties with token durations
<button className="transition-colors duration-fast hover:bg-primary">
```

**Critical:** Only animate GPU-accelerated properties (transform, opacity) to maintain Lighthouse 100 score. Avoid animating layout properties (width, height, margin, padding).

**Source:** [Tailwind CSS transition-duration](https://tailwindcss.com/docs/transition-duration)

### Pattern 4: Semantic Color Auditing

**What:** Verify all shadcn/ui semantic colors are intentionally set (not defaulted)
**When to use:** Initial setup and when adding new theme colors
**Example:**
```css
/* app/globals.css */
@layer base {
  :root {
    /* Required semantic colors - ALL must be defined */
    --background: 0 0% 100%;           /* ✓ Intentional white */
    --foreground: 0 0% 10%;            /* ✓ Intentional near-black */
    --card: 0 0% 100%;                 /* ✓ Intentional white */
    --card-foreground: 0 0% 10%;       /* ✓ Intentional near-black */
    --popover: 0 0% 100%;              /* ✓ Intentional white */
    --popover-foreground: 0 0% 10%;    /* ✓ Intentional near-black */
    --primary: 210 100% 23%;           /* ✓ Corporate blue */
    --primary-foreground: 0 0% 100%;   /* ✓ White text on blue */
    --secondary: 203 64% 44%;          /* ✓ Tech blue */
    --secondary-foreground: 0 0% 100%; /* ✓ White text on blue */
    --muted: 0 0% 96%;                 /* ✓ Light gray */
    --muted-foreground: 0 0% 45%;      /* ✓ Medium gray text */
    --accent: 178 92% 37%;             /* ✓ Turquoise */
    --accent-foreground: 0 0% 100%;    /* ✓ White text on turquoise */
    --destructive: 0 84% 60%;          /* ✓ Red */
    --destructive-foreground: 0 0% 100%; /* ✓ White text on red */
    --border: 0 0% 90%;                /* ✓ Light gray border */
    --input: 0 0% 90%;                 /* ✓ Light gray input bg */
    --ring: 210 100% 23%;              /* ✓ Corporate blue focus ring */
    --radius: 8px;                     /* ✓ Standard border radius */
  }

  .dark {
    /* ALL must have dark mode equivalents with DIFFERENT values */
    --background: 0 0% 10%;            /* ✓ Near-black, not white */
    --foreground: 0 0% 95%;            /* ✓ Off-white, not black */
    /* ... all other variables ... */
  }
}
```

**Audit checklist:**
1. Every --variable in :root has a .dark counterpart
2. Light and dark values are DIFFERENT (not copy-pasted)
3. Foreground colors have sufficient contrast with their background (WCAG AA minimum)
4. No placeholder values like 0 0% 0% or 0 0% 100% for semantic colors (those are valid only for background/foreground base colors)
5. Border and input colors are visible on their respective backgrounds

**Source:** [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)

### Pattern 5: Migrating from Arbitrary Values to Tokens

**What:** Replace arbitrary spacing values with token-based utilities
**When to use:** Refactoring existing components to use design tokens
**Example:**
```tsx
// Before (arbitrary values - found in codebase)
<div className="p-6 gap-4 rounded-[calc(var(--radius-xl)-1px)]">
  <Card className="p-3 mt-8" />
</div>

// After (token-based)
<div className="p-md gap-sm rounded-lg">
  <Card className="p-sm mt-xl" />
</div>

// Before (mixed arbitrary and default Tailwind)
<section className="py-1.5 pl-8 pr-2">
  <div className="gap-6" />
</section>

// After (consistent token scale)
<section className="py-xs pl-xl pr-sm">
  <div className="gap-md" />
</section>
```

**Migration strategy:**
1. Audit codebase for arbitrary spacing values: `\[(\d+)(px|rem)\]`
2. Map to nearest token (4px→xs, 8px→sm, 16px→md, 24px→lg, 32px→xl, 48px→2xl, 64px→3xl)
3. Replace default Tailwind utilities (p-1 through p-12) with token utilities
4. Document exceptions where arbitrary values are truly necessary (rare edge cases)

### Anti-Patterns to Avoid

- **Arbitrary spacing everywhere:** Using `p-[17px]` when token system exists
- **Mixing scales:** Using both token utilities (p-md) and default Tailwind (p-6) in same component
- **No shadow hierarchy:** Using shadow-md for everything instead of intentional elevation levels
- **Animating layout properties:** Animating width, height, margin (causes reflow, hurts performance)
- **Duplicate token definitions:** Defining same value in both @theme and :root (v4 does this automatically)
- **Component-specific tokens too early:** Creating button-specific spacing tokens before establishing global scale
- **Inconsistent dark mode:** Light mode values work, dark mode uses placeholders or copy-pasted light values

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spacing scale calculation | Custom values for each size | 8pt grid (4px base) | Industry standard, divisible by common screen sizes, designer-friendly |
| Shadow elevation levels | Random box-shadow values | Five-level system (xs-xl) | Consistent depth hierarchy, proven in Material Design, shadcn/ui defaults |
| Animation duration values | Random millisecond values | Semantic tokens (fast/base/slow) | Consistent motion language, easy to adjust globally, accessibility-friendly |
| Semantic color naming | Direct color values in components | shadcn/ui background/foreground convention | Theme-able, dark mode support, component compatibility |
| Tailwind v4 migration | Manual utility class mapping | @theme directive | Automatic utility generation, runtime CSS variables, no JS config needed |
| Design token hierarchy | Flat token structure | Three-tier (global, semantic, component) | Scalable, theme-able, clear intent |

**Key insight:** Tailwind v4's @theme directive eliminates the need for separate token management tools. Design tokens defined in @theme automatically generate utility classes AND become available as CSS variables at runtime, providing a single source of truth.

## Common Pitfalls

### Pitfall 1: Not Removing Legacy tailwind.config.ts

**What goes wrong:** Tailwind v4 with @theme directive doesn't need tailwind.config.ts, but developers keep it from v3 migration, causing confusion about which configuration is active
**Why it happens:** Migration guides show both approaches, unclear which takes precedence
**How to avoid:**
- Delete tailwind.config.ts completely when using @theme directive
- Move all theme customization to globals.css @theme block
- Keep config file ONLY if using plugins that require JavaScript configuration
**Warning signs:**
- Changes in @theme don't seem to work
- Utilities not generating as expected
- Build tool errors about conflicting configuration

**Source:** [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4)

### Pitfall 2: Defining Colors Twice (Redundant v4 Pattern)

**What goes wrong:** Defining colors in both @theme and :root, when @theme already makes them available as CSS variables
**Why it happens:** Confusion between v3 pattern (where you needed both) and v4 (where @theme does both)
**How to avoid:**
```css
/* WRONG - Redundant in v4 */
@theme {
  --color-primary: hsl(var(--primary));
}
@layer base {
  :root {
    --primary: 210 100% 23%;
  }
}

/* RIGHT - v4 approach for shadcn/ui */
@layer base {
  :root {
    --primary: 210 100% 23%;  /* HSL values only */
  }
}
@theme inline {
  --color-primary: var(--primary);  /* Reference HSL vars */
}
```
**Warning signs:**
- Colors defined in multiple places
- Not sure which value is being used
- Changes to color values don't update everywhere

**Source:** [shadcn/ui Theming with Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)

### Pitfall 3: Arbitrary Values Defeating Token System

**What goes wrong:** Team defines comprehensive token system, but developers continue using arbitrary values (e.g., `p-[23px]`) because they're "faster"
**Why it happens:** Arbitrary values are convenient, developers don't understand token benefits
**How to avoid:**
- Use ESLint plugin to warn on arbitrary spacing/shadow values
- Document token scale prominently in component library
- Code review to catch arbitrary values slipping through
- Make tokens easy to discover (auto-complete, IntelliSense)
**Warning signs:**
- Grep shows many `\[\d+px\]` patterns in codebase
- Same spacing value defined multiple ways
- No consistent spacing rhythm across pages

### Pitfall 4: Wrong Shadow Levels (No Hierarchy)

**What goes wrong:** Using shadow-md for everything, or random shadow levels with no intentional hierarchy
**Why it happens:** Not understanding elevation system, just trying values until "looks good"
**How to avoid:**
- Document clear use cases for each shadow level
- Use shadow-sm as default for cards
- Reserve shadow-lg/xl for modals and floating elements
- Hover states should increase shadow by one level (sm→md)
**Warning signs:**
- shadow-xl on regular cards
- Inconsistent elevation across similar components
- Modals don't visually "float" above content

**Source:** [Elevation Design Patterns](https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy)

### Pitfall 5: Animating Non-GPU Properties

**What goes wrong:** Animating width, height, margin, padding causes layout reflow and hurts Lighthouse score
**Why it happens:** Not understanding which CSS properties are GPU-accelerated
**How to avoid:**
- ONLY animate transform and opacity
- Use scale(1.05) instead of width: 105%
- Use opacity: 0 instead of display: none for hide/show
- Document GPU-safe properties in component library
**Warning signs:**
- Lighthouse performance score drops below 100
- Animations feel janky on low-power devices
- Browser DevTools shows layout thrashing

**2026 Context:** Lighthouse now heavily penalizes layout animations. Must maintain 100 score by using transform/opacity only.

**Source:** [Tailwind Animation Best Practices](https://tailkits.com/blog/tailwind-animation-utilities/)

### Pitfall 6: Inconsistent Dark Mode Values

**What goes wrong:** Dark mode colors are copy-pasted from light mode or use placeholder values, making dark mode unusable
**Why it happens:** Testing only in light mode during development
**How to avoid:**
- Test dark mode simultaneously during development
- Every color in :root MUST have different value in .dark
- Use browser DevTools to toggle between modes constantly
- Document both modes in design system
**Warning signs:**
- Dark mode looks identical to light mode
- Text unreadable in dark mode (insufficient contrast)
- Borders invisible in dark mode

### Pitfall 7: Token Naming Without Scale Clarity

**What goes wrong:** Token names like --spacing-1, --spacing-2, --spacing-3 don't communicate size relationship
**Why it happens:** Following generic naming patterns without semantic meaning
**How to avoid:**
- Use semantic scale names (xs, sm, md, lg, xl, 2xl, 3xl)
- Document pixel values alongside names
- Ensure names communicate hierarchy (xs = smallest, 3xl = largest)
**Warning signs:**
- Developers can't remember which number is which size
- Inconsistent usage because names aren't intuitive
- Need to look up token values constantly

**Source:** [Design Token Naming Best Practices](https://www.netguru.com/blog/design-token-naming-best-practices)

### Pitfall 8: Skipping Spacing Audit Before Token Migration

**What goes wrong:** Migrating to token system without auditing current spacing usage, resulting in arbitrary token choices
**Why it happens:** Eager to implement tokens without understanding current patterns
**How to avoid:**
1. Audit all spacing values currently used in codebase
2. Identify most common values (these become your tokens)
3. Map existing arbitrary values to nearest token
4. Document exceptions where arbitrary values remain necessary
**Warning signs:**
- Token scale doesn't match actual usage patterns
- Need many arbitrary values after "token migration"
- Tokens rarely used because they don't match real needs

### Pitfall 9: Creating Component Tokens Too Early

**What goes wrong:** Defining button-specific, card-specific, modal-specific tokens before establishing global scale
**Why it happens:** Following three-tier token hierarchy too literally, over-engineering
**How to avoid:**
- Start with global tokens only (spacing, shadows, animations)
- Add semantic tokens when clear use cases emerge (e.g., --spacing-section for consistent section spacing)
- Add component tokens LAST, only when component needs differ from semantic tokens
**Warning signs:**
- Dozens of component tokens with minimal usage
- Duplication between component tokens
- Component tokens that just reference semantic tokens (unnecessary layer)

**Source:** [Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)

## Code Examples

Verified patterns from official sources:

### Complete @theme Configuration with All Token Types

```css
/* app/globals.css */
@import "tailwindcss";
@plugin "tailwindcss-animate";

/* Design tokens - single source of truth */
@theme {
  /* ===== SPACING SCALE (8pt grid with 4px half-steps) ===== */
  --spacing-xs: 4px;      /* 0.25rem - Icon spacing, tight gaps */
  --spacing-sm: 8px;      /* 0.5rem - Compact padding */
  --spacing-md: 16px;     /* 1rem - Standard spacing (base) */
  --spacing-lg: 24px;     /* 1.5rem - Comfortable spacing */
  --spacing-xl: 32px;     /* 2rem - Section spacing */
  --spacing-2xl: 48px;    /* 3rem - Large sections */
  --spacing-3xl: 64px;    /* 4rem - Hero/landmark spacing */

  /* ===== SHADOW ELEVATION SYSTEM ===== */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* ===== ANIMATION DURATIONS ===== */
  --duration-fast: 150ms;   /* Quick interactions (hover, focus) */
  --duration-base: 300ms;   /* Standard transitions */
  --duration-slow: 500ms;   /* Deliberate animations */

  /* ===== CUSTOM EASING FUNCTIONS ===== */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* ===== BRAND COLORS ===== */
  --color-corporate-blue: #003F75;
  --color-tech-blue: #2884BD;
  --color-turquoise: #0FACB0;
  --color-soft-black: #1A1A1A;
  --color-graphite: #696969;

  /* ===== BORDER RADIUS ===== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* ===== FONT FAMILY ===== */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

/* shadcn/ui semantic color integration with @theme */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

/* CSS Variables for shadcn/ui theming */
@layer base {
  :root {
    /* Foundation colors */
    --background: 0 0% 100%;
    --foreground: 0 0% 10%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 10%;

    /* Brand colors as semantic tokens */
    --primary: 210 100% 23%;      /* corporate-blue */
    --primary-foreground: 0 0% 100%;
    --secondary: 203 64% 44%;     /* tech-blue */
    --secondary-foreground: 0 0% 100%;
    --accent: 178 92% 37%;        /* turquoise */
    --accent-foreground: 0 0% 100%;

    /* Neutral semantic colors */
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* Structural colors */
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 210 100% 23%;
    --radius: 8px;

    /* Admin-specific colors (distinct backstage aesthetic) */
    --admin-bg: 220 14% 96%;
    --admin-sidebar: 220 14% 100%;
    --admin-border: 220 13% 91%;
  }

  .dark {
    --background: 0 0% 10%;        /* soft-black */
    --foreground: 0 0% 95%;
    --card: 0 0% 12%;
    --card-foreground: 0 0% 95%;
    --popover: 0 0% 12%;
    --popover-foreground: 0 0% 95%;
    --primary: 203 64% 44%;        /* tech-blue for dark mode */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 100% 23%;     /* corporate-blue */
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 65%;
    --accent: 178 92% 37%;         /* turquoise */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 203 64% 44%;

    /* Admin-specific colors (dark mode) */
    --admin-bg: 220 14% 10%;
    --admin-sidebar: 220 14% 13%;
    --admin-border: 220 13% 20%;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }

  /* Admin layout utilities */
  .admin-layout {
    background-color: hsl(var(--admin-bg));
  }
  .bg-admin {
    background-color: hsl(var(--admin-bg));
  }
  .bg-admin-sidebar {
    background-color: hsl(var(--admin-sidebar));
  }
  .border-admin {
    border-color: hsl(var(--admin-border));
  }
}
```

**Source:** [Tailwind CSS v4 @theme directive](https://tailwindcss.com/docs/theme)

### Token Usage in Components

```tsx
// components/ui/card.tsx - Using spacing tokens
import { cn } from "@/lib/utils"

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
)

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-xs p-md", className)}
    {...props}
  />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-md pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div
    className={cn("flex items-center p-md pt-0", className)}
    {...props}
  />
)
```

### GPU-Accelerated Animation with Tokens

```tsx
// components/portfolio/project-card.tsx
export function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-base group">
      <div className="relative aspect-video">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-base ease-smooth"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

// What's happening:
// - hover:shadow-lg increases elevation by 2 levels (sm default → lg on hover)
// - transition-shadow duration-base uses 300ms token
// - transform and opacity only (GPU-accelerated)
// - scale() instead of width animation (no reflow)
```

**Source:** [GPU-Accelerated Animations](https://tailkits.com/blog/tailwind-animation-utilities/)

### Spacing Consistency Pattern

```tsx
// app/page.tsx - Consistent spacing rhythm
export default function HomePage() {
  return (
    <div className="container mx-auto">
      {/* Hero section - largest spacing */}
      <section className="py-3xl px-md">
        <h1 className="mb-lg">Welcome</h1>
        <p className="mb-md">Subtitle text</p>
      </section>

      {/* Content sections - standard spacing */}
      <section className="py-2xl px-md">
        <h2 className="mb-lg">Features</h2>
        <div className="grid grid-cols-3 gap-md">
          {/* Cards with consistent padding */}
          <Card className="p-md">
            <CardHeader className="p-0 mb-sm">
              <CardTitle>Feature 1</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              Content here
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compact section - smaller spacing */}
      <section className="py-xl px-md">
        <div className="flex gap-sm items-center">
          <Icon className="w-xs h-xs" />
          <span>Icon with tight spacing</span>
        </div>
      </section>
    </div>
  )
}

// Spacing pattern:
// - 3xl (64px) for hero/landmark sections
// - 2xl (48px) for major content sections
// - xl (32px) for minor sections
// - lg (24px) for comfortable spacing between elements
// - md (16px) for standard spacing (cards, grids)
// - sm (8px) for compact spacing (icon gaps, tight layouts)
// - xs (4px) for minimal spacing (icon sizing, borders)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 config.js | Tailwind v4 @theme directive | v4.0 (Jan 2025) | CSS-first configuration, 3.5x faster builds, runtime CSS variables |
| Manual spacing values | 8pt grid tokens | Industry standard (2020+) | Consistent rhythm, designer-friendly, scalable |
| Arbitrary shadows | Five-level elevation system | Material Design (2014+), refined 2024 | Clear hierarchy, intentional depth, consistent across design systems |
| Generic animation durations | Semantic duration tokens (fast/base/slow) | Design system evolution (2022+) | Accessible, consistent motion language, easy global adjustments |
| Flat token structure | Three-tier hierarchy (global/semantic/component) | Design token spec (2023+) | Scalable, theme-able, clear intent |
| JavaScript config for colors | CSS variables + @theme inline | Tailwind v4 (2025) | Runtime theming, no rebuild for theme changes |
| shadow-sm through shadow-2xl | shadow-xs through shadow-xl | Tailwind v4 (2025) | Consistent with other scales, renamed for clarity |

**Deprecated/outdated:**
- **tailwind.config.js for theme:** Use @theme directive instead
- **Arbitrary spacing without tokens:** Creates inconsistent spacing rhythm
- **Animating layout properties:** Hurts Lighthouse score, use transform/opacity
- **Defining colors in both @theme and :root:** v4 makes @theme available as CSS variables automatically
- **shadow-2xl naming:** Now shadow-xl in v4
- **Component-first tokens:** Start with global tokens, add semantic/component layers only when needed

## Open Questions

Things that couldn't be fully resolved:

1. **Migration Strategy for Existing Arbitrary Values**
   - What we know: Codebase has arbitrary spacing values in select.tsx, textarea.tsx, toast.tsx, honeypot-field.tsx
   - What's unclear: Whether to migrate all at once or gradually, which components are priorities
   - Recommendation: Prioritize public-facing components (portfolio, services pages) first, admin components second. Use regex audit to find all `\[(\d+)(px|rem)\]` patterns and map to nearest token.

2. **Custom Tokens Beyond Base Scale**
   - What we know: Current codebase uses p-1, p-3, p-6, p-8 which don't map cleanly to 8pt grid
   - What's unclear: Whether to create intermediate tokens (e.g., --spacing-xs-plus: 6px) or round to nearest token
   - Recommendation: Round to nearest token (p-1→xs, p-3→sm, p-6→md, p-8→lg). Document that minor visual shifts are expected and acceptable for consistency.

3. **Animation Performance on Low-End Devices**
   - What we know: Must maintain Lighthouse 100 by using GPU-accelerated properties only
   - What's unclear: Whether duration tokens need device-specific adjustments (slower on mobile?)
   - Recommendation: Use same duration tokens across devices. GPU acceleration handles performance. If issues arise, use prefers-reduced-motion media query to disable animations entirely for accessibility.

4. **Shadow Elevation in Dark Mode**
   - What we know: Shadow system defined with rgb(0 0 0 / opacity) works in light mode
   - What's unclear: Whether dark mode needs lighter shadows (e.g., rgb(255 255 255 / opacity)) for visibility
   - Recommendation: Test current shadow system in dark mode first. If shadows disappear, add dark mode overrides: `dark:shadow-[custom-lighter-shadow]` or define separate --shadow-*-dark tokens.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) - CSS-first configuration, @theme directive, performance improvements
- [Tailwind CSS @theme directive](https://tailwindcss.com/docs/theme) - Complete syntax, namespace reference, examples
- [Tailwind CSS transition-duration](https://tailwindcss.com/docs/transition-duration) - Duration utilities, custom tokens
- [Tailwind CSS transition-timing-function](https://tailwindcss.com/docs/transition-timing-function) - Easing functions, custom cubic-bezier
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming) - Semantic color system, background/foreground convention
- [shadcn/ui Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) - v4 migration guide for shadcn/ui

### Secondary (MEDIUM confidence)
- [8-Point Grid](https://spec.fm/specifics/8-pt-grid) - Spacing system rationale, implementation guide
- [Design System Shadow Tokens (USWDS)](https://designsystem.digital.gov/design-tokens/shadow/) - Shadow levels, elevation patterns
- [Elevation Design Patterns](https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy) - Shadow tokens, roles, hierarchy
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) - Design tokens, responsive patterns
- [Design Token Naming Best Practices](https://www.netguru.com/blog/design-token-naming-best-practices) - Naming conventions, semantic structure
- [Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676) - Three-tier hierarchy, semantic vs component tokens
- [Common Mistakes in Design Tokens Adoption](https://designtokens.substack.com/p/common-mistakes-in-design-tokens) - Pitfalls, anti-patterns
- [Tailwind Animation Best Practices](https://tailkits.com/blog/tailwind-animation-utilities/) - GPU acceleration, performance
- [Master Transitions in Tailwind v4](https://tailkits.com/blog/tailwind-transitions-guide/) - Duration & delay tokens, bracket notation

### Tertiary (LOW confidence - requires validation)
- [Guidance on arbitrary values vs design system tokens](https://github.com/tailwindlabs/tailwindcss/discussions/18748) - Community discussion on when to use each
- [Tailwind v4 @theme migration gotchas](https://typescript.tv/hands-on/upgrading-to-tailwind-css-v4-a-migration-guide/) - Migration challenges
- WebSearch results for design token auditing, spacing systems, shadow elevation (multiple sources cross-verified)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages already installed, Tailwind v4 official features, shadcn/ui industry standard
- Architecture: HIGH - Patterns from official Tailwind docs, shadcn/ui docs, established design system practices
- Pitfalls: HIGH - Mix of official documentation warnings, community-verified patterns, and identified issues in current codebase

**Research date:** 2026-02-04
**Valid until:** 2026-05-04 (90 days - stable ecosystem, design token patterns well-established)

**Key considerations for planning:**
1. Project already has Tailwind v4 installed (4.1.18) with basic @theme block - ready for expansion
2. Legacy tailwind.config.ts exists - should be evaluated for removal
3. Arbitrary spacing values present in 4 files - need migration plan
4. shadcn/ui semantic colors fully defined - audit can focus on intentionality verification
5. No shadow elevation system beyond defaults - clean slate for implementation
6. Animation tokens completely missing - straightforward addition
7. Lighthouse 100 score is hard requirement - must verify GPU-only animations
8. Dark mode already implemented - need to verify shadow visibility and token consistency
