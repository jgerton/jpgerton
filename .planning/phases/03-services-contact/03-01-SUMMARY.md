---
phase: 03-services-contact
plan: 01
subsystem: services
tags: [zod, validation, convex, react-calendly, resend, pricing-ui]

# Dependency graph
requires:
  - phase: 01-infrastructure
    provides: Convex schema and configuration
  - phase: 02-projects-home
    provides: shadcn/ui components and styling patterns
provides:
  - Contact form Zod validation schema
  - Convex contactSubmissions table with indexes
  - Pricing card components with Calendly slot support
affects: [03-02-services-page, 03-03-contact-form]

# Tech tracking
tech-stack:
  added: [react-calendly, @convex-dev/resend]
  patterns: [Zod schema for form validation, presentational components with slot pattern]

key-files:
  created:
    - lib/validations/contact-schema.ts
    - components/pricing/pricing-card.tsx
    - components/pricing/pricing-cards.tsx
  modified:
    - package.json
    - convex/schema.ts

key-decisions:
  - "Zod v4 'message' property instead of 'errorMap' for enum validation"
  - "Calendly slot pattern for flexible CTA injection in pricing cards"
  - "Honeypot field in contact schema for spam protection"

patterns-established:
  - "Slot pattern for component injection (calendlySlot prop)"
  - "Zod schema exports both schema and inferred TypeScript type"
  - "Pricing tier interface with ctaAction discriminator"

# Metrics
duration: 2.4min
completed: 2026-02-04
---

# Phase 03 Plan 01: Services & Contact Foundation Summary

**Contact validation schema, contactSubmissions table with indexes, and pricing card components with Calendly integration support**

## Performance

- **Duration:** 2.4 min
- **Started:** 2026-02-04T03:34:55Z
- **Completed:** 2026-02-04T03:37:16Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Installed react-calendly and @convex-dev/resend packages
- Extended Convex schema with contactSubmissions table (status and created indexes)
- Created Zod validation schema with honeypot field for spam protection
- Built presentational pricing card components with Calendly slot support

## Task Commits

Each task was committed atomically:

1. **Task 1: Install packages and extend Convex schema** - `24997bc` (chore)
2. **Task 2: Create Zod validation schema** - `b5c0bd0` (feat)
3. **Task 3: Create pricing card components** - `dde84c1` (feat)

**Plan metadata:** (will be added)

## Files Created/Modified
- `package.json` - Added react-calendly and @convex-dev/resend dependencies
- `convex/schema.ts` - Added contactSubmissions table with status and created indexes
- `lib/validations/contact-schema.ts` - Zod schema for contact form validation
- `components/pricing/pricing-card.tsx` - Individual pricing tier card with benefits list
- `components/pricing/pricing-cards.tsx` - Responsive grid layout for pricing tiers

## Decisions Made

**1. Zod v4 'message' property instead of 'errorMap'**
- Zod v4 changed enum error customization API
- Uses `{ message: "..." }` instead of `{ errorMap: () => ({ message: "..." }) }`
- Fixed type error during Task 2 (Rule 1 - Bug)

**2. Calendly slot pattern for flexible CTA injection**
- PricingCard accepts optional `calendlySlot` prop instead of rendering Calendly directly
- Allows parent component to control Calendly button rendering
- Supports both "calendly" and "contact" CTA actions

**3. Honeypot field in contact schema**
- `honeypot: z.string().max(0, "Bot detected")` rejects non-empty values
- Invisible field in form (CSS hidden) catches bots that auto-fill all fields
- No external service needed for basic spam protection

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Zod v4 enum errorMap syntax**
- **Found during:** Task 2 (Create Zod validation schema)
- **Issue:** TypeScript error - Zod v4 enum doesn't accept `errorMap` property
- **Fix:** Changed `{ errorMap: () => ({ message: "..." }) }` to `{ message: "..." }`
- **Files modified:** lib/validations/contact-schema.ts
- **Verification:** `bun run type-check` passed
- **Committed in:** b5c0bd0 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor API compatibility fix for Zod v4. No scope creep.

## Issues Encountered
None - all tasks completed as planned after fixing Zod v4 enum syntax.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Contact form validation ready for use in contact form component
- Convex schema ready for storing contact submissions
- Pricing cards ready for services page assembly
- All type checks and lint pass
- Ready for 03-02 (Services Page) and 03-03 (Contact Form)

---
*Phase: 03-services-contact*
*Completed: 2026-02-04*
