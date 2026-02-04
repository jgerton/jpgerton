# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2025-02-03)

**Core value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.
**Current focus:** Phase 2 - Projects & Home

## Current Position

Phase: 2 of 6 (Projects & Home)
Plan: 2 of 6 (02-02-PLAN.md complete)
Status: In progress
Last activity: 2026-02-03 - Completed 02-02-PLAN.md (Portfolio UI components)

Progress: [███████░░░░░░░░░░░░░░░░░░░] 7/23 plans (30%)

## Performance Metrics

**Velocity:**

- Total plans completed: 7
- Average duration: 7 min
- Total execution time: 0.87 hours

**By Phase:**

| Phase             | Plans | Total | Avg/Plan |
| ----------------- | ----- | ----- | -------- |
| 01-infrastructure | 5     | 45min | 9min     |
| 02-projects-home  | 2     | 4min  | 2min     |

**Recent Trend:**

- Last 5 plans: 01-03 (7min), 01-04 (15min), 01-05 (10min), 02-01 (2min), 02-02 (2min)
- Trend: Phase 2 maintaining high velocity (2min avg)

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-03 (plan execution)
Stopped at: Completed 02-02-PLAN.md
Resume file: None

## Deployment Info

- **GitHub:** https://github.com/jgerton/jpgerton
- **Vercel Production:** https://wp-designer.vercel.app
- **Convex:** https://amicable-pony-588.convex.cloud
- **Local Dev:** http://localhost:3400 (via docker compose up)
