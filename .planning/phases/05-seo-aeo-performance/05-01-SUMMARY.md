---
phase: 05
plan: 01
subsystem: seo-metadata
tags: [seo, open-graph, twitter-cards, metadata, next.js]
dependency-graph:
  requires: []
  provides: [metadataBase, siteConfig, og-tags, twitter-cards]
  affects: [05-02, 05-03, 05-04, 05-05, 05-06]
tech-stack:
  added: [schema-dts, "@next/third-parties", "@vercel/analytics", next-aeo]
  patterns: [centralized-config, metadata-inheritance]
key-files:
  created: [lib/site-config.ts]
  modified: [package.json, app/layout.tsx, components/calendly/calendly-button.tsx]
decisions:
  - id: siteConfig-as-const
    choice: "Use 'as const' for type safety with spread for mutable contexts"
    rationale: "Maintains type safety while satisfying Next.js metadata API"
metrics:
  duration: 5min
  completed: 2026-02-04
---

# Phase 5 Plan 1: Root Metadata & OG Setup Summary

Installed SEO/AEO packages and configured comprehensive root metadata with Open Graph tags for social sharing.

## One-Liner

Centralized siteConfig with metadataBase, Open Graph, and Twitter card defaults using schema-dts and analytics packages.

## What Was Built

### Task 1: Install SEO and Analytics packages
Installed four packages for Phase 5 SEO/AEO work:
- **schema-dts**: Type-safe JSON-LD schema markup (Google-maintained)
- **@next/third-parties**: Optimized GA4 integration for Next.js
- **@vercel/analytics**: Web Vitals tracking for Vercel deployments
- **next-aeo**: Automatic llms.txt generation for AI assistants

### Task 2: Create site configuration file
Created `lib/site-config.ts` as single source of truth:
- Site name, short name, description
- Author info (name, email, job title, social links)
- Keywords array for SEO
- Locale and theme color settings
- Uses `as const` for type inference

### Task 3: Update root layout with comprehensive metadata
Updated `app/layout.tsx` with full SEO configuration:
- **metadataBase**: Resolves relative URLs to absolute for OG images
- **title template**: `%s | Jon Gerton` for child page inheritance
- **Open Graph**: type, locale, url, siteName, images
- **Twitter cards**: summary_large_image with creator handle
- **robots**: Index in production only, always follow
- **icons**: favicon.ico and apple-touch-icon.png references

## Key Files

| File | Purpose |
|------|---------|
| `lib/site-config.ts` | Centralized site configuration |
| `app/layout.tsx` | Root metadata with OG and Twitter |
| `package.json` | SEO/AEO package dependencies |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] CalendlyButton document.body SSR crash**
- **Found during:** Task 3 build verification
- **Issue:** `document.body` accessed directly in render, causing "document is not defined" during static generation
- **Fix:** Added mounted state with useEffect to defer document access until client-side hydration
- **Files modified:** `components/calendly/calendly-button.tsx`
- **Commit:** d8e5119

**2. [Rule 3 - Blocking] Stray file with corrupted path**
- **Found during:** Task 2 type-check
- **Issue:** File named `E:Projectswp-designerconvexadmin.ts` (corrupted path from previous session) caused TypeScript errors
- **Fix:** Removed the stray file
- **Files removed:** `E:Projectswp-designerconvexadmin.ts`

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Spread keywords array | `[...siteConfig.keywords]` | `as const` makes array readonly, but Next.js metadata expects mutable `string[]` |
| Placeholder OG image | Reference `/og-image.jpg` | File will be created in Plan 05-03 (image generation) |
| Production-only indexing | `index: process.env.NODE_ENV === "production"` | Prevents dev/preview deployments from being indexed |

## Commit Log

| Hash | Message |
|------|---------|
| 6157d27 | chore(05-01): install SEO and analytics packages |
| 9aa326c | feat(05-01): create centralized site configuration |
| d8e5119 | feat(05-01): add comprehensive SEO metadata to root layout |

## Verification Results

- [x] `bun run type-check` passes
- [x] `bun run build` succeeds (20 pages generated)
- [x] All 4 packages in package.json dependencies
- [x] siteConfig exports author, name, url, keywords
- [x] metadataBase set to siteConfig.url
- [x] Open Graph and Twitter card configuration complete

## Next Phase Readiness

**Blockers:** None

**Ready for:**
- 05-02: JSON-LD schema markup (uses schema-dts)
- 05-03: OG image generation (creates /og-image.jpg)
- 05-04: AEO llms.txt (uses next-aeo)
- 05-05: Analytics integration (uses @next/third-parties, @vercel/analytics)
