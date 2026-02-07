# Phase 9: Component Variant Extensions - Research

**Researched:** 2026-02-05
**Domain:** Component variant systems with CVA (Class Variance Authority), type-safe design systems, shadcn/ui extension patterns
**Confidence:** HIGH

## Summary

Phase 9 extends existing shadcn/ui components (Button, Card, Badge, Form, Navigation) with CVA-powered variants to create a comprehensive visual hierarchy system. The research confirms that CVA 0.7.1 (already installed in the project) is the industry-standard solution for type-safe variant management in React/TypeScript design systems.

Key findings indicate that shadcn/ui components already use CVA for variant management, but with limited variant sets. The extension pattern involves expanding the `variants` object in existing CVA definitions while maintaining backward compatibility through `defaultVariants`. All animations must use GPU-accelerated properties (transform, opacity) to maintain Lighthouse 100 score requirements.

The project's existing token system (Phase 8) provides the foundation: spacing tokens (8pt grid), shadow elevation (xs/sm/md/lg/xl), duration tokens (fast/base/slow), and semantic colors (all WCAG AA compliant). These tokens integrate directly with CVA variant definitions.

**Primary recommendation:** Extend existing component CVA definitions rather than creating new components. Use compound variants for multi-condition styling, leverage the existing `cn` utility for class merging, and implement all hover/focus transitions with CSS-only animations using the duration/easing tokens from Phase 8.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| class-variance-authority | 0.7.1 | Type-safe component variants | Industry standard for design systems, used by shadcn/ui, minimal bundle size (239B for core) |
| tailwind-merge | 3.4.0 | Intelligent class conflict resolution | Prevents Tailwind class conflicts when combining variant classes with custom overrides |
| clsx | 2.1.1 | Conditional className construction | Tiny (239B) utility for conditional classes, pairs with tailwind-merge in `cn` utility |
| @radix-ui primitives | 1.x-2.x | Accessible component foundations | Already used in project, provides accessible base for Form, Dialog, Select components |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss-animate | 1.0.7 | CSS animation utilities | Already installed, provides GPU-accelerated animation classes |
| react-hook-form | 7.71.1 | Form state management | Already used in project, pairs with Form component validation patterns |
| next-themes | 0.4.6 | Dark mode management | Already installed, handles theme toggle in navigation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CVA | Panda CSS Recipes | More features but higher complexity, CVA sufficient for this project |
| CVA | Vanilla Extract variants | Better type safety but requires build config changes |
| tailwind-merge | Manual conflict resolution | No bundle cost but error-prone, not worth the risk |

**Installation:**
```bash
# All required packages already installed
bun list --depth=0 | grep -E "(cva|tailwind-merge|clsx)"
```

## Architecture Patterns

### Recommended Project Structure
```
components/ui/
├── button.tsx        # Extend with 5 hierarchy variants + 3 sizes
├── card.tsx          # Extend with 4 elevation variants + hover transitions
├── badge.tsx         # Extend with tech stack category variants
├── form.tsx          # Enhance with validation state styling
├── input.tsx         # Add focus ring, error/success border states
├── label.tsx         # Already properly integrated
└── navigation/       # New directory for nav components
    ├── nav.tsx       # Main navigation with sticky/blur
    ├── mobile-menu.tsx  # Hamburger menu with slide animation
    └── theme-toggle.tsx # Dark mode switch
```

### Pattern 1: Extending Existing CVA Definitions
**What:** Add new variants to existing shadcn/ui components without breaking existing usage
**When to use:** For Button, Card, Badge where CVA is already implemented
**Example:**
```typescript
// Source: Existing pattern from components/ui/button.tsx + CVA docs
// https://cva.style/docs/getting-started/variants

// BEFORE (current button.tsx excerpt)
const buttonVariants = cva(
  "base-classes...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// AFTER (Phase 9 extension)
const buttonVariants = cva(
  "base-classes...",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-[var(--duration-base)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-[var(--duration-base)]",
        tertiary: "bg-muted text-muted-foreground hover:bg-muted/80 transition-colors duration-[var(--duration-base)]",
        gradient: "bg-primary text-primary-foreground bg-gradient-to-r from-primary via-tech-blue to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-[background-position] duration-[var(--duration-slow)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-[var(--duration-base)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-12 text-lg", // New for hero CTAs
      },
    },
    defaultVariants: {
      variant: "primary", // Changed from "default" for clarity
      size: "default",
    },
  }
);
```

