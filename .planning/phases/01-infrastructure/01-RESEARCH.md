# Phase 1: Infrastructure - Research

**Researched:** 2026-02-03
**Domain:** Docker + Next.js 14 App Router + Convex + Modern Frontend Tooling
**Confidence:** MEDIUM

## Summary

Infrastructure phase establishes a Dockerized development environment using Bun as the package manager, Next.js 14 App Router with Tailwind CSS and shadcn/ui for the frontend, and Convex for the backend. The stack is production-ready with Vercel deployment, GitHub Actions CI, and modern developer experience patterns.

The standard approach is to use Docker Compose for orchestration with volume mounts for hot reload, next/font for automatic font optimization, next-themes for flicker-free dark mode, and Convex's built-in type generation for end-to-end type safety. The setup requires careful attention to Docker networking, environment variable configuration (especially NEXT*PUBLIC* prefixes), and proper handling of node_modules volumes to avoid common pitfalls.

**Primary recommendation:** Use official Docker images (oven/bun:1), leverage Next.js built-in optimizations (next/font, App Router), implement multi-stage Docker builds with proper .dockerignore, configure ConvexProvider in a dedicated client component wrapper, and ensure WATCHPACK_POLLING=true for reliable hot reload in Docker.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library      | Version | Purpose                         | Why Standard                                                                           |
| ------------ | ------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| Next.js      | 14+     | React framework with App Router | Industry standard for SSR/SSG React apps, Vercel's primary framework, best-in-class DX |
| Bun          | 1.x     | Runtime and package manager     | 2-4x faster than npm, drop-in replacement, excellent Docker support                    |
| Convex       | Latest  | Backend and real-time database  | Type-safe by design, reactive queries, generous free tier, better DX than Supabase     |
| Tailwind CSS | 3.x/4.x | Utility-first CSS framework     | De facto standard for modern React, excellent with shadcn/ui                           |
| shadcn/ui    | Latest  | Component library               | Copy-paste approach (not dependency), built on Radix UI, highly customizable           |
| next-themes  | Latest  | Dark mode management            | Zero-flicker implementation, system preference support, localStorage persistence       |

### Supporting

| Library        | Version | Purpose                       | When to Use                                                   |
| -------------- | ------- | ----------------------------- | ------------------------------------------------------------- |
| Docker         | Latest  | Containerization              | All local development (mandatory per phase requirements)      |
| Docker Compose | Latest  | Multi-container orchestration | Dev environment with Next.js + Convex services                |
| TypeScript     | 5.x     | Type safety                   | Required for Convex type generation and shadcn/ui             |
| ESLint         | Latest  | Code linting                  | Included with Next.js, use eslint-config-next/core-web-vitals |
| Prettier       | Latest  | Code formatting               | Pairs with ESLint via eslint-config-prettier                  |
| Vercel CLI     | Latest  | Deployment testing            | Optional for local preview of production builds               |

### Alternatives Considered

| Instead of  | Could Use         | Tradeoff                                                                    |
| ----------- | ----------------- | --------------------------------------------------------------------------- |
| Bun         | npm/yarn/pnpm     | Slower installs (90s vs 25-40s for 120 packages), but more mature ecosystem |
| Convex      | Supabase          | More control over backend, but lose type generation and reactive queries DX |
| next-themes | Custom solution   | More control, but must handle SSR hydration, FOUC, and storage manually     |
| shadcn/ui   | Radix UI directly | More flexibility, but lose pre-styled components and DX                     |

**Installation:**

```bash
# Initialize Next.js project with Bun
bunx create-next-app@latest --typescript --tailwind --app --no-src-dir

# Install Convex
bun add convex

# Install shadcn/ui (interactive setup)
bunx shadcn@latest init

# Install theme management
bun add next-themes

# Install pre-selected shadcn/ui components
bunx shadcn@latest add button card input dialog toast avatar badge
```

## Architecture Patterns

### Recommended Project Structure

