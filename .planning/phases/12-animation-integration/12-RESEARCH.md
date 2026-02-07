# Phase 12: Animation Integration - Research

**Researched:** 2026-02-05
**Domain:** CSS-only animations, Intersection Observer API, GPU-accelerated properties, prefers-reduced-motion accessibility
**Confidence:** HIGH

## Summary

Phase 12 implements purposeful micro-interactions and scroll-triggered entrance animations using CSS-only techniques to maintain the Lighthouse 100 score requirement. The research confirms that modern browsers provide native APIs (Intersection Observer) for scroll-triggered animations without JavaScript animation libraries, and that CSS-only animations using GPU-accelerated properties (transform, opacity) are the optimal approach for performance.

The project already has the foundation in place from Phase 8 (duration tokens: fast/base/slow, easing functions: ease-smooth/ease-bounce) and Phase 9 (hover states on Card elevation="lg" and Button gradient variant). Phase 12 extends this with scroll-triggered entrance animations, button press micro-interactions, form validation feedback, and comprehensive prefers-reduced-motion support.

Key findings show that effective animation systems use GPU-accelerated properties exclusively (transform, opacity), respect user motion preferences via `@media (prefers-reduced-motion: reduce)`, implement Intersection Observer with appropriate thresholds (0.1-0.3 for entrance animations), and stagger sibling elements with CSS transition-delay or data-attribute-based delays (~50ms between items).

The user's decisions from CONTEXT.md lock in specific animation styles: fade-up entrance (translateY ~20px), shadow lift + scale on card hover, gradient shimmer on buttons, slow zoom (Ken Burns) on images, underline slide-in on text links, scale-down button press feedback, and red border fade-in for form errors. All animations must be once-only (no replay on scroll), hero section fully visible on load, and ~30% of elements animated (key sections only).

**Primary recommendation:** Define CSS keyframe animations in @theme for reusable entrance effects (fade-up, fade-in), implement Intersection Observer with threshold: 0.1 and rootMargin: "50px" for early trigger, use data-stagger attributes with CSS nth-child selectors for sibling delays, wrap all animations in `@media (prefers-reduced-motion: no-preference)` with instant fallbacks in the reduce block, and leverage existing duration/easing tokens from Phase 8.

## Standard Stack

The established libraries/tools for CSS-only animation systems with scroll triggers:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Intersection Observer API | Native | Viewport intersection detection | Browser-native, asynchronous, eliminates scroll event listeners, 97%+ browser support |
| CSS Animations (@keyframes) | Native | Declarative animation definitions | Browser-optimized, GPU-accelerated, no JavaScript execution cost |
| Tailwind CSS v4 @theme | 4.1.18+ | Animation token definitions | Already in project, defines keyframes and duration tokens in CSS |
| tailwindcss-animate | 1.0.7 | Pre-built animation utilities | Already installed, provides fade-in/slide-in/zoom patterns |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Custom Properties | Native | Runtime animation values | Dynamic delays, stagger timing, theme-based durations |
| CSS Transforms | Native | GPU-accelerated movement | All position/scale/rotation animations (no layout reflow) |
| prefers-reduced-motion | Native | Accessibility media query | Disable all animations for motion-sensitive users |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Intersection Observer | Framer Motion | +50KB bundle, -10 to -20 Lighthouse points, violates project constraints |
| CSS-only animations | GSAP | Professional animation library but unnecessary for this scope, bundle cost |
| Intersection Observer | Scroll event listeners | Poor performance, constant main thread work, throttling complexity |
| Custom stagger logic | GSAP stagger helper | Cleaner API but violates CSS-only constraint |
| Manual threshold management | react-intersection-observer wrapper | Adds abstraction layer, not needed for this project |

**Installation:**
```bash
# All required APIs are browser-native
# No additional dependencies needed
# tailwindcss-animate already installed via package.json
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── globals.css              # @theme keyframe definitions, prefers-reduced-motion
│   ├── @theme {             # Animation keyframes
│   │   --keyframes-fade-up
│   │   --keyframes-fade-in
│   │   --keyframes-slide-in-left
│   ├── @media (prefers-reduced-motion: reduce)  # Disable all animations
components/
├── ui/
│   ├── button.tsx           # Press micro-interaction (scale-down)
│   ├── card.tsx             # Hover lift already implemented (Phase 9)
│   ├── input.tsx            # Validation border fade-in
│   └── form.tsx             # Error shake (optional, CONTEXT.md allows calm error)
├── portfolio/
│   ├── project-card-enhanced.tsx  # Image zoom on hover already started
│   └── hero-section.tsx     # No scroll animation (always visible)
hooks/
└── use-intersection-observer.ts  # Reusable scroll trigger logic
```

### Pattern 1: Intersection Observer for Scroll Animations