### Pattern 2: Adding CVA to Non-Variant Components
**What:** Convert components that use direct className props to CVA-based variants
**When to use:** For Card, which currently has no variants
**Example:**
```typescript
// Source: CVA docs + existing card.tsx
// https://cva.style/docs/getting-started/variants

// BEFORE (current card.tsx excerpt)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);

// AFTER (Phase 9 with CVA variants)
const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground transition-all duration-[var(--duration-base)]",
  {
    variants: {
      elevation: {
        flat: "border border-border shadow-none",
        sm: "border border-border shadow-sm",
        md: "border border-border shadow-md",
        lg: "border border-border shadow-lg hover:shadow-xl hover:scale-[1.02]",
      },
    },
    defaultVariants: {
      elevation: "sm",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ elevation, className }))}
      {...props}
    />
  )
);
```

### Pattern 3: Compound Variants for Multi-Condition Styling
**What:** Apply styles when multiple variant conditions are met simultaneously
**When to use:** When a specific variant combination needs unique styling
**Example:**
```typescript
// Source: CVA docs - compound variants
// https://cva.style/docs/getting-started/variants

const buttonVariants = cva(
  "base-classes...",
  {
    variants: {
      variant: { primary: "...", secondary: "..." },
      size: { default: "...", lg: "...", xl: "..." },
      disabled: { true: "opacity-50 cursor-not-allowed" },
    },
    compoundVariants: [
      {
        // Gradient variant with xl size needs extra padding
        variant: "gradient",
        size: "xl",
        class: "px-16", // Override default xl px-12 for visual balance
      },
      {
        // Outline variant needs thicker border at larger sizes
        variant: "outline",
        size: ["lg", "xl"],
        class: "border-2",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);
```

### Pattern 4: CSS-Only Animations with GPU-Accelerated Properties
**What:** Hover and focus transitions using only transform and opacity for performance
**When to use:** All interactive states (hover, focus, active) on all components
**Example:**
```typescript
// Source: Multiple performance resources
// https://tobiasahlin.com/blog/how-to-animate-box-shadow/
// https://www.sitepoint.com/css-box-shadow-animation-performance/

// BAD - Animates box-shadow directly (expensive repaints)
"shadow-sm hover:shadow-lg transition-shadow"

// GOOD - Uses layered shadows with opacity (GPU-accelerated)
const cardVariants = cva(
  "rounded-lg bg-card relative",
  {
    variants: {
      elevation: {
        lg: [
          "border border-border shadow-lg",
          // Layered approach for performant shadow animation
          "before:absolute before:inset-0 before:rounded-lg before:shadow-xl before:opacity-0",
          "before:transition-opacity before:duration-[var(--duration-base)]",
          "hover:before:opacity-100",
          // Scale transform for lift effect (GPU-accelerated)
          "hover:scale-[1.02] transition-transform duration-[var(--duration-base)]",
        ].join(" "),
      },
    },
  }
);
```

### Pattern 5: Form Validation State Management with ARIA
**What:** Accessible form inputs with visual and semantic error/success states
**When to use:** All form inputs that require validation feedback
**Example:**
```typescript
// Source: W3C ARIA techniques + shadcn/ui form patterns
// https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid

// Existing form.tsx already has proper ARIA setup
// Phase 9 adds visual styling variants

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      validationState: {
        default: "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        error: "border-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        success: "border-green-600 dark:border-green-500 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      validationState: "default",
    },
  }
);

// FormControl already sets aria-invalid, just enhance visual styling
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error} // Already properly set
      // Add visual styling based on validation state
      className={inputVariants({
        validationState: error ? "error" : "default"
      })}
      {...props}
    />
  );
});
```