```
wp-designer/
├── app/                 # Next.js App Router (routes, layouts, pages)
│   ├── layout.tsx      # Root layout (Server Component)
│   ├── page.tsx        # Home page
│   └── providers.tsx   # Client Component wrapper for ConvexProvider + ThemeProvider
├── components/          # React components
│   ├── ui/             # shadcn/ui components (auto-generated)
│   └── theme-toggle.tsx # Dark mode toggle
├── convex/             # Convex backend (auto-generated)
│   ├── _generated/     # Type definitions (gitignored, auto-generated)
│   └── schema.ts       # Database schema
├── lib/                # Utilities
│   └── utils.ts        # cn() helper for shadcn/ui
├── public/             # Static assets
├── .dockerignore       # Exclude from Docker context
├── .eslintrc.json      # ESLint config
├── .prettierrc.json    # Prettier config
├── docker-compose.yml  # Multi-service orchestration
├── Dockerfile          # Multi-stage build (dev + production)
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind + custom colors
└── tsconfig.json       # TypeScript config
```

### Pattern 1: Dockerized Development with Hot Reload

**What:** Use Docker Compose with bind mounts for live code updates without rebuilding.
**When to use:** All local development (mandatory per phase requirements).
**Example:**

```yaml
# docker-compose.yml
version: "3.8"
services:
  frontend:
    build:
      context: .
      target: dev
    container_name: jpgerton-frontend
    ports:
      - "3400:3000"
    volumes:
      - .:/app # Bind mount entire project
      - /app/node_modules # Prevent overwriting installed deps
      - /app/.next # Persist Next.js build cache
    environment:
      - WATCHPACK_POLLING=true # Critical for hot reload in Docker
      - CHOKIDAR_USEPOLLING=true # Backup polling mechanism
      - NEXT_PUBLIC_CONVEX_URL=${NEXT_PUBLIC_CONVEX_URL}
    networks:
      - jpgerton-network
    command: bun --bun run dev

  convex:
    image: oven/bun:1
    container_name: jpgerton-convex
    ports:
      - "3410:3000"
    volumes:
      - .:/app
      - jpgerton-convex-data:/data
    working_dir: /app
    environment:
      - CONVEX_DEPLOYMENT=${CONVEX_DEPLOYMENT}
    networks:
      - jpgerton-network
    command: bunx convex dev

networks:
  jpgerton-network:
    name: jpgerton-network

volumes:
  jpgerton-convex-data:
    name: jpgerton-convex-data
```

### Pattern 2: ConvexProvider in Client Component Wrapper

**What:** Wrap ConvexProvider and ThemeProvider in a Client Component, imported by Server Component layout.
**When to use:** Always (required for App Router compatibility).
**Example:**

```tsx
// app/providers.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ConvexProvider>
  );
}

// app/layout.tsx (Server Component)
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Pattern 3: Zero-Flicker Dark Mode with next-themes

**What:** Use next-themes with suppressHydrationWarning to prevent FOUC during SSR hydration.
**When to use:** Any theme toggle implementation.
**Example:**

```tsx
// components/theme-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### Pattern 4: Tailwind Custom Colors with CSS Variables (v4)

**What:** Define custom brand colors using @theme directive with --color-\* namespace.
**When to use:** All projects with custom brand palette.
**Example:**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-corporate-blue: #003f75;
  --color-tech-blue: #2884bd;
  --color-turquoise: #0facb0;
  --color-soft-black: #1a1a1a;
  --color-graphite: #696969;
}

/* Usage: bg-corporate-blue, text-tech-blue, border-turquoise */
```

**Note:** If using Tailwind v3, use tailwind.config.ts extend.colors instead.

### Pattern 5: Inter Font with Automatic Self-Hosting

**What:** Use next/font/google for zero-config self-hosting with layout shift prevention.
**When to use:** Always for Google Fonts (Inter, Roboto, etc.).
**Example:**

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevent FOIT
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
```

### Pattern 6: Convex Type-Safe Queries

**What:** Define schema in convex/schema.ts, Convex generates types automatically.
**When to use:** Always (enables end-to-end type safety).
**Example:**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});

// convex/users.ts
import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// app/page.tsx (Client Component)
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const users = useQuery(api.users.list); // Fully typed!
  return <div>{users?.map(u => u.name)}</div>;
}
```

### Pattern 7: GitHub Actions CI Workflow

**What:** Lint, type-check, and build on every PR with branch protection.
**When to use:** All projects with CI requirements.
**Example:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: ["**"]

jobs:
  lint-typecheck-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run ESLint
        run: bun run lint

      - name: Type check
        run: bun run type-check # Add "type-check": "tsc --noEmit" to package.json

      - name: Build
        run: bun run build
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.NEXT_PUBLIC_CONVEX_URL }}
```