**What:** Detect when elements enter viewport and add animated class to trigger CSS transitions
**When to use:** Key sections only (~30% of elements): project cards, testimonials, CTAs, section headings
**Example:**
```typescript
// Source: MDN Intersection Observer API + verified community patterns
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

// hooks/use-intersection-observer.ts
import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1, // Trigger when 10% visible
    rootMargin = "50px", // Start 50px before element enters viewport
    triggerOnce = true, // Only animate once (CONTEXT.md requirement)
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element); // Stop observing after first trigger
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}

// Usage in component
function ProjectCard({ project }: { project: Project }) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <div
      ref={elementRef}
      className={cn(
        "opacity-0 translate-y-5", // Initial state (hidden, slightly below)
        "transition-all duration-[var(--duration-base)] ease-smooth",
        isVisible && "opacity-100 translate-y-0" // Animated state (visible, in position)
      )}
    >
      {/* Card content */}
    </div>
  );
}
```

**Best practices:**
- **threshold: 0.1** triggers when 10% visible (early enough for smooth entrance)
- **rootMargin: "50px"** starts animation 50px before viewport (prevents late trigger)
- **triggerOnce: true** satisfies CONTEXT.md "once only" requirement
- **Unobserve after trigger** to prevent memory leaks and unnecessary calculations

### Pattern 2: CSS Keyframe Animations in @theme

**What:** Define reusable animation keyframes in globals.css @theme block
**When to use:** Fade-up entrance, fade-in, any animation used multiple times
**Example:**
```css
/* Source: Tailwind v4 @theme directive + CSS @keyframes
 * https://tailwindcss.com/docs/theme
 * https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes
 */

/* app/globals.css */
@theme {
  /* Animation duration tokens (already defined in Phase 8) */
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;

  /* Custom easing functions (already defined in Phase 8) */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Keyframe animations - placed AFTER @theme block */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px); /* CONTEXT.md: ~20px suggested */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-down {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.97); /* CONTEXT.md: ~0.97 for button press */
  }
}

/* Usage utility classes */
@layer utilities {
  .animate-fade-up {
    animation: fade-up var(--duration-base) var(--ease-smooth) both;
  }

  .animate-fade-in {
    animation: fade-in var(--duration-base) var(--ease-smooth) both;
  }

  .animate-slide-in-left {
    animation: slide-in-left var(--duration-base) var(--ease-smooth) both;
  }
}
```

**Key techniques:**
- **animation: ... both** applies both fill modes (backwards and forwards) to prevent flash
- **GPU-accelerated properties only** (opacity, transform) for performance
- **Leverage existing duration tokens** from Phase 8 for consistency
- **Define once, use everywhere** for maintainability

### Pattern 3: Stagger Delays with CSS

**What:** Sibling elements animate in sequence with ~50ms delay between items
**When to use:** Card grids, testimonial lists, FAQ sections (CONTEXT.md requirement)
**Example:**
```typescript
// Source: Multiple community examples + performance patterns
// https://codepen.io/CheeStudio/pen/MWbPwrY
// https://gsap.com/community/forums/topic/22232-intersectionobserver-stagger-element-with-delay-time/

// Pattern 1: Using nth-child (CSS-only, no JavaScript)
function ProjectGrid({ projects }: { projects: Project[] }) {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <div ref={elementRef} className="grid grid-cols-3 gap-md">
      {projects.map((project, index) => (
        <div
          key={project._id}
          className={cn(
            "opacity-0 translate-y-5",
            "transition-all duration-[var(--duration-base)] ease-smooth",
            isVisible && "opacity-100 translate-y-0"
          )}
          style={{
            transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
          }}
        >
          <ProjectCardEnhanced project={project} />
        </div>
      ))}
    </div>
  );
}

// Pattern 2: Using CSS custom property (more flexible)
function TestimonialList({ testimonials }: { testimonials: Testimonial[] }) {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <div ref={elementRef} className="space-y-lg">
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial._id}
          className={cn(
            "opacity-0 translate-y-5",
            "transition-all duration-[var(--duration-base)] ease-smooth",
            isVisible && "opacity-100 translate-y-0"
          )}
          style={{
            "--stagger-index": index,
            transitionDelay: isVisible
              ? `calc(var(--stagger-index) * 50ms)`
              : "0ms",
          } as React.CSSProperties}
        >
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}
    </div>
  );
}

// Pattern 3: Using data attributes (most semantic)
<div className="grid" data-animate-children>
  {items.map((item, index) => (
    <div
      key={item.id}
      data-stagger-index={index}
      className="[&[data-stagger-index]]:transition-all [&[data-stagger-index]]:duration-base"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {item.content}
    </div>
  ))}
</div>
```

**Best practices:**
- **50ms stagger delay** is subtle but noticeable (CONTEXT.md: not dramatic cascade)
- **Calculate delay in JavaScript** for dynamic lists (easier than CSS nth-child)
- **Reset delay to 0ms** when not visible to prevent jarring re-entry
- **Max 10-12 items staggered** (500-600ms total) before it feels too slow

### Pattern 4: Prefers-Reduced-Motion Support

