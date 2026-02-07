---
phase: 19-launch-prep-tech-debt
plan: 02
status: complete
subsystem: analytics
tags: [ga4, tracking, analytics, conversion, blog-engagement]

dependencies:
  requires:
    - phase: 16
      plan: 02
      reason: "Blog category filtering UI exists"
    - phase: 15
      plan: 02
      reason: "Blog post queries provide readingTime field"
  provides:
    - "GA4 custom event tracking for all conversion points"
    - "Blog engagement analytics (category filtering, read completion)"
    - "Analytics utility library with SSR guards"
  affects:
    - phase: 20
      plan: all
      reason: "GA4 tracking data available for launch metrics analysis"

tech-stack:
  added: []
  patterns:
    - "Client-side analytics with SSR guards"
    - "Intersection Observer for scroll-based tracking"
    - "Event tracking via callback functions"

key-files:
  created:
    - path: "lib/analytics.ts"
      purpose: "GA4 custom event tracking utilities"
    - path: "components/blog/blog-read-tracker.tsx"
      purpose: "Invisible sentinel for blog read completion tracking"
  modified:
    - path: "components/portfolio/cta-button.tsx"
      purpose: "Added trackingName prop and onClick tracking"
    - path: "components/calendly/calendly-button.tsx"
      purpose: "Added popup open tracking"
    - path: "components/forms/contact-form.tsx"
      purpose: "Added submission success tracking"
    - path: "components/blog/category-filter.tsx"
      purpose: "Added category selection tracking"
    - path: "app/blog/[slug]/page.tsx"
      purpose: "Added BlogReadTracker component"

decisions:
  - decision: "Track CTA clicks with optional trackingName prop"
    rationale: "Allows components to opt-in to tracking without breaking existing usage"
    alternatives: ["Required tracking name", "Auto-generate from button text"]
    chosen: "Optional trackingName prop"
  - decision: "Fire Calendly tracking on wrapper div click"
    rationale: "PopupButton is third-party component, wrapping is cleanest approach"
    alternatives: ["Fork react-calendly", "Use onOpen callback if available"]
    chosen: "Wrapper div onClick"
  - decision: "Track form submit only after successful submission"
    rationale: "Avoids counting failed submissions as conversions"
    alternatives: ["Track all attempts", "Track both attempts and successes separately"]
    chosen: "Only track successful submissions"
  - decision: "Use intersection observer with 50% threshold for read completion"
    rationale: "User must scroll to visible portion of sentinel to count as read"
    alternatives: ["100% threshold", "Time-based tracking", "Scroll depth percentage"]
    chosen: "50% threshold intersection observer"
  - decision: "Make CTAButton a client component"
    rationale: "Required for onClick handler, asChild pattern still works with Link"
    alternatives: ["Keep server component, track in parent", "Separate tracked/untracked components"]
    chosen: "Convert to client component"

metrics:
  duration: "6 minutes"
  completed: "2026-02-07"
---

# Phase 19 Plan 02: Add GA4 Custom Event Tracking Summary

**One-liner:** GA4 event tracking wired into all conversion points (CTA clicks, Calendly opens, form submissions) and blog engagement (category filtering, read completion)

## What Was Built

Added comprehensive GA4 custom event tracking across the site:

**Analytics utility library (`lib/analytics.ts`):**
- Four tracking functions: `trackCTAClick`, `trackFormSubmit`, `trackBlogCategoryFilter`, `trackBlogReadComplete`
- All functions guard against SSR (`typeof window !== "undefined"`)
- All functions no-op when `window.gtag` is undefined (safe in dev/preview environments)
- Event names follow GA4 naming conventions (lowercase snake_case)

**Conversion point tracking:**
- CTAButton: Added `trackingName` prop, fires `cta_click` event with button name and page location
- CTAButton: Converted to client component for onClick handling (asChild pattern still works)
- CalendlyButton: Fires `cta_click` with `"book_a_call"` when popup opens
- ContactForm: Fires `form_submit` with form name and project type after successful submission only