### Pattern 8: Vercel Deployment (Main Branch Only)

**What:** Auto-deploy to production only on merge to main, not develop.
**When to use:** Production deployment strategy.
**Example:**

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": false
    }
  },
  "github": {
    "enabled": true,
    "autoAlias": false
  }
}
```

Or via Vercel dashboard: Settings > Git > Production Branch = "main", uncheck "Auto-deploy develop".

### Anti-Patterns to Avoid

- **Don't run npm/bun dev directly on host** - All execution must go through Docker (phase requirement).
- **Don't forget WATCHPACK_POLLING=true** - Hot reload will fail in Docker without this.
- **Don't mount node_modules from host** - Use named volumes (/app/node_modules) to preserve container-installed deps.
- **Don't put ConvexProvider in Server Component** - Will cause "use client" boundary errors.
- **Don't forget NEXT*PUBLIC* prefix** - Convex URL must be NEXT_PUBLIC_CONVEX_URL or client can't connect.
- **Don't skip suppressHydrationWarning on html tag** - Will cause hydration mismatch with next-themes.
- **Don't use eslint-plugin-prettier** - Use eslint-config-prettier only (formatting is Prettier's job, not ESLint's).
- **Don't copy node_modules into Docker image** - Use .dockerignore to exclude it, install inside container.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                  | Don't Build                           | Use Instead                       | Why                                                                                        |
| ------------------------ | ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| Dark mode toggle         | Custom theme context + localStorage   | next-themes                       | Handles SSR hydration, FOUC prevention, system preference detection, and 15+ edge cases    |
| Font loading             | Manual Google Fonts link or self-host | next/font/google                  | Auto self-hosts, prevents layout shift, optimizes preloading, zero config                  |
| Component library        | Custom UI components from scratch     | shadcn/ui                         | 40+ accessible components built on Radix UI, customizable via copy-paste, not a dependency |
| Form validation          | Manual field validation               | react-hook-form + zod             | Industry standard, integrates with shadcn/ui Form component, type-safe schemas             |
| Type-safe API            | Custom API routes + manual types      | Convex functions                  | Auto-generates types from schema, reactive queries, optimistic updates built-in            |
| Docker hot reload        | Custom file watchers                  | WATCHPACK_POLLING + volume mounts | Handles Docker filesystem quirks, cross-platform (Mac/Windows/Linux)                       |
| Color palette generation | Manual shade calculation              | UI Colors, Tints.dev              | Generates 11-shade palettes with proper contrast ratios for accessibility                  |
| Environment validation   | Manual process.env checks             | zod + t3-env                      | Type-safe env vars, build-time validation, distinguishes server/client vars                |

**Key insight:** Modern frontend tooling has solved these infrastructure problems with battle-tested solutions. Custom implementations add technical debt without meaningful differentiation.

## Common Pitfalls

### Pitfall 1: Docker Hot Reload Doesn't Work

**What goes wrong:** Code changes on host don't reflect in running containers, dev server doesn't restart.
**Why it happens:** Docker's filesystem events don't propagate to containers by default on Mac/Windows. Next.js uses native filesystem watchers that fail in containers.
**How to avoid:**

- Set WATCHPACK_POLLING=true and CHOKIDAR_USEPOLLING=true in docker-compose.yml
- Use bind mounts (./:/app) not COPY in dev stage
- Add /app/node_modules and /app/.next as anonymous volumes
  **Warning signs:** Editing files has no effect, dev server shows stale code, no "compiled" messages in logs.

### Pitfall 2: ConvexProvider Causes "use client" Error

**What goes wrong:** Error: "createContext only works in Client Components" or "Attempted to call useContext() in a Server Component".
**Why it happens:** ConvexProvider uses React Context, which requires Client Components. Root layout is a Server Component by default in App Router.
**How to avoid:**

- Create app/providers.tsx marked with "use client"
- Import and use <Providers> wrapper in app/layout.tsx (Server Component)
- Never put "use client" in layout.tsx itself
  **Warning signs:** Build errors mentioning Context, useContext, or "use client" directives.

### Pitfall 3: NEXT*PUBLIC* Prefix Missing on Convex URL

**What goes wrong:** Client-side code can't connect to Convex, gets "undefined" for CONVEX*URL.
**Why it happens:** Next.js only exposes env vars to browser if prefixed with NEXT_PUBLIC*. Convex client runs in browser and needs the deployment URL.
**How to avoid:**

- Name variable NEXT_PUBLIC_CONVEX_URL in .env.local and docker-compose.yml
- Verify in Network tab that API calls go to correct Convex deployment
- Use process.env.NEXT_PUBLIC_CONVEX_URL in ConvexProvider initialization
  **Warning signs:** Convex queries fail with connection errors, network requests missing, console shows undefined URL.

### Pitfall 4: Dark Mode Flickers on Page Load (FOUC)

**What goes wrong:** Page briefly shows wrong theme (usually light) before switching to correct theme, causing visual flash.
**Why it happens:** SSR generates HTML without knowing user's theme preference. Client-side JavaScript loads theme from localStorage after initial render, triggering re-render.
**How to avoid:**

- Use next-themes library (handles this automatically)
- Add suppressHydrationWarning to <html> tag in layout.tsx
- Set disableTransitionOnChange in ThemeProvider to prevent animation flash
- Ensure ThemeProvider wraps all themed content
  **Warning signs:** Brief white flash on page load in dark mode, hydration mismatch warnings, theme "pops" after load.

### Pitfall 5: node_modules Volume Mismatch

**What goes wrong:** Dependencies missing in container, "Cannot find module" errors, or host's node_modules pollutes container.
**Why it happens:** Bind mount (./:/app) overwrites container's /app/node_modules with host's (which may be empty or for wrong architecture).
**How to avoid:**

- Add /app/node_modules as anonymous volume in docker-compose.yml
- Never COPY package.json and run bun install in dev stage, only in build stage
- Use .dockerignore to exclude node_modules from build context
- Run bun install inside container, not on host
  **Warning signs:** "Module not found" errors after docker compose up, missing dependencies, native module errors.

### Pitfall 6: shadcn/ui Components Don't Style Correctly

**What goes wrong:** Components render but have no styles, wrong colors, or broken layouts.
**Why it happens:** Tailwind CSS not configured properly, missing cn() utility, or components.json paths incorrect.
**How to avoid:**

- Run bunx shadcn@latest init before adding components (sets up Tailwind config)
- Verify tailwind.config.ts includes content paths for app/ and components/
- Ensure lib/utils.ts exports cn() function (auto-created by shadcn init)
- Check components.json has correct aliases (@/components, @/lib)
  **Warning signs:** Unstyled buttons/cards, missing colors, layout issues, Tailwind classes not applying.

### Pitfall 7: Vercel Deploys develop Branch

**What goes wrong:** Develop branch commits trigger production deployments, main branch not protected.
**Why it happens:** Vercel defaults to auto-deploying all branches connected to GitHub.
**How to avoid:**

- Set Production Branch to "main" in Vercel dashboard (Settings > Git)
- Add vercel.json with git.deploymentEnabled config (see Pattern 8)
- Enable branch protection on main in GitHub (require PR + passing checks)
- Set develop as default branch in GitHub (Settings > Branches)
  **Warning signs:** Unexpected production deployments, develop commits go live, main branch can be pushed directly.

### Pitfall 8: ESLint and Prettier Conflict

**What goes wrong:** Linting fails with contradictory errors, auto-formatting breaks linting, or vice versa.
**Why it happens:** ESLint formatting rules (e.g., max-len, quotes) conflict with Prettier's decisions.
**How to avoid:**

- Install eslint-config-prettier and add it LAST in extends array
- Never use eslint-plugin-prettier (mixes responsibilities)
- Use Prettier for formatting, ESLint for correctness
- Run "prettier --write ." before "eslint ."
  **Warning signs:** Linting passes then fails after formatting, contradictory rule errors, formatting wars in PRs.

### Pitfall 9: Docker Image Size Bloats

**What goes wrong:** Docker images are 2-5GB+, slow to build and deploy.
**Why it happens:** Copying unnecessary files (node_modules, .next, .git) into image, no multi-stage build, missing .dockerignore.
**How to avoid:**

- Use multi-stage Dockerfile (dev, build, production stages)
- Create .dockerignore excluding node_modules, .next, .git, .env\*, README, docs
- Only COPY necessary files in production stage
- Use oven/bun:1-alpine for smaller base image in production
  **Warning signs:** Long build times, huge image sizes, slow deployments, high storage costs.

### Pitfall 10: GitHub Actions Fails but Merge Allowed

**What goes wrong:** PRs can merge to main even when CI checks fail, broken code reaches production.
**Why it happens:** Branch protection rules not configured, or status checks not marked as required.
**How to avoid:**

- Enable branch protection on main (Settings > Branches > Add rule)
- Check "Require status checks to pass before merging"
- Add CI workflow job name to required checks list (e.g., "lint-typecheck-build")
- Check "Require branches to be up to date before merging"
  **Warning signs:** Failed CI doesn't block merge, red X on PR but merge button green, broken builds in main.

## Code Examples

Verified patterns from official sources and community best practices:

### Multi-Stage Dockerfile for Bun + Next.js

```dockerfile
# Dockerfile
# Development stage (target: dev)
FROM oven/bun:1 AS dev
WORKDIR /app
EXPOSE 3000
CMD ["bun", "--bun", "run", "dev"]