### Pattern 6: Sticky Navigation with Backdrop Blur
**What:** Navigation that stays visible on scroll with frosted glass effect
**When to use:** Primary site navigation for desktop and mobile
**Example:**
```typescript
// Source: MDN backdrop-filter + CodePen examples
// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter
// https://codepen.io/Mamboleoo/pen/qBoqbVm

// Navigation component pattern
<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
  <nav className="container flex h-14 items-center">
    {/* Nav content */}
  </nav>
</header>

// Key techniques:
// 1. bg-background/80 - Semi-transparent background (fallback)
// 2. backdrop-blur-md - Frosted glass effect (12px blur)
// 3. supports-[backdrop-filter]:bg-background/60 - More transparent when blur is supported
// 4. border-border/40 - Subtle border with reduced opacity

// Performance note: backdrop-filter can cause FPS drops on complex pages
// Solution: Use ::before pseudo-element for blur layer
<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/65 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md">
  {/* Content */}
</header>
```

### Pattern 7: Mobile Menu Slide Animation
**What:** Hamburger menu with slide-from-right animation using transform
**When to use:** Mobile navigation (< 768px breakpoint)
**Example:**
```typescript
// Source: Mobile menu animation best practices
// https://blog.bitsrc.io/animate-a-mobile-hamburger-bar-menu-using-css-and-just-a-hint-of-javascript-f31f928eb992
// https://www.kirupa.com/html5/creating_a_smooth_sliding_menu.htm

// Mobile menu with GPU-accelerated slide
const MobileMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={cn(
        // Base styles
        "fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-background border-l border-border",
        // Transform for slide animation (GPU-accelerated)
        "transform transition-transform duration-[var(--duration-base)] ease-smooth",
        // Conditional positioning
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Menu content */}
    </div>
  );
};

// Backdrop overlay
const Backdrop = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm",
        "transition-opacity duration-[var(--duration-base)]",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    />
  );
};

// Performance notes:
// - Use translate3d or translateX (GPU-accelerated)
// - 300ms duration is optimal (fast but not jarring)
// - ease-smooth (cubic-bezier(0.4, 0, 0.2, 1)) for natural motion
```

### Anti-Patterns to Avoid

- **Animating box-shadow directly:** Causes expensive repaints. Use layered shadows with opacity or pseudo-elements instead.
- **Using transition: all:** Not specific enough, can cause unexpected animations and performance issues. Always specify the property.
- **Ad-hoc className overrides instead of variants:** Bypasses type safety and creates inconsistent styling. Always define variants in CVA.
- **Ignoring defaultVariants:** Components without defaults require props on every usage, increasing verbosity and error risk.
- **Mixing CVA with inline conditional classes:** Keep all variant logic in CVA definition, use compoundVariants for multi-condition styling.
- **Not forwarding refs:** Components without forwardRef can't be used with refs, breaking patterns like form field registration.
- **Setting aria-invalid="true" before form submission:** Only set after user interaction or submission attempt to avoid confusing screen reader announcements.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional class names | Manual string concatenation | clsx + tailwind-merge (cn utility) | Handles conflicts, null/undefined, arrays, objects. Already in project. |
| Component variant types | Manual TypeScript unions | VariantProps helper from CVA | Automatically extracts types, stays in sync with variants. |
| Form validation state | Custom error tracking | react-hook-form + shadcn/ui Form | ARIA attributes, error messages, field registration all handled. Already integrated. |
| Dark mode toggle | Custom localStorage/state | next-themes | System preference, persistence, SSR-safe. Already installed. |
| Accessible primitives | Custom focus/keyboard handlers | @radix-ui primitives | WCAG compliant, keyboard navigation, screen reader support. Already used for Dialog, Select, etc. |
| Class conflict resolution | Manual Tailwind specificity | tailwind-merge | Intelligently resolves conflicts (e.g., "px-4 px-6" -> "px-6"). Handles custom theme vars with extendTailwindMerge. |
| Shadow animation | Direct box-shadow transition | Layered shadows with opacity | 2x faster rendering (148ms -> 74ms), smoother animation. |
| Badge color categories | Manual color mapping | CVA variants + semantic tokens | Type-safe, consistent with design system, easy to extend. |

**Key insight:** The shadcn/ui + CVA ecosystem already provides solutions for 90% of component variant needs. Phase 9 is about extending existing patterns, not replacing them.

## Common Pitfalls