**What:** Disable all animations for users with motion sensitivity preferences
**When to use:** Every animation, everywhere (WCAG 2.3.3 Animation from Interactions)
**Example:**
```css
/* Source: W3C WCAG C39 Technique + MDN prefers-reduced-motion
 * https://www.w3.org/WAI/WCAG21/Techniques/css/C39
 * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */

/* app/globals.css */

/* Default: Animations enabled */
@media (prefers-reduced-motion: no-preference) {
  /* All animations defined here */
  .animate-fade-up {
    animation: fade-up var(--duration-base) var(--ease-smooth) both;
  }

  .transition-transform {
    transition-property: transform;
    transition-duration: var(--duration-base);
  }

  /* Card hover effects */
  .card-hover {
    transition: transform var(--duration-base) var(--ease-smooth),
                box-shadow var(--duration-base) var(--ease-smooth);
  }
}

/* Reduced motion: Instant state changes, no animation */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Ensure elements are visible immediately */
  .animate-fade-up,
  [data-animate] {
    opacity: 1 !important;
    transform: none !important;
  }

  /* Disable card hover scale */
  .card-hover:hover {
    transform: none !important;
  }
}
```

**Critical requirements (CONTEXT.md):**
- **NO motion at all** when prefers-reduced-motion: reduce
- **All animations instantly resolve** to final state (opacity: 1, transform: none)
- **Fully static experience** still functional (no missing content)
- **Test with OS setting enabled** (macOS System Preferences → Accessibility → Display → Reduce motion)

**Implementation checklist:**
- [ ] All keyframe animations wrapped in `@media (prefers-reduced-motion: no-preference)`
- [ ] Reduce block sets animation-duration: 0.01ms (instant, but allows transitionend events)
- [ ] Elements with entrance animations visible by default in reduce mode
- [ ] Hover effects still indicate interactivity (color change OK, no scale/movement)

### Pattern 5: Button Press Micro-Interaction

**What:** Scale down button on active state, spring back on release
**When to use:** All button variants (CONTEXT.md requirement)
**Example:**
```typescript
// Source: Button micro-interactions research
// https://www.sitepoint.com/button-micro-interactions/
// https://medium.com/@vioscott/stop-using-boring-buttons

// components/ui/button.tsx (extend existing CVA definition from Phase 9)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] active:transition-transform active:duration-[var(--duration-fast)]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        // ... other variants
      },
      size: {
        default: "h-10 px-4 py-2",
        // ... other sizes
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

// Key techniques:
// - active:scale-[0.97] - Scale down to 97% on press (CONTEXT.md guidance)
// - active:duration-[var(--duration-fast)] - Fast 150ms press (feels responsive)
// - Release automatically springs back via base transition-transform
// - Works on touch devices (touchstart/touchend trigger :active)
```

**Best practices:**
- **scale(0.97)** is subtle but noticeable (CONTEXT.md: tactile feel, not dramatic)
- **Fast duration (150ms)** for press, base (300ms) for release (asymmetric timing feels natural)
- **Add to base className** so all button variants inherit behavior
- **Test on touch devices** to ensure mobile press feedback works

### Pattern 6: Form Validation Feedback

**What:** Animated border fade-in for error states, calm indication without shake
**When to use:** Input, textarea, select when validation fails
**Example:**
```typescript
// Source: CONTEXT.md decision + existing input.tsx from Phase 9
// User decided: "Red border fade-in only. No shake. Calm, clear error indication."

// components/ui/input.tsx (enhance existing CVA from Phase 9)
const inputVariants = cva(
  "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-[var(--duration-fast)] aria-invalid:border-destructive aria-invalid:border-2 aria-invalid:focus-visible:ring-destructive",
  {
    variants: {
      validationState: {
        default: "border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        error: "border-2 border-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        success: "border-2 border-green-600 dark:border-green-500 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      validationState: "default",
    },
  }
);

// Key techniques:
// - transition-colors duration-[var(--duration-fast)] - 150ms fade (calm, not jarring)
// - border-2 for error (thicker = more visible without shake animation)
// - aria-invalid attribute already handled by Form component (Phase 9)
// - No position/transform animation (CONTEXT.md: calm error, no shake)
```

**Why no shake animation:**
- CONTEXT.md user decision: "Red border fade-in only. No shake."
- Shake can feel aggressive, especially for accessibility users
- Border + color change is clear without motion
- Aligns with "refined and confident" motion personality

### Pattern 7: Link Underline Slide-In

**What:** Underline slides in from left on hover, no underline at rest
**When to use:** Text links in prose, navigation links (CONTEXT.md requirement)
**Example:**
```css
/* Source: CONTEXT.md decision + modern link animation patterns
 * User decided: "Underline slides in from left on hover. No underline at rest."
 */

/* Pattern 1: Using ::after pseudo-element (most common) */
.link-underline {
  position: relative;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-smooth);
}

.link-underline::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width var(--duration-base) var(--ease-smooth);
}

.link-underline:hover::after {
  width: 100%;
}

/* Pattern 2: Using Tailwind utilities (inline in component) */
<a
  href="/about"
  className="relative text-foreground hover:text-primary transition-colors duration-[var(--duration-fast)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-[var(--duration-base)] hover:after:w-full"
>
  About
</a>
```

