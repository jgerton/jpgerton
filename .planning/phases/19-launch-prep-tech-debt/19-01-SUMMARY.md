---
phase: 19-launch-prep-tech-debt
plan: 01
subsystem: seo
tags: [opengraph, robots.txt, next.js, metadata, social-sharing]

# Dependency graph
requires:
  - phase: 17-blog-public-pages
    provides: Blog OG image pattern via ImageResponse
provides:
  - Default site-wide OG image (1200x630 PNG) for all non-blog pages
  - Updated robots.txt allowing all public routes (only /admin/ disallowed)
  - Cleaned metadata in layout.tsx (removed static OG image references)
affects: [seo-audit, social-sharing-validation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "File-convention opengraph-image.tsx at app root provides default OG image"
    - "Next.js metadata inheritance - file-convention replaces static openGraph.images"

key-files:
  created:
    - app/opengraph-image.tsx
  modified:
    - app/layout.tsx
    - app/robots.ts

key-decisions:
  - "Default OG image uses same blue gradient branding as blog posts"
  - "Content locked: Jon Gerton, Custom Websites for $500, jpgerton.com"
  - "Only /admin/ disallowed in robots.txt (removed /api/, /login restrictions)"

patterns-established:
  - "ImageResponse pattern: system fonts only, inline styles, flexbox layout"
  - "Minimal professional design - understated branding, not flashy"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 19 Plan 01: SEO Configuration Summary

**Default site-wide OG image with branding and updated robots.txt allowing all public routes for launch**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T16:33:17Z
- **Completed:** 2026-02-07T16:38:36Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created default site-wide OG image (1200x630 PNG) with site branding
- Updated robots.txt to allow crawling of all public routes (/blog, /projects, /services)
- Cleaned layout.tsx metadata to use file-convention pattern
- Deleted obsolete og-image-README.md placeholder

## Task Commits

Each task was committed atomically:

1. **Task 1: Create default OG image and update layout metadata** - `0967d8d` (feat)
2. **Task 2: Update robots.ts to allow all public routes** - `8b93376` (feat)

## Files Created/Modified
- `app/opengraph-image.tsx` - Default site-wide OG image using ImageResponse (1200x630 PNG)
- `app/layout.tsx` - Removed static OG image references from metadata (file-convention provides this)
- `app/robots.ts` - Updated to disallow only /admin/, allow all public routes
- `public/og-image-README.md` - DELETED (replaced by dynamic OG image)
- `public/llms.txt` - UPDATED (build artifact from next-aeo)

## Decisions Made

**1. OG image content (per user decisions - LOCKED):**
- Name: "Jon Gerton" (large, top)
- Tagline: "Custom Websites for $500" (prominent, middle)
- URL: "jpgerton.com" (subtle footer, lower opacity)

**2. Design matching blog OG images:**
- Used same gradient: `linear-gradient(135deg, #003F75 0%, #2884BD 100%)`
- System fonts only (sans-serif) to stay under 500KB bundle limit
- Minimal professional design - understated, not flashy

**3. Robots.txt scope reduction:**
- Removed /api/ from disallow list (public API routes can be indexed)
- Removed /login from disallow list (no sensitive data on login page)
- Only /admin/ remains disallowed (protects admin interface from search engines)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Unrelated file changes:**
- Found cta-button.tsx had changes from a future phase (blog engagement tracking)
- Restored file to clean state before committing Task 2
- Only staged robots.ts for the robots.txt commit

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for launch:**
- Default OG image appears on all pages without post-specific images
- Social sharing preview works for home, projects, services, about, contact pages
- Search engines can crawl all public routes
- Blog post OG images still override the default (existing behavior preserved)

**Verification in production:**
- Test social sharing preview in Facebook Debugger, Twitter Card Validator
- Verify robots.txt serves correctly at /robots.txt
- Check OG image generates at /opengraph-image (1200x630 PNG)

---
*Phase: 19-launch-prep-tech-debt*
*Completed: 2026-02-07*