### Pitfall 1: Backdrop-Filter Performance on Complex Pages
**What goes wrong:** Using `backdrop-filter: blur()` on sticky navigation causes FPS drops, especially on pages with many elements or complex layouts.
**Why it happens:** Backdrop-filter applies blur to everything behind the element, requiring re-rendering on every scroll event. Chrome has known performance issues with large blur radii.
**How to avoid:**
- Use pseudo-element pattern: `before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md` to isolate blur layer
- Keep blur radius modest (md = 12px, not lg/xl)
- Provide fallback with `supports-[backdrop-filter]` for browsers without support
- Use semi-transparent background as fallback: `bg-background/65`
**Warning signs:** Janky scroll behavior, delayed paint times in DevTools Performance panel, FPS drops below 60fps

### Pitfall 2: CVA Variant Type Mismatches with Omitted Props
**What goes wrong:** TypeScript errors when using components without providing all variant props, even when defaultVariants are defined.
**Why it happens:** VariantProps makes all variants optional by default, but some components need required variants for proper rendering.
**How to avoid:**
- Always define `defaultVariants` in CVA config
- For truly required variants, use TypeScript utility types: `Required<Pick<VariantProps<typeof variants>, "elevation">>`
- Export both the CVA function and VariantProps type separately for flexibility
**Warning signs:** TypeScript errors about missing props, `undefined` prop warnings in console

### Pitfall 3: Gradient Background Animation Not Visible
**What goes wrong:** Gradient button hover effect doesn't animate or looks static despite transition CSS.
**Why it happens:** CSS gradients can't be directly animated. Only `background-position` or `background-size` can transition.
**How to avoid:**
- Use oversized gradient: `bg-[length:200%_100%]` (gradient is 2x wider than button)
- Animate position: `hover:bg-[position:100%_0]` (shifts gradient on hover)
- Use long duration for smooth shimmer: `duration-[var(--duration-slow)]` (500ms)
- Alternative: Use `::before` pseudo-element with opacity transition for more control
**Warning signs:** No visible animation, gradient jumps instead of sliding, inconsistent appearance across browsers

### Pitfall 4: Card Hover Scale Affecting Layout
**What goes wrong:** Card hover scale (1.02x) causes layout shift, pushing adjacent cards or content.
**Why it happens:** Transform doesn't remove element from layout flow by default, scaling increases its footprint.
**How to avoid:**
- Ensure parent container has `overflow: visible` or adequate gap spacing
- Use `isolation: isolate` on card grid to create stacking context
- Consider using transform-origin to control scale direction
- Alternative: Use only shadow transition without scale if layout shift is unavoidable
**Warning signs:** Content jumps on hover, cards push siblings, grid layout breaks

### Pitfall 5: Form Validation States Announced Too Early
**What goes wrong:** Screen readers announce "invalid" before user has interacted with the field, creating confusion.
**Why it happens:** Setting `aria-invalid="true"` on initial render or before submission attempt.
**How to avoid:**
- Only set `aria-invalid` after blur (user leaves field) or submission attempt
- Use `formState.isSubmitted` from react-hook-form to gate validation state
- Provide `FormDescription` for field requirements before showing errors
- Use `role="alert"` on `FormMessage` for dynamic error announcements
**Warning signs:** Screen reader announces errors on page load, users confused about which fields are actually invalid

### Pitfall 6: Mobile Menu Z-Index Conflicts
**What goes wrong:** Mobile menu appears behind other fixed elements (modals, toasts) or doesn't overlay correctly.
**Why it happens:** Z-index without proper stacking context, conflicts with other positioned elements.
**How to avoid:**
- Use consistent z-index scale: backdrop (z-40), menu (z-50), modals (z-50+)
- Create new stacking context with `isolation: isolate` on menu container
- Ensure fixed positioning on both menu and backdrop
- Test with all overlay components open simultaneously
**Warning signs:** Menu behind other elements, backdrop doesn't cover menu, scroll issues with menu open