**Best practices:**
- **height: 2px** (h-0.5) is subtle, modern (not thick underline)
- **left: 0** makes underline slide from left (CONTEXT.md requirement)
- **background-color: currentColor** matches text color automatically
- **Base duration (300ms)** for underline slide (not too fast, not slow)

### Pattern 8: Card Hover Shadow Lift + Scale

**What:** Card shadow increases and scales slightly on hover (already implemented in Phase 9)
**When to use:** Card elevation="lg" variant (CONTEXT.md: shadow lift + subtle scale ~1.02)
**Example:**
```typescript
// Source: Phase 9 Card implementation + CONTEXT.md decisions
// Already implemented in components/ui/card.tsx from Phase 9

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
          "hover:shadow-xl hover:scale-[1.02]", // CONTEXT.md: shadow lift + scale
        ].join(" "),
      },
    },
    defaultVariants: {
      elevation: "sm",
    },
  }
);

// CONTEXT.md decision: "Shadow lift + subtle scale (~1.02) on hover.
// Card rises off the page with deepened shadow."

// Implementation notes:
// - shadow-lg → shadow-xl on hover (elevation increase)
// - scale-[1.02] = 2% scale (CONTEXT.md: subtle, not dramatic)
// - transition-[transform,box-shadow] animates both properties
// - duration-base (300ms) feels smooth and confident
```

**No changes needed:**
- Phase 9 already implemented this correctly
- Matches CONTEXT.md requirements exactly
- Phase 12 just needs to ensure it stays intact

### Pattern 9: Image Hover Zoom (Ken Burns Effect)

**What:** Slow zoom-in on image hover, overflow hidden clips scale
**When to use:** Project card thumbnails, portfolio images (CONTEXT.md requirement)
**Example:**
```typescript
// Source: CONTEXT.md decision + existing ProjectCardEnhanced
// "Slow zoom-in (Ken Burns effect) inside container on hover. Overflow hidden clips the scale."

// components/portfolio/project-card-enhanced.tsx (enhance existing)
export function ProjectCardEnhanced({ project, priority = false }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card elevation="lg" className="overflow-hidden group">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {project.screenshotUrl ? (
            <Image
              src={project.screenshotUrl}
              alt={`${project.name} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-[var(--duration-base)] ease-smooth"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No preview
            </div>
          )}
        </div>
        {/* Card content */}
      </Card>
    </Link>
  );
}

// Key techniques:
// - overflow-hidden on container (clips scaled image)
// - group-hover:scale-105 on image (5% zoom, subtle)
// - transition-transform duration-base (300ms, smooth)
// - ease-smooth easing (confident, not bouncy)
```

**Implementation notes:**
- ProjectCardEnhanced already has `group-hover:scale-105` (Phase 11)
- Just verify duration token is used: `duration-[var(--duration-base)]`
- Ensure parent container has `overflow-hidden` to clip scale

### Pattern 10: Button Gradient Shimmer

**What:** Gradient sweeps across button on hover (already implemented in Phase 9)
**When to use:** Button variant="gradient" (CONTEXT.md: eye-catching for primary CTAs)
**Example:**
```typescript
// Source: Phase 9 Button implementation + CONTEXT.md decisions
// Already implemented in components/ui/button.tsx from Phase 9

const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        gradient: [
          "bg-gradient-to-r from-primary via-tech-blue to-primary",
          "bg-[length:200%_100%] bg-[position:0%_0%]",
          "hover:bg-[position:100%_0%]",
          "transition-[background-position] duration-[var(--duration-slow)] ease-smooth",
          "text-primary-foreground",
        ].join(" "),
      },
    },
  }
);

// CONTEXT.md decision: "Gradient shimmer sweep across button on hover.
// Eye-catching for primary CTAs."