**Blog engagement tracking:**
- CategoryFilter: Fires `blog_category_filter` when any category button clicked (including "All")
- BlogReadTracker: New invisible sentinel component using intersection observer
- Blog detail pages: BlogReadTracker placed after article content, fires `blog_read_complete` when user scrolls to end
- Read tracker uses 50% threshold, fires exactly once per page load

**Event parameters captured:**
- All events: `page_location` (full URL)
- CTA clicks: `button_name`, optional `page_section`
- Form submissions: `form_name`, `project_type`
- Category filter: `category` (category name or "all")
- Read completion: `post_slug`, `read_time_minutes`

## Tasks Completed

| Task | Commit | Files Modified |
|------|--------|----------------|
| 1. Create analytics utility library | c15411e | lib/analytics.ts (created) |
| 2. Wire conversion component tracking | 659205e | cta-button.tsx, calendly-button.tsx, contact-form.tsx |
| 3. Wire blog engagement tracking | d733777 | category-filter.tsx, blog-read-tracker.tsx (created), blog/[slug]/page.tsx |

## Technical Details

**Analytics library SSR pattern:**
```typescript
if (typeof window !== "undefined" && window.gtag) {
  window.gtag("event", "event_name", { ... });
}
```
This ensures:
- No errors during server-side rendering
- No errors when GA4 not configured (dev/preview)
- Events only fire in production with NEXT_PUBLIC_GA_ID set

**CTAButton client component consideration:**
Converting CTAButton to a client component was necessary for onClick tracking. This doesn't break the existing `asChild` pattern with `Link` - the onClick handler is passed through Radix UI's Slot component to the child element. All existing usage continues to work.

**BlogReadTracker implementation:**
Uses the existing `useIntersectionObserver` hook with callback ref pattern. The component:
- Renders a visually hidden div (`aria-hidden="true"`)
- Observes when that div enters viewport (50% threshold)
- Fires tracking event exactly once (triggerOnce: true)
- Placed after `<BlogPostContent>` in article element

**Calendly tracking approach:**
The PopupButton from react-calendly doesn't expose an onClick prop or onOpen callback, so we wrap it in a div with onClick. The click event bubbles up and fires our tracking before the popup opens.

## Deviations from Plan

None. Plan executed exactly as written.

## Testing Notes

**Verification performed:**
- `bun run type-check` passes
- `bun run build` succeeds (Next.js compilation successful)
- All analytics functions export correctly
- CTAButton has "use client" directive
- CTAButton has trackingName prop
- All tracking functions guard against SSR/missing gtag

**Manual testing recommended:**
1. Install React DevTools + GA4 debug extension
2. Add GA4 measurement ID to .env.local
3. Click CTA buttons, verify `cta_click` events fire with correct button_name
4. Open Calendly popup, verify `cta_click` with `button_name: "book_a_call"`
5. Submit contact form, verify `form_submit` with form_name and project_type
6. Click blog category filters, verify `blog_category_filter` with correct category
7. Scroll to end of blog post, verify `blog_read_complete` with slug and reading time

## Next Phase Readiness

**Blockers:** None

**Dependencies delivered:**
- GA4 tracking infrastructure ready for launch metrics analysis
- Event data will populate GA4 dashboard once NEXT_PUBLIC_GA_ID is set in production

**Concerns:**
- Pre-existing ESLint errors in `app/(home)/page.tsx` related to ref access during render (not introduced by this plan, affects animation code from Phase 12)

**Recommended next steps:**
1. Add NEXT_PUBLIC_GA_ID to production environment variables
2. Verify events appear in GA4 real-time report after deployment
3. Add trackingName props to existing CTAButton components throughout the site
4. Create GA4 dashboard to monitor conversion funnel and blog engagement
