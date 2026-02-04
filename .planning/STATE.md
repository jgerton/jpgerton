# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-02-03)

**Core value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.
**Current focus:** Phase 4 - Admin Dashboard

## Current Position

Phase: 4 of 6 (Admin Dashboard) - IN PROGRESS
Plan: 2 of 7 complete
Status: Wave 2 complete - Admin backend API ready
Last activity: 2026-02-03 - Completed 04-02-PLAN.md (Admin Backend API)

Progress: [█████████████░░░░░░░░░░░░░░░░░░░░] 45% (18 of 40 total plans)

## Performance Metrics

**Velocity:**

- Total plans completed: 18
- Average duration: 4.9 min
- Total execution time: 1h 38min

**By Phase:**

| Phase                | Plans | Total    | Avg/Plan |
| -------------------- | ----- | -------- | -------- |
| 01-infrastructure    | 5     | 45min    | 9min     |
| 02-projects-home     | 4     | 23min    | 5.8min   |
| 03-services-contact  | 7     | 15min    | 2.1min   |
| 04-admin-dashboard   | 2     | 6min     | 3min     |

**Recent Trend:**

- Last 5 plans: 03-05 (2.8min), 03-06 (3min), 03-07 (checkpoint), 04-01 (3min), 04-02 (3min)
- Trend: Excellent velocity maintained (3min average for executable plans)

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Next.js 14 App Router for modern React patterns and Vercel integration (pre-project)
- Convex over Supabase for better DX, reactive queries, generous free tier (pre-project)
- Convex Auth over Clerk to keep auth in same ecosystem (pre-project)
- Full AEO treatment as differentiator for AI search visibility (pre-project)
- Dockerized local dev for consistent environment with port isolation (3400-3499) (pre-project)
- Bun as package manager for 10-25x faster installs vs npm (01-01)
- Tailwind CSS v4 requires @tailwindcss/postcss plugin (01-01)
- ESLint v8 instead of v9 for Next.js compatibility (01-01)
- Inter font with next/font/google for optimal loading (01-01)
- Use oven/bun:1 official image for consistent Bun runtime (01-02)
- WATCHPACK_POLLING and CHOKIDAR_USEPOLLING for Docker hot reload (01-02)
- Anonymous volumes for node_modules and .next to prevent host conflicts (01-02)
- jpgerton-frontend container name and jpgerton-network for naming conventions (01-02)
- healthChecks table as placeholder for infrastructure verification (01-03)
- ConvexProvider in separate providers.tsx for future extension (01-03)
- Tailwind v4 CSS-first approach with @theme directive (01-04)
- HSL CSS variables for brand colors and theme tokens (01-04)
- next-themes with class-based dark mode for SSR compatibility (01-04)
- Single CI job 'lint-typecheck-build' for branch protection simplicity (01-05)
- Vercel deploymentEnabled: main true, develop false (01-05)
- env_file for Docker instead of shell interpolation (01-05)
- screenshotId optional for initial setup without images (02-01)
- Client-side filtering for filterByTech due to Convex array index limitations (02-01)
- Wildcard *.convex.cloud hostname for all Convex deployments (02-01)
- nuqs for URL state management with shareable filter URLs (02-02)
- NuqsAdapter positioned between ConvexProvider and ThemeProvider (02-02)
- Native HTML select for sort dropdown (no shadcn Select) (02-02)
- Responsive grid breakpoints: 1 col mobile, 2 tablet, 3 desktop (02-02)
- Suspense boundary required for projects page using useQueryState (02-03)
- generateStaticParams returns empty array if Convex unavailable during build (02-03)
- Project detail page uses server component (async) for fetchQuery (02-03)
- Home page remains client component for useQuery hook (02-03)
- 6 diverse projects with varying statuses (in-progress, live, archived) (02-04)
- displayOrder for sorting (6 = most recent, 1 = oldest) (02-04)
- featured flag for 3 projects to show on home (02-04)
- techCategories grouped by frontend/backend/infrastructure (02-04)
- Zod v4 'message' property instead of 'errorMap' for enum validation (03-01)
- Calendly slot pattern for flexible CTA injection in pricing cards (03-01)
- Honeypot field in contact schema for spam protection (03-01)
- Scheduler pattern (runAfter 0) for immediate email dispatch after mutation commits (03-02)
- internalAction ensures email action only callable from mutations, not public API (03-02)
- Non-throwing error handling in email action logs failures but doesn't break submissions (03-02)
- HTML escaping function prevents XSS in email content (03-02)
- Dynamic import react-calendly with SSR disabled to prevent hydration errors (03-03)
- Use rootElement={document.body} instead of __next for Calendly modal mount (03-03)
- Position honeypot field off-screen rather than display:none (harder for bots to detect) (03-03)
- Native select element styled to match shadcn (no extra dependencies) (03-03)
- Side-by-side cards layout with $500 tier highlighted (scale + shadow) (03-04)
- Benefit-focused bullets (outcomes not features) - 8 per tier (03-04)
- Calendly popup for $500 booking (keeps user in context) (03-04)
- Contact page redirect for custom/consulting inquiries (03-04)
- Trust section with key stats at bottom (03-04)
- Two-column layout with form on left, Calendly + info on right (03-05)
- Calendly card highlighted with border-primary to emphasize alternative conversion path (03-05)
- Thank-you page includes numbered 3-step process and portfolio CTA (not a dead end) (03-05)
- Response time expectation set (1 business day) for transparency (03-05)
- Social links provide alternative contact methods (03-05)
- No photo on About page initially - text-only trust building through narrative (03-06)
- Dual CTA strategy on About: Primary Calendly, Secondary portfolio link (03-06)
- Card grid for "Why Work With Me" enhances scannability (03-06)
- Stats section at bottom of About page for social proof (03-06)
- 7-day session duration for Convex Auth (totalDurationMs and inactiveDurationMs) (04-01)
- Four-state contact workflow: unread -> read -> responded -> archived (04-01)
- Convex Auth uses authTables pattern integrated into schema (04-01)
- Auth configuration in convex/auth.config.ts with Password provider (04-01)
- Middleware performs optimistic auth check (UX) - security enforced by Convex mutations (04-02)
- Convex Auth uses __convexAuthToken cookie for session (04-02)
- Contact list sorted by status priority (unread, read, responded) then createdAt (04-02)
- All admin mutations verify auth with getAuthUserId before operation (04-02)

### Pending Todos

None yet.

### Blockers/Concerns

**Phase 4 - Admin Dashboard:**
- Environment variables required: AUTH_SECRET (generate with openssl), SITE_URL (http://localhost:3400)
- First admin user must be created via Convex dashboard or CLI before authentication can be tested

## Session Continuity

Last session: 2026-02-03 (plan execution)
Stopped at: Completed 04-02-PLAN.md (Admin Backend API)
Resume file: None

## Deployment Info

- **GitHub:** https://github.com/jgerton/jpgerton
- **Vercel Production:** https://wp-designer.vercel.app
- **Convex:** https://amicable-pony-588.convex.cloud
- **Local Dev:** http://localhost:3400 (via docker compose up)