### Pitfall 7: Tailwind Class Conflicts with Custom Overrides
**What goes wrong:** Passing `className="px-8"` to Button with `size="lg"` (also px-8) doesn't override as expected.
**Why it happens:** Tailwind class order matters, but the `cn` utility (tailwind-merge) resolves conflicts intelligently only if classes are in correct order.
**How to avoid:**
- Always pass custom className last in cn() call: `cn(buttonVariants({ variant, size }), className)`
- Trust tailwind-merge to resolve conflicts (it's already configured correctly)
- For custom theme variables, use `extendTailwindMerge` if conflicts occur
- Document variant props as the primary API, className as escape hatch
**Warning signs:** Styles not applying as expected, !important needed, specificity wars

### Pitfall 8: Compound Variants Not Applying
**What goes wrong:** Styles defined in compoundVariants don't appear when expected conditions are met.
**Why it happens:** Order of variants in compoundVariants array matters, or variant values don't match exactly.
**How to avoid:**
- Ensure variant values match exactly (case-sensitive): `variant: "primary"` not `variant: "Primary"`
- Place more specific compound variants after less specific ones
- Use arrays for matching multiple values: `size: ["lg", "xl"]`
- Test each compound variant combination explicitly
**Warning signs:** Expected styles missing, only base variant styles applied, inconsistent behavior

## Code Examples

Verified patterns from official sources:

### Extending Button with Full Hierarchy
```typescript
// Source: CVA docs + existing button.tsx
// https://cva.style/docs/getting-started/variants

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-[var(--duration-base)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-[var(--duration-base)]",
        tertiary: "bg-muted text-muted-foreground hover:bg-muted/80 transition-colors duration-[var(--duration-base)]",
        gradient: [
          "bg-primary text-primary-foreground",
          "bg-gradient-to-r from-primary via-tech-blue to-primary",
          "bg-[length:200%_100%] bg-[position:0%_0%]",
          "hover:bg-[position:100%_0%]",
          "transition-[background-position] duration-[var(--duration-slow)] ease-smooth",
        ].join(" "),
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-[var(--duration-base)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-12 text-lg",
      },
    },
    compoundVariants: [
      {
        variant: "gradient",
        size: "xl",
        class: "px-16", // Extra padding for visual balance
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Card with Elevation System
```typescript
// Source: CVA docs + Material Design elevation patterns
// https://cva.style/docs/getting-started/variants
// https://compound.thephoenixgroup.com/latest/guidelines/foundations/elevation-lfrFHrLx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground",
  {
    variants: {
      elevation: {
        flat: "border border-border shadow-none",
        sm: "border border-border shadow-sm",
        md: "border border-border shadow-md",
        lg: [
          "border border-border shadow-lg",
          "transition-[transform,box-shadow] duration-[var(--duration-base)] ease-smooth",
          "hover:shadow-xl hover:scale-[1.02]",
        ].join(" "),
      },
    },
    defaultVariants: {
      elevation: "sm",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ elevation, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

// CardHeader, CardTitle, etc. remain unchanged
// ... (existing sub-components)

export { Card, cardVariants };
```

### Badge with Tech Stack Categories
```typescript
// Source: CVA docs + existing badge.tsx
// https://cva.style/docs/getting-started/variants

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground",
        // Tech stack category variants
        frontend: "border-transparent bg-tech-blue/10 text-tech-blue hover:bg-tech-blue/20 dark:bg-tech-blue/20 dark:hover:bg-tech-blue/30",
        backend: "border-transparent bg-corporate-blue/10 text-corporate-blue hover:bg-corporate-blue/20 dark:bg-corporate-blue/20 dark:hover:bg-corporate-blue/30",
        tool: "border-transparent bg-turquoise/10 text-turquoise hover:bg-turquoise/20 dark:bg-turquoise/20 dark:hover:bg-turquoise/30",
        skill: "border-transparent bg-accent/10 text-accent hover:bg-accent/20 dark:bg-accent/20 dark:hover:bg-accent/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

### Input with Validation States
```typescript
// Source: W3C ARIA + existing input.tsx
// https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      validationState: {
        default: "border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        error: "border-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        success: "border-green-600 dark:border-green-500 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      validationState: "default",
    },
  }
);

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validationState, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ validationState, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
```

### Sticky Navigation with Backdrop Blur
```typescript
// Source: MDN backdrop-filter + CodePen examples
// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter
// https://codepen.io/Mamboleoo/pen/qBoqbVm

import * as React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

export function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-[var(--duration-base)]",
        isScrolled
          ? "border-border/40 bg-background/65 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-background"
      )}
    >
      <nav className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-bold text-xl">
          JP Gerton
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <a
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full aria-[current=page]:after:w-full"
              aria-current="page"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/work"
              className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full aria-[current=page]:after:w-full"
            >
              Work
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full aria-[current=page]:after:w-full"
            >
              About
            </a>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
```

### Mobile Menu with Slide Animation
```typescript
// Source: Mobile menu best practices
// https://blog.bitsrc.io/animate-a-mobile-hamburger-bar-menu-using-css-and-just-a-hint-of-javascript-f31f928eb992

import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm",
          "transition-opacity duration-[var(--duration-base)]",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-background border-l border-border",
          "transform transition-transform duration-[var(--duration-base)] ease-smooth",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col p-6 gap-6">
          <a
            href="/"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={onClose}
            aria-current="page"
          >
            Home
          </a>
          <a
            href="/work"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            Work
          </a>
          <a
            href="/about"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            About
          </a>
          <a
            href="/contact"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            Contact
          </a>
        </nav>
      </div>
    </>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Styled Components/Emotion CSS-in-JS | CVA + Tailwind utility classes | 2022-2023 | Faster build times, smaller bundles, better performance |
| Manual variant prop typing | VariantProps helper | CVA 0.5.0 (2022) | Automatic type extraction, always in sync with variants |
| Direct box-shadow animation | Layered shadows with opacity | Ongoing performance research | 2x faster rendering, smoother animations |
| backdrop-filter on main element | Pseudo-element backdrop layer | 2024-2025 | Reduces FPS drops, better scroll performance |
| Primary/Secondary/Tertiary naming | Semantic variant names (filled/outline/ghost) | 2024-2025 | Some teams moving away, but still industry standard |
| Manual dark mode implementation | next-themes with CSS variables | 2023-2024 | SSR-safe, system preference support, automatic persistence |
| Floating form labels | Static labels above inputs | 2024-2025 | Better accessibility, clearer to screen readers |
| Multiple button elevation levels | Flat design with color hierarchy | 2023-2024 | Simpler, more consistent with modern design trends |

**Deprecated/outdated:**
- **tailwind.config.js for Tailwind v4**: Replaced with `@theme` directive in CSS (Phase 8 already completed)
- **clsx({ "class": condition })**: Still works but prefer `cn("base", condition && "conditional")` for readability
- **React.FC type**: React 18+ recommends explicit function declarations with forwardRef for components that need refs
- **variant: "default"**: Prefer more semantic names like "primary" or "filled" for clarity

## Open Questions

Things that couldn't be fully resolved:

1. **Badge Tech Stack Category Colors**
   - What we know: User marked as "Claude's discretion" whether to use colored by category, monochrome, or brand tint
   - What's unclear: Which approach best fits "approachable professional" brand personality
   - Recommendation: Use subtle brand tint approach (primary/secondary/turquoise at 10% opacity backgrounds) to maintain color consistency while providing visual differentiation. More approachable than monochrome, more professional than full saturation.

2. **Button Hierarchy Use Case Mapping**
   - What we know: User specified 5 hierarchy levels (primary/secondary/tertiary/gradient/outline) but left use case mapping to discretion
   - What's unclear: Specific guidelines for when to use each variant
   - Recommendation:
     - primary: Hero CTAs, form submissions, primary actions
     - secondary: Supporting actions, navigation, less critical buttons
     - tertiary: Inline actions, low priority operations
     - gradient: Special emphasis (hero CTAs on landing page only, sparingly)
     - outline: Neutral actions, cancels, toggles

3. **Shadow Elevation Progression Values**
   - What we know: 4 elevation levels (flat/sm/md/lg) needed, Phase 8 provides 5 shadow tokens (xs/sm/md/lg/xl)
   - What's unclear: Whether to use xs/sm/md/lg or sm/md/lg/xl for the 4 card elevations
   - Recommendation: Use none/sm/md/lg (skip xs, reserve xl for lg hover state). Matches "approachable professional" by keeping shadows subtle, not dramatic.

4. **Dark Mode Card Surface Treatment**
   - What we know: User left dark mode card surface colors to discretion
   - What's unclear: Whether to use same background as page (10%) or slightly lighter (12%) for elevation
   - Recommendation: Use 12% (--card already defined in globals.css) for subtle depth without being too contrasty. Matches current token system from Phase 8.

5. **Transition Timing for Different Component Types**
   - What we know: Phase 8 provides fast/base/slow duration tokens (150ms/300ms/500ms)
   - What's unclear: Which duration for which component type
   - Recommendation:
     - fast (150ms): Hover state changes, focus rings
     - base (300ms): Button clicks, card hovers, most interactions
     - slow (500ms): Gradient shifts, page transitions, dramatic effects
     - Reasoning: Matches industry standards from research (300ms optimal for most UI)

## Sources

### Primary (HIGH confidence)
- [CVA Official Docs](https://cva.style/docs) - Complete API reference and patterns
- [CVA Variants Guide](https://cva.style/docs/getting-started/variants) - Variant syntax and compound variants
- [CVA TypeScript Guide](https://cva.style/docs/getting-started/typescript) - VariantProps helper and type safety
- [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) - Browser support and usage
- [W3C ARIA21 Technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21) - aria-invalid for form validation
- [MDN aria-errormessage](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-errormessage) - Accessible error messages
- Existing project files: button.tsx, card.tsx, badge.tsx, form.tsx, input.tsx (CVA patterns already in use)

### Secondary (MEDIUM confidence)
- [Carbon Design System - Button Usage](https://carbondesignsystem.com/components/button/usage/) - Button hierarchy patterns
- [Compound Design System - Elevation](https://compound.thephoenixgroup.com/latest/guidelines/foundations/elevation-lfrFHrLx) - Elevation token patterns
- [Reshaped - Shadow Tokens](https://www.reshaped.so/docs/tokens/shadow) - Shadow design token approach
- [Smashing Magazine - Accessible Form Validation](https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/) - Form validation best practices
- [Tobias Ahlin - Animate Box Shadow Performance](https://tobiasahlin.com/blog/how-to-animate-box-shadow/) - Layered shadow technique
- [CodePen - Smooth Backdrop Filter Navigation](https://codepen.io/Mamboleoo/pen/qBoqbVm) - Sticky nav pattern
- [shadcn/ui Manual Installation](https://ui.shadcn.com/docs/installation/manual) - cn utility function pattern

### Tertiary (LOW confidence)
- [Medium - React Component Reusability: CVA](https://medium.com/@tushar_chavan/react-component-reusability-class-variance-authority-cva-5e7e98d61194) - General CVA overview
- [Kirupa - Creating Smooth Sliding Menu](https://www.kirupa.com/html5/creating_a_smooth_sliding_menu.htm) - Mobile menu animation tutorial
- [Cieden - Button Hierarchy Guide](https://cieden.com/book/atoms/button/how-to-create-button-hierarchy) - Design system button patterns
- [LogRocket - Types of Buttons in UI Design](https://blog.logrocket.com/ux-design/types-of-buttons-in-ui-design/) - Button type taxonomy
- [Slider Revolution - CSS Hamburger Menus](https://www.sliderrevolution.com/resources/css-hamburger-menu/) - Hamburger menu patterns
- WebSearch results for gradient shimmer effects, mobile menu animations (community patterns)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - CVA 0.7.1 already installed and in use, shadcn/ui patterns verified in codebase
- Architecture: HIGH - Patterns extracted from existing components (button.tsx, form.tsx) and official CVA docs
- Pitfalls: MEDIUM - Based on WebSearch results and common issues, not all verified in official docs
- Code examples: HIGH - Based on existing project patterns, official CVA docs, and W3C ARIA specs

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable ecosystem, CVA is mature library)

**Research scope notes:**
- CONTEXT.md locked in 5 button hierarchy levels, 4 card elevations, specific gradient/blur behaviors
- Claude's discretion areas: button use case mapping, shadow values, dark mode treatment, badge styling
- All alternatives to CVA (Panda CSS, Vanilla Extract) rejected due to existing CVA implementation
- CSS-only animations requirement from Phase 8 constraints guides all transition patterns
- Deferred ideas: None specified, stayed within component variant system scope