# Dependencies stage
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build stage
FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/bun.lockb ./bun.lockb
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
RUN bun install --frozen-lockfile --production
EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Complete .dockerignore

```
# .dockerignore
node_modules
.next
.git
.gitignore
.env*
!.env.example
README.md
LICENSE
.vscode
.idea
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.swp
*.swo
coverage
.cache
dist
build
```

### ESLint + Prettier Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier" // Must be last
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}

// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}

// package.json scripts
{
  "scripts": {
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

### Complete Tailwind Config with Custom Colors

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "corporate-blue": "#003F75",
        "tech-blue": "#2884BD",
        turquoise: "#0FACB0",
        "soft-black": "#1A1A1A",
        graphite: "#696969",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Branch Protection via GitHub CLI

```bash
# Enable branch protection with required checks
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[checks][][context]=lint-typecheck-build \
  --field required_pull_request_reviews[required_approving_review_count]=0 \
  --field enforce_admins=true \
  --field restrictions=null
```

## State of the Art

| Old Approach                | Current Approach         | When Changed       | Impact                                                           |
| --------------------------- | ------------------------ | ------------------ | ---------------------------------------------------------------- |
| npm                         | Bun                      | 2023-2024          | 2-4x faster installs, native TypeScript, drop-in replacement     |
| Pages Router                | App Router               | Next.js 13 (2022)  | React Server Components, better data fetching, nested layouts    |
| Manual font loading         | next/font                | Next.js 13 (2022)  | Auto self-hosting, zero layout shift, better performance         |
| Styled Components / Emotion | Tailwind CSS + shadcn/ui | 2023-2024          | Smaller bundle, better DX, no runtime CSS-in-JS cost             |
| Firebase / Supabase         | Convex                   | 2024-2025          | Better type safety, reactive by default, simpler DX              |
| Custom dark mode            | next-themes              | 2021+ (stable)     | Zero-flicker SSR, system preference, localStorage, battle-tested |
| Tailwind config colors      | @theme directive         | Tailwind v4 (2024) | CSS variables, better DX, easier theming                         |
| Manual Docker setup         | Docker Compose           | Always standard    | Multi-service orchestration, reproducible environments           |

**Deprecated/outdated:**

- **getServerSideProps / getStaticProps**: Use App Router Server Components and fetch() instead.
- **\_app.tsx / \_document.tsx**: Use app/layout.tsx and app/template.tsx in App Router.
- **next/image (old API)**: Next.js 13+ uses simplified <Image> component (same import, different props).
- **@next/font**: Renamed to next/font in Next.js 13.
- **Manual Tailwind CSS variable definitions**: Tailwind v4 uses @theme directive instead of extend in config.

## Open Questions

Things that couldn't be fully resolved:

1. **Bun + Convex Dev in Docker**
   - What we know: Convex CLI works with bunx convex dev, official Bun Docker image exists
   - What's unclear: Optimal command for running Convex dev server in Docker (bunx vs bun x vs dedicated service)
   - Recommendation: Start with bunx convex dev in separate service, validate connection, may need CONVEX_DEPLOYMENT env var

2. **Tailwind v4 Adoption Timeline**
   - What we know: Tailwind v4 is available with @theme directive for CSS variables
   - What's unclear: Whether shadcn/ui fully supports v4 or requires v3
   - Recommendation: Start with Tailwind v3 (known compatible), migrate to v4 later if needed

3. **Docker on Windows Performance**
   - What we know: Docker Desktop on Windows/Mac has performance issues compared to Linux, hot reload can be slow
   - What's unclear: Whether WSL2 mitigates issues enough for acceptable DX
   - Recommendation: Test locally, may need to adjust polling intervals (WATCHPACK_POLLING, CHOKIDAR_INTERVAL)

4. **Vercel Environment Variables in Docker**
   - What we know: Vercel injects env vars at build time, Docker needs them at runtime
   - What's unclear: Best practice for syncing .env.local with Vercel dashboard for consistency
   - Recommendation: Use vercel env pull to sync, document required vars in README, validate with zod

5. **Branch Protection Automation**
   - What we know: Branch protection can be configured via GitHub UI or API
   - What's unclear: Whether to script it (gh CLI) or document manual steps
   - Recommendation: Document manual setup steps, optionally script with gh CLI for repeatability

## Sources

### Primary (HIGH confidence)

- [Next.js Docs: App Router](https://nextjs.org/docs/app) - Official Next.js documentation
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next) - Official shadcn/ui docs
- [Convex Developer Hub](https://docs.convex.dev/quickstart/nextjs) - Official Convex docs
- [Bun Docker Guide](https://bun.com/docs/guides/ecosystem/docker) - Official Bun documentation
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - Library source and documentation
- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/) - Official spec
- [Docker Compose Networking](https://docs.docker.com/compose/how-tos/networking/) - Official Docker docs
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) - Official GitHub docs

### Secondary (MEDIUM confidence)

- [Docker Next.js Hot Reload (2026)](https://thelinuxcode.com/nextjs-docker-images-how-i-build-predictable-fast-deployments-in-2026/) - TheLinuxCode
- [Next.js ESLint Guide (2026)](https://thelinuxcode.com/nextjs-eslint-a-practical-modern-guide-for-2026/) - TheLinuxCode
- [Bun Docker Setup (Medium)](https://alireza-farokhi.medium.com/how-to-deploy-a-next-js-app-with-bun-docker-and-postgressql-ee33bf2e9ec8) - Community guide
- [Convex Next.js Initialization Guide](https://www.schemets.com/blog/convex-nextjs-initialization-guide-app-router) - Schemets blog
- [Understanding FOUC in Next.js (2025)](https://dev.to/amritapadhy/understanding-fixing-fouc-in-nextjs-app-router-2025-guide-ojk) - DEV Community
- [Vercel GitHub Actions Guide](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) - Vercel KB
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - Official docs
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors) - Official Tailwind docs

### Tertiary (LOW confidence)

- Various Stack Overflow threads and GitHub issues for troubleshooting patterns
- Community blog posts for Docker Compose examples (validated against official docs)
- Medium articles for real-world implementation experiences (marked for validation)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries verified via official sources, versions current for 2026
- Architecture: MEDIUM - Patterns validated via official docs and community, some Docker details need testing
- Pitfalls: MEDIUM - Common issues documented across multiple sources, but project-specific edge cases may exist
- Code examples: HIGH - All examples based on official documentation or verified community patterns
- Open questions: LOW - Items needing hands-on validation during implementation

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days - stable ecosystem, Next.js/Convex are mature)

**Verification notes:**

- Next.js 14/15 and App Router patterns confirmed via official docs and multiple sources
- Bun + Docker integration verified via official Bun docs and 2026 articles
- Convex integration patterns validated via official Convex Developer Hub
- shadcn/ui installation and usage confirmed via official documentation
- next-themes implementation verified via GitHub repo and multiple implementation guides
- Docker hot reload solutions validated across multiple sources with consistent WATCHPACK_POLLING recommendation
- GitHub Actions and Vercel deployment patterns confirmed via official documentation

**Constraints from CONTEXT.md applied:**

- Dark mode behavior: 2-state toggle (light/dark) only, no system return option
- Component library: Pre-install Button, Card, Input, Form, Dialog, Toast, Avatar, Badge
- Brand colors: Custom palette with specific hex values defined
- Port allocation: 3400 (Next.js), 3410 (Convex), within 3400-3499 range
- Container naming: jpgerton-\* prefix for all containers and volumes
- Network: Single network named jpgerton-network
- Font: Inter via next/font/google (automatic self-hosting)
- Border radius: Medium (8-12px) across components
- Branch strategy: develop as default working branch, main protected for production
- CI: Runs on all PRs, requires passing checks before merge
- Deployment: Vercel on merge to main only, not develop commits