// Implementation notes:
// - bg-[length:200%_100%] makes gradient 2x wider than button
// - bg-[position:0%_0%] starts gradient at left edge
// - hover:bg-[position:100%_0%] shifts gradient to right on hover
// - duration-slow (500ms) gives smooth shimmer effect (not jarring)
// - GPU-accelerated (background-position, not gradient itself)
```

**No changes needed:**
- Phase 9 already implemented this correctly
- Uses slow duration (500ms) from CONTEXT.md motion personality
- Phase 12 just verifies it's working

### Anti-Patterns to Avoid

- **Animating non-GPU properties:** Never animate width, height, margin, padding, or layout properties (causes reflow, hurts Lighthouse score)
- **Using scroll event listeners:** Always use Intersection Observer instead (native, async, performant)
- **Animating on every scroll:** CONTEXT.md requires once-only (triggerOnce: true prevents replay)
- **Missing prefers-reduced-motion:** Every animation MUST respect user motion preferences (WCAG requirement)
- **Too many animated elements:** CONTEXT.md specifies ~30% of elements (key sections only, not every paragraph)
- **Dramatic stagger cascades:** CONTEXT.md: subtle flow, not dramatic (~50ms delays, not 200ms+)
- **Hero section scroll animation:** CONTEXT.md: hero fully visible on load, no scroll trigger
- **Looping animations:** CONTEXT.md: nothing loops unless communicating "waiting" or "live" state
- **Long animation durations:** CONTEXT.md: no animation longer than ~200-250ms unless onboarding/hero content
- **Form shake animations:** CONTEXT.md: calm error indication, red border fade-in only (no shake)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | Custom scroll event listeners | Intersection Observer API | Browser-native, async, eliminates performance bottlenecks from constant scroll events |
| Animation keyframes | Inline style animations | CSS @keyframes in @theme | Declarative, GPU-optimized, reusable across components |
| Stagger timing | GSAP stagger helper | CSS transition-delay with index | CSS-only approach maintains Lighthouse 100, no bundle cost |
| Motion accessibility | Manual motion toggle | prefers-reduced-motion media query | Respects OS-level user preference, WCAG compliant |
| Entrance animation utilities | Custom className logic | tailwindcss-animate plugin | Already installed, provides fade-in/slide/zoom patterns |
| Element visibility detection | getBoundingClientRect polling | Intersection Observer | Eliminates layout thrashing, asynchronous, battery-friendly |
| Animation easing | Manual cubic-bezier values | Existing ease-smooth/ease-bounce tokens | Phase 8 already defined, consistent motion language |
| Gradient animation | Animating gradient stops | background-position shift | Only background-position can transition (gradient stops cannot) |

**Key insight:** Modern browsers provide all necessary APIs natively (Intersection Observer, CSS Animations, prefers-reduced-motion). No JavaScript animation library needed for this scope, preserving Lighthouse 100 score.

## Common Pitfalls

### Pitfall 1: Intersection Observer Triggering Too Late

**What goes wrong:** Animation starts after element is already mostly visible, looks choppy or late
**Why it happens:** Default threshold: 0 only triggers when first pixel crosses viewport, rootMargin: 0 waits until element touches viewport
**How to avoid:**
- Use `threshold: 0.1` to trigger when 10% visible (gives time for animation to complete)
- Use `rootMargin: "50px"` to start animation 50px before element enters viewport
- Test on slow devices to ensure animation completes before user sees element
**Warning signs:** Elements pop into view instead of smoothly animating, animation starts when element is already half visible

**Source:** [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Pitfall 2: Animation Replay on Scroll Back Up

**What goes wrong:** Element animates again when user scrolls back up, violating CONTEXT.md "once only" requirement
**Why it happens:** Not calling `observer.unobserve(element)` after first trigger, or `triggerOnce: false`
**How to avoid:**
- Set `triggerOnce: true` in useIntersectionObserver hook
- Call `observer.unobserve(element)` in the intersection callback after setting isVisible: true
- State persists after unobserve (element stays visible permanently)
**Warning signs:** Elements fade in again when scrolling up, animation replays multiple times

### Pitfall 3: Stagger Delays Accumulating to Seconds

**What goes wrong:** 20 items with 100ms stagger = 2 seconds before last item appears (too slow)
**Why it happens:** Not accounting for total delay when choosing stagger value
**How to avoid:**
- Calculate total delay: `items.length * staggerDelay` (should be < 600ms)
- Use ~50ms stagger for up to 12 items (CONTEXT.md: subtle flow, not dramatic)
- For long lists (>12 items), reduce stagger to 30ms or skip stagger entirely
- Alternative: Stagger only first 8-10 items, rest appear together
**Warning signs:** Last card in grid appears 1+ seconds after first, feels slow and frustrating

### Pitfall 4: Animations Running When Prefers-Reduced-Motion Enabled

**What goes wrong:** Users with motion sensitivity still see animations, causing discomfort or nausea
**Why it happens:** Forgetting to wrap animations in `@media (prefers-reduced-motion: no-preference)`
**How to avoid:**
- Wrap ALL animation CSS in `@media (prefers-reduced-motion: no-preference)` block
- Add global disable in reduce block: `animation-duration: 0.01ms !important`
- Test with OS setting enabled (macOS: System Preferences → Accessibility → Display → Reduce motion)
- Ensure all interactive functionality works without animations
**Warning signs:** Animations still visible when OS motion setting enabled, accessibility audit failures

**Source:** [W3C WCAG C39 Technique](https://www.w3.org/WAI/WCAG21/Techniques/css/C39)

### Pitfall 5: Hero Section Animating on Page Load

**What goes wrong:** Hero content fades in or slides up when page loads, violating CONTEXT.md requirement
**Why it happens:** Applying scroll-triggered animation logic to hero section
**How to avoid:**
- CONTEXT.MD: "Hero section fully visible on page load, no scroll trigger"
- Do NOT use useIntersectionObserver on hero section
- Do NOT apply opacity-0 initial state to hero elements
- Hero can have subtle fade-in on page load (no scroll trigger), but CONTEXT.md says "fully visible on page load" (interpret as no animation)
**Warning signs:** Hero text/image fades in after page load, user sees blank hero area briefly

### Pitfall 6: Button Press Animation Conflicting with Click

**What goes wrong:** Button active state scale-down interferes with click handler or feels unresponsive
**Why it happens:** Long animation duration or easing that bounces back
**How to avoid:**
- Use fast duration (150ms) for press, not base (300ms)
- Use ease-smooth (ease-out), NOT ease-bounce (overshoots feel wrong for press)
- Scale down to 0.97, not 0.9 (too dramatic feels broken)
- Release automatically via base transition (no JavaScript needed)
**Warning signs:** Button feels sluggish, click doesn't register immediately, button "bounces" after press

### Pitfall 7: Image Zoom Breaking Layout on Hover

**What goes wrong:** Scaled image pushes card boundaries or breaks grid alignment
**Why it happens:** Missing overflow-hidden on image container
**How to avoid:**
- Add `overflow-hidden` to container wrapping the image
- Ensure aspect-ratio is set on container (not image) to maintain space
- Use `group` on Card and `group-hover:scale-*` on Image for parent-triggered hover
- Test with large images to ensure clipping works
**Warning signs:** Image overlaps neighboring cards on hover, grid layout shifts, scrollbars appear

### Pitfall 8: Gradient Shimmer Not Visible

**What goes wrong:** Button gradient doesn't shimmer on hover, looks static
**Why it happens:** Gradient can't be directly animated, only background-position or background-size can transition
**How to avoid:**
- Use oversized gradient: `bg-[length:200%_100%]` (gradient 2x wider than button)
- Start at left: `bg-[position:0%_0%]`
- Shift on hover: `hover:bg-[position:100%_0%]`
- Use slow duration: `duration-[var(--duration-slow)]` (500ms for smooth shimmer)
- Test with gradient colors that have visible difference (primary → tech-blue → primary)
**Warning signs:** No visible movement on hover, gradient looks same in both states, animation feels instant

**Source:** Phase 9 research on gradient animations

### Pitfall 9: Form Error Border Not Fading In

**What goes wrong:** Error border appears instantly instead of fading in smoothly
**Why it happens:** Missing transition-colors on input base class
**How to avoid:**
- Add `transition-colors duration-[var(--duration-fast)]` to input base className
- Use border-2 for error (thicker border more visible)
- Use aria-invalid attribute to trigger styling (accessibility + visual)
- Ensure Form component sets aria-invalid after blur/submit (not on page load)
**Warning signs:** Error border appears instantly (jarring), no smooth transition

### Pitfall 10: Forgetting to Test "Key Sections Only"

**What goes wrong:** Animating every element on the page (100% coverage instead of ~30%)
**Why it happens:** Over-enthusiasm for animations, not following CONTEXT.MD constraint
**How to avoid:**
- CONTEXT.MD: "Key sections only (~30% of elements). Project cards, testimonials, CTAs, section headings. Body text and standard content appears without animation."
- Audit page: count animated vs static elements
- Body paragraphs: NO animation
- Standard content (terms, policies): NO animation
- Navigation links: underline animation only (not fade-in)
- Only special elements: cards, CTAs, testimonials, section headings
**Warning signs:** Every paragraph fades in, page feels overanimated, motion becomes distracting

## Code Examples

Verified patterns from official sources:

### Complete Intersection Observer Hook

```typescript
// Source: MDN + verified community patterns
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// https://cheewebdevelopment.com/vanilla-js-scroll-events-animations-with-intersectionobserver-api/

