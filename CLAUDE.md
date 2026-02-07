# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Constraints

- **Docker-first development.** Always use `docker compose up` to run the dev server. Never suggest `bun run dev` directly on the host. Local dev runs at http://localhost:3400 (port 3400:3000 mapping). Ports 3400-3499 are reserved for this project.
- **Package manager: Bun.** Use `bun install`, `bun run`, `bun add`, `bunx` - never npm/npx.
- **Git workflow:** Work on `develop` branch, PR to `main` for releases. Only `main` auto-deploys to Vercel.
- **Free tier limits:** Vercel free tier for hosting, Convex free tier (1M function calls/month), $0 infrastructure budget.

## Commands

```bash
# Development
docker compose up              # Start dev server at localhost:3400
docker compose down            # Stop

# Quality (run inside container or CI)
bun run lint                   # ESLint (.ts, .tsx)
bun run type-check             # TypeScript strict mode check
bun run format                 # Prettier

# Build
bun run build                  # Next.js build + next-aeo (generates public/llms.txt)
bun run build:no-aeo           # Build without AEO generation

# Convex
bunx convex dev                # Start Convex dev server
bunx convex deploy             # Deploy to production
```

CI runs lint, type-check, and build on all PRs (`.github/workflows/ci.yml`).

## Architecture

**Stack:** Next.js 16 (App Router) + Convex + Tailwind CSS v4 + shadcn/ui + TypeScript (strict)

### App Structure

- `app/` - Next.js App Router pages. Route groups: `(home)/` for landing page. Public pages: projects, services, about, contact. Protected: `admin/` (Convex Auth).
- `components/ui/` - shadcn/ui primitives (Button, Card, Badge, etc.)
- `components/portfolio/` - Composition components (CTAButton, TestimonialCard, CaseStudyVisual, ProjectCardEnhanced). Barrel export via `index.ts`.
- `components/portfolio/sections/` - Layout wrappers (SectionBackground, CTABanner, HeroWithGradient, MidPageCTA)
- `convex/` - Backend: schema, queries, mutations, auth config. `_generated/` is auto-generated (gitignored from Claude).
- `hooks/` - Custom React hooks (useIntersectionObserver)
- `lib/` - Utilities: `utils.ts` (cn helper), `fonts.ts` (Inter + Lora), `site-config.ts`

### Convex Patterns

Tables: `projects` (portfolio), `contactSubmissions` (form inbox), `healthChecks` (infra), plus auth tables.

```typescript
// Queries use reactive hooks - undefined means loading, not empty
const projects = useQuery(api.projects.list);

// Mutations require auth check in handler
const userId = await getAuthUserId(ctx);
if (!userId) throw new Error("Unauthorized");
```

### Tailwind v4 (CSS-First)

All configuration lives in `app/globals.css` via directives. No `tailwind.config.ts`.

- `@theme` block: static design tokens (spacing, shadows, fonts, fluid type scale, max-widths)
- `@theme inline` block: semantic color mappings wrapping CSS variables (creates Tailwind utilities)
- `@layer base`: CSS variables for light/dark mode (`:root` and `.dark`)

**Known pitfall:** Named spacing tokens (`--spacing-xs` through `--spacing-3xl`) collide with Tailwind's `max-w-*` utilities. Always define explicit `--max-width-xs` through `--max-width-7xl` in the `@theme` block.

### Server vs Client Components

Default to Server Components. Only add `"use client"` when the component needs hooks, event handlers, or browser APIs. Most portfolio section components (SectionBackground, CTABanner, CaseStudyVisual) are Server Components. HeroWithGradient, form components, and anything using `useQuery`/`useMutation` are Client Components.

### Import Aliases

```typescript
import { Button } from "@/components/ui/button";   // @/* maps to project root
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
```

## Design System Rules

- **Typography:** H1/H2/H3 use font-serif (Lora). H4+ and all UI text use font-sans (Inter). Fluid type via CSS `clamp()` tokens (text-hero, text-h1, text-h2, etc.).
- **Colors:** WCAG AA minimum (4.5:1 text, 3:1 UI). Dark mode uses warm blue-gray (`220 15% 10%`), not pure black. Amber accent gets dark foreground text, not white.
- **Animations:** CSS-only (no Framer Motion). GPU-accelerated properties only (transform, opacity). Duration tokens: `--duration-fast` (150ms), `--duration-entrance` (250ms), `--duration-base` (300ms). `prefers-reduced-motion` uses `0.01ms` not `0ms`.
- **Component composition:** Extend shadcn/ui via CVA variants and wrapper components, don't modify primitives. Card elevation convention: flat (informational), sm (content), lg (interactive).
- **Intersection Observer hook:** Uses callback ref pattern (`useState` + `useCallback`), not `useRef`, because useRef doesn't re-trigger useEffect when a node mounts after conditional rendering.

## Code Style

- Prettier: double quotes, semicolons, trailing commas (es5), 2-space indent, 80 char width
- ESLint: jsx-a11y enabled, unused vars warn (prefix with `_` to suppress), no-explicit-any warn
- Prefix unused function args with `_` (e.g., `_ctx`)
