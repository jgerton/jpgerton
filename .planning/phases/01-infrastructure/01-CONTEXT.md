# Phase 1: Infrastructure - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Foundation setup enabling local development and production deployment. Includes Docker environment, Next.js with Tailwind/shadcn, Convex backend, dark/light mode, Vercel deployment on main, and GitHub workflow with CI checks. This is developer tooling - no user-facing features beyond theme toggle.

</domain>

<decisions>
## Implementation Decisions

### Dark Mode Behavior
- Default to system preference on first visit
- Toggle lives in header/navbar (always visible)
- Icon with tooltip style (sun/moon icon, hover explains)
- 2-state toggle only (light/dark) - no "return to system" option
- Preference persists in localStorage

### Component Library Setup
- Pre-install common shadcn/ui set: Button, Card, Input, Form, Dialog, Toast, Avatar, Badge
- Brand color palette:
  - Primary Corporate Blue: #003F75
  - Secondary Tech Blue: #2884BD
  - Highlight Turquoise: #0FACB0
  - Soft Black: #1A1A1A
  - Graphite Gray: #696969
- Font: Inter (via Google Fonts or local hosting)
- Border radius: Medium (8-12px) across components

### Dev Workflow Conventions
- Branch naming: type/description (e.g., feat/add-dark-mode, fix/nav-bug)
- Commit format: Conventional Commits with scope (feat(ui): add theme toggle)
- PR requirements: Just CI checks (lint, type-check, build pass)
- CI runs on all PRs (not just PRs to main)
- develop branch is default working branch, main is protected

### Port and Naming Conventions
- Port allocation grouped by service within 3400-3499:
  - Next.js: 3400
  - Convex: 3410
  - Future services: 3420+
- Container prefix: jpgerton-* (jpgerton-frontend, jpgerton-convex)
- Volume naming matches containers (jpgerton-convex-data, jpgerton-node-modules)
- Single Docker network: jpgerton-network

### Claude's Discretion
- Exact Tailwind config structure
- shadcn/ui initialization approach
- Convex schema design
- Docker Compose file organization
- GitHub Actions workflow YAML structure
- ESLint/Prettier configuration

</decisions>

<specifics>
## Specific Ideas

- All execution through Docker (no direct bun dev or npx convex dev on host)
- Volume mounts for hot reload during development
- Vercel deployment only on merge to main (not develop commits)

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 01-infrastructure*
*Context gathered: 2026-02-03*