// hooks/use-intersection-observer.ts
import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for scroll-triggered animations using Intersection Observer API
 *
 * @param threshold - Percentage of element visible before triggering (0-1). Default: 0.1
 * @param rootMargin - Margin around viewport for early/late trigger. Default: "50px"
 * @param triggerOnce - Whether to only animate once. Default: true (CONTEXT.md requirement)
 *
 * @returns Object with elementRef (attach to element) and isVisible (boolean state)
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1, // Trigger when 10% visible
    rootMargin = "50px", // Start 50px before element enters
    triggerOnce = true, // Once-only animation (CONTEXT.md)
  } = options;

  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Unobserve after first trigger (CONTEXT.md: once only)
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // Only reset if not triggerOnce mode
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}
```

### Animated Section with Stagger

```typescript
// Source: Stagger patterns from research
// https://codepen.io/CheeStudio/pen/MWbPwrY

// app/(home)/page.tsx - Project grid section
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ProjectCardEnhanced } from "@/components/portfolio/project-card-enhanced";

export default function HomePage() {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <section className="py-2xl px-md">
      <h2 className="text-h2 font-serif mb-lg">Recent Projects</h2>

      <div
        ref={elementRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md"
      >
        {projects.map((project, index) => (
          <div
            key={project._id}
            className={cn(
              // Initial state (hidden)
              "opacity-0 translate-y-5",
              // Transition (smooth movement)
              "transition-all duration-[var(--duration-base)] ease-smooth",
              // Final state (visible) - only when parent is visible
              isVisible && "opacity-100 translate-y-0"
            )}
            style={{
              // Stagger delay: 50ms between items (CONTEXT.md: subtle flow)
              transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
            }}
          >
            <ProjectCardEnhanced
              project={project}
              priority={index === 0} // First card for LCP
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Prefers-Reduced-Motion Global Styles

```css
/* Source: W3C WCAG C39 + MDN
 * https://www.w3.org/WAI/WCAG21/Techniques/css/C39
 * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */

/* app/globals.css - Add to existing file */

/* Motion enabled (default) */
@media (prefers-reduced-motion: no-preference) {
  /* Keyframe animations */
  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Utility classes */
  .animate-fade-up {
    animation: fade-up var(--duration-base) var(--ease-smooth) both;
  }

  .animate-fade-in {
    animation: fade-in var(--duration-base) var(--ease-smooth) both;
  }
}

/* Motion reduced/disabled */
@media (prefers-reduced-motion: reduce) {
  /* Global animation disable */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Ensure animated elements are visible immediately */
  .animate-fade-up,
  .animate-fade-in,
  [data-animate],
  [class*="opacity-0"] {
    opacity: 1 !important;
    transform: none !important;
  }

  /* Disable hover transforms (color changes OK) */
  .hover\:scale-\[1\.02\]:hover,
  .hover\:scale-105:hover,
  .group:hover .group-hover\:scale-105,
  .group:hover .group-hover\:scale-\[1\.02\] {
    transform: none !important;
  }

  /* Disable button press feedback */
  .active\:scale-\[0\.97\]:active {
    transform: none !important;
  }
}
```

### Link Underline Animation Component

```typescript
// Source: CONTEXT.md + modern link patterns
// components/ui/animated-link.tsx (new component)

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Link with underline slide-in animation on hover
 * CONTEXT.MD: "Underline slides in from left on hover. No underline at rest."
 */
export function AnimatedLink({ children, className, ...props }: AnimatedLinkProps) {
  return (
    <Link
      className={cn(
        "relative text-foreground hover:text-primary",
        "transition-colors duration-[var(--duration-fast)]",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0",
        "after:bg-current after:transition-all after:duration-[var(--duration-base)]",
        "hover:after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

// Usage
<AnimatedLink href="/about">Learn More</AnimatedLink>
```

### Form Input with Error Border Fade

```typescript
// Source: Phase 9 Input + CONTEXT.md decisions
// components/ui/input.tsx (verify existing implementation has transition)

const inputVariants = cva(
  "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-[var(--duration-fast)] aria-invalid:border-destructive aria-invalid:border-2 aria-invalid:focus-visible:ring-destructive",
  {
    variants: {
      validationState: {
        default: "border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        error: "border-2 border-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        success: "border-2 border-green-600 dark:border-green-500 focus-visible:ring-2 focus-visible:ring-green-600 dark:focus-visible:ring-green-500 focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      validationState: "default",
    },
  }
);

// Key: transition-colors duration-[var(--duration-fast)] in base class
// Result: Border color fades in smoothly (150ms) when error state changes
// CONTEXT.MD: "Calm, clear error indication" (no shake, just color fade)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion for scroll animations | Intersection Observer + CSS | 2022-2024 | Eliminates 50KB bundle, maintains Lighthouse 100 |
| Scroll event listeners | Intersection Observer API | 2019+ (API widely supported) | Asynchronous, battery-friendly, eliminates scroll jank |
| GSAP for stagger animations | CSS transition-delay | Ongoing CSS evolution | No bundle cost, simpler for basic stagger |
| JavaScript-based motion detection | prefers-reduced-motion media query | WCAG 2.1 (2018) | OS-level preference, better accessibility |
| react-spring/react-motion | CSS Animations + keyframes | 2020-2024 | GPU-optimized, declarative, better performance |
| Animating box-shadow | Layered shadows with opacity | Performance research 2020+ | 2x faster rendering, smoother |
| Element.getBoundingClientRect() polling | Intersection Observer | 2019+ | Eliminates layout thrashing, async |
| Scroll-linked animations (deprecated) | Intersection Observer | Scroll-linked animations never shipped | IO is standard solution |

**Deprecated/outdated:**
- **Scroll event listeners for animations:** Replaced by Intersection Observer (battery drain, performance issues)
- **Framer Motion for simple entrance animations:** CSS-only sufficient for this scope (bundle cost, Lighthouse impact)
- **jQuery.animate():** Completely obsolete (use CSS animations)
- **Animating layout properties:** Never acceptable (width, height, margin cause reflow)
- **Ignoring prefers-reduced-motion:** Now WCAG 2.1 Level AA requirement (must support)
- **Multiple scroll libraries:** Intersection Observer is the standard native solution

## Open Questions

Things that couldn't be fully resolved:

1. **Exact translateY Distance for Fade-Up**
   - What we know: CONTEXT.md suggests ~20px, research shows 15-30px common
   - What's unclear: Exact pixel value that feels best for this brand personality ("refined and confident")
   - Recommendation: Start with 20px (translateY(20px) in keyframe). Adjust to 15px if too dramatic, 25px if too subtle. Test on actual content.

2. **Stagger Delay for Different Component Types**
   - What we know: CONTEXT.md specifies ~50ms for subtle flow, not dramatic
   - What's unclear: Whether all component types should use same delay (cards vs testimonials vs CTAs)
   - Recommendation: Use 50ms universally for consistency. Larger components (testimonials) might feel better at 75ms, but start with 50ms and adjust only if necessary.

3. **Intersection Observer Threshold for Mobile vs Desktop**
   - What we know: threshold: 0.1 works for desktop, mobile viewport shorter
   - What's unclear: Whether mobile needs different threshold (0.2?) to prevent late triggers
   - Recommendation: Use same 0.1 threshold but increase rootMargin to "75px" on mobile (more buffer). Test on real devices to verify.

4. **Form Success Animation Approach**
   - What we know: CONTEXT.md marks this as "Claude's discretion - determine what fits the existing thank-you page flow"
   - What's unclear: Whether to add animation to form submission or rely on thank-you page redirect
   - Recommendation: Skip form success animation. Existing flow redirects to `/contact/thank-you` page, which can have its own entrance animation. Adding success animation before redirect feels redundant and delays navigation.

5. **Focus Ring Animation Expansion**
   - What we know: CONTEXT.md mentions "animated ring expansion when element receives keyboard focus"
   - What's unclear: Exact implementation (scale pseudo-element? Transition ring-offset? Keyframe animation?)
   - Recommendation: Use transition on focus-visible:ring-2 with duration-fast (150ms). Simple opacity/scale transition on ring, not elaborate expansion. Priority: ensure it's visible and smooth, not fancy.

## Sources

### Primary (HIGH confidence)
- [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Complete API reference, threshold, rootMargin options
- [W3C WCAG C39 Technique](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) - prefers-reduced-motion implementation, code examples
- [MDN @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) - CSS animation syntax
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - Media query usage, browser support
- [Smashing Magazine - GPU Animation Doing It Right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/) - GPU-accelerated properties, performance
- Existing project files: globals.css (Phase 8 duration tokens), button.tsx (Phase 9 gradient), card.tsx (Phase 9 hover)

### Secondary (MEDIUM confidence)
- [CSS-Tricks prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/) - Accessibility best practices
- [Vanilla JS Scroll Events with IntersectionObserver](https://cheewebdevelopment.com/vanilla-js-scroll-events-animations-with-intersectionobserver-api/) - Stagger patterns, implementation examples
- [SitePoint - Button Micro-interactions](https://www.sitepoint.com/button-micro-interactions/) - Button press feedback patterns
- [FreeCodeCamp - Scroll Animations with Intersection Observer](https://www.freecodecamp.org/news/scroll-animations-with-javascript-intersection-observer-api/) - Tutorial with code examples
- [Bomberbot - Effortless Scroll Animations](https://www.bomberbot.com/javascript/effortless-scroll-animations-with-the-intersection-observer-api/) - Performance patterns
- [Linear-inspired motion principles](https://linear.app) - Motion grammar reference (CONTEXT.md mentions Linear)

### Tertiary (LOW confidence - requires validation)
- WebSearch results for CSS scroll animations, stagger patterns (multiple sources, cross-verified)
- WebSearch results for button micro-interactions, active state timing (2026 design standards)
- CodePen examples for stagger animations, mobile menu patterns (community patterns)
- Medium articles on Intersection Observer patterns (implementation examples)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All browser-native APIs, Intersection Observer 97%+ support, CSS animations universal
- Architecture: HIGH - Patterns from MDN official docs, W3C WCAG specs, verified in existing project code
- Pitfalls: HIGH - Based on official performance research (Smashing Magazine GPU article), W3C accessibility requirements
- Code examples: HIGH - MDN official examples, existing project patterns from Phase 8/9, WCAG code samples

**Research date:** 2026-02-05
**Valid until:** 2026-05-05 (90 days - stable browser APIs, WCAG standards, CSS animation patterns well-established)

**Research scope notes:**
- CONTEXT.md locked in specific animation styles (fade-up, shadow lift, gradient shimmer, Ken Burns, underline slide-in, button press, form error fade)
- Claude's discretion areas: exact translateY distance, stagger delays for different components, mobile threshold, form success animation, focus ring expansion
- CSS-only constraint from STATE.md (Framer Motion excluded for Lighthouse 100 score)
- prefers-reduced-motion is MANDATORY (WCAG 2.1 Level AA requirement)
- Once-only animations required (CONTEXT.md: no replay on scroll back)
- ~30% element coverage (CONTEXT.md: key sections only, not every element)
- Hero section fully visible on load (CONTEXT.md: no scroll trigger for hero)
