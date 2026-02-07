---
phase: 17
plan: 02
subsystem: content
tags: [blog, markdown, seo, og-images, json-ld, sitemap, navigation]
requires:
  - 17-01
  - 15-01
  - 15-02
provides:
  - Blog post detail pages with markdown rendering
  - Syntax-highlighted code blocks in blog posts
  - Dynamic OG images per post
  - JSON-LD structured data for search engines
  - Blog sitemap integration
  - Blog navigation link
affects:
  - Future blog posts automatically get SEO treatment
tech-stack:
  added:
    - react-markdown: Markdown rendering
    - remark-gfm: GitHub Flavored Markdown support
    - rehype-highlight: Syntax highlighting
  patterns:
    - Next.js ImageResponse for dynamic OG images
    - JSON-LD BlogPosting schema
    - Server-rendered markdown with plugins
key-files:
  created:
    - app/blog/[slug]/page.tsx: Blog post detail page with SSR, metadata, JSON-LD
    - app/blog/[slug]/opengraph-image.tsx: Dynamic OG image generator per post
    - components/blog/blog-post-content.tsx: Markdown renderer with syntax highlighting
  modified:
    - app/sitemap.ts: Added /blog and /blog/[slug] URLs
    - components/navigation/site-nav.tsx: Added Blog link
key-decisions:
  - decision: Server Component for BlogPostContent
    rationale: react-markdown is RSC-compatible; no client-side state needed
    context: Task 1
  - decision: Custom prose styles instead of @tailwindcss/typography
    rationale: Full control using existing design tokens; established in Plan 01
    context: Task 1
  - decision: Dynamic OG images via ImageResponse
    rationale: No external service needed; generates at build/runtime; uses gradient branding
    context: Task 2
  - decision: Inline styles only for OG images
    rationale: ImageResponse limitation - no Tailwind, no CSS variables, only flexbox subset
    context: Task 2
  - decision: Blog nav link between Projects and Services
    rationale: Logical flow - portfolio first, then blog, then services/conversion
    context: Task 2
metrics:
  duration: 3 minutes
  completed: 2026-02-07
---

# Phase 17 Plan 02: Blog Post Detail Pages Summary

**One-liner:** Server-rendered blog detail pages with markdown, syntax highlighting, dynamic OG images, JSON-LD schema, and full navigation/sitemap integration.

## Performance

**Execution time:** ~3 minutes
**Started:** 2026-02-07 14:24 UTC
**Completed:** 2026-02-07 14:27 UTC

## Accomplishments

### Blog Post Detail Page
- **Full markdown rendering** with react-markdown, remark-gfm (GitHub Flavored Markdown), and rehype-highlight (syntax highlighting)
- **Server-rendered** blog post detail page at `/blog/[slug]` with Next.js 16 async params pattern
- **Cover image hero** - full-width cinematic ratio (2:1 on mobile, 3:1 on desktop) with gradient fallback if no cover image
- **Prose-width content area** with back link to /blog, title (font-serif H1), meta info (category badge, date, reading time), and markdown content
- **Bottom CTA section** - border-top divider with heading, description, and two buttons (warm CTA + outline)
- **Draft post protection** - `notFound()` for unpublished/deleted posts (handled by getBySlug query filter)

### SEO and Metadata
- **Dynamic metadata per post** - title, description, Open Graph tags (type: article, publishedTime, authors, images)
- **JSON-LD BlogPosting schema** embedded in each post page with headline, description, datePublished, author, publisher
- **Twitter card support** - summary_large_image with title and description
- **generateStaticParams** for ISR - prebuilds published posts at build time

### OG Images
- **Dynamic OG image generator** at `/blog/[slug]/opengraph-image` using Next.js ImageResponse
- **1200x630 PNG** with gradient background (corporate-blue #003F75 to tech-blue #2884BD)
- **Rendered content:** category badge pill, large title (truncated at 80 chars), footer with jpgerton.com and reading time
- **Fallback design** if post not found - Jon Gerton branding with tagline
- **Inline styles only** (ImageResponse limitation - no Tailwind/CSS vars, flexbox subset)

### Sitemap Integration
- Added `/blog` list page to staticPages array (priority 0.8, weekly changeFrequency)
- Added dynamic blog post pages to sitemap with `/blog/[slug]` URLs
- Uses `publishedAt` as lastModified when available, falls back to `_creationTime`
- Priority 0.7, monthly changeFrequency for individual posts

### Navigation
- Added Blog link to site navigation navLinks array
- Positioned between Projects and Services (index 2)
- Uses existing `isActive` logic to highlight when on /blog or /blog/[slug]

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 71ed87e | Create blog post detail page with markdown rendering |
| 2 | fdc8af7 | Add OG images, sitemap integration, and blog nav link |

## Files Created

- `app/blog/[slug]/page.tsx` - Blog post detail page with SSR, metadata, JSON-LD (213 lines)
- `app/blog/[slug]/opengraph-image.tsx` - Dynamic OG image generator (157 lines)
- `components/blog/blog-post-content.tsx` - Markdown renderer (17 lines)

## Files Modified

- `app/sitemap.ts` - Added /blog and blog post URLs
- `components/navigation/site-nav.tsx` - Added Blog link

## Decisions Made

### Server Component for BlogPostContent
**Decision:** BlogPostContent is a Server Component (no "use client" directive).
**Rationale:** react-markdown is RSC-compatible. No client-side state or interactivity needed. Keeps bundle smaller.
**Trade-offs:** None - markdown rendering doesn't need client-side JavaScript.

### Dynamic OG Images via ImageResponse
**Decision:** Generate OG images dynamically using Next.js ImageResponse instead of static images or external service.
**Rationale:** No external dependencies, generates at build/runtime, uses brand gradient colors, includes post-specific data (title, category, reading time).
**Trade-offs:** ImageResponse has CSS limitations (inline styles only, no Tailwind/CSS vars, flexbox subset). Design is simple but effective.

### Inline Styles for OG Images
**Decision:** Use inline style objects for all OG image styling.
**Rationale:** ImageResponse limitation - it doesn't support Tailwind classes or CSS custom properties. Only accepts style objects with a subset of CSS properties.
**Trade-offs:** Less maintainable than Tailwind, but OG image design is simple and unlikely to change frequently.

### Blog Nav Link Placement
**Decision:** Place Blog link between Projects and Services in navigation.
**Rationale:** Logical content flow - portfolio work first, blog content second, then conversion-focused pages (services, contact). Matches user journey from exploration to engagement to conversion.
**Trade-offs:** None - feels natural and follows typical site architecture patterns.

### Custom Prose Styles (from Plan 01)
**Decision:** Use custom prose styles in globals.css instead of @tailwindcss/typography plugin.
**Rationale:** Full control over typography using existing design tokens (font-serif/sans, fluid type scale, color variables). Avoids plugin dependency. Established in Plan 01.
**Impact:** All markdown content (blog posts, future content types) uses consistent typography aligned with design system.

## Deviations from Plan

None - plan executed exactly as written.

## Issues / Concerns

None. All verification criteria passed:
- TypeScript type-check passes
- ESLint passes (unescaped apostrophe fixed)
- Blog post detail page renders markdown with syntax highlighting
- Cover image displays full-width with gradient fallback
- Meta info, back link, and bottom CTA all present
- JSON-LD BlogPosting schema embedded
- Draft posts return 404 (verified by getBySlug query filtering)
- OG images generate with post-specific content
- Sitemap includes /blog and /blog/[slug] URLs
- Blog link appears in navigation

## Next Phase Readiness

**Phase 17 Complete:** Plans 01 and 02 finished. Blog list and detail pages fully functional with:
- Category filtering and pagination (Plan 01)
- Markdown rendering with syntax highlighting (Plan 02)
- SEO metadata, OG images, JSON-LD schema (Plan 02)
- Sitemap integration and navigation link (Plan 02)

**Ready for Phase 18:** Public blog pages are complete. Admin content management (Phase 16) already shipped. Next phase can proceed with remaining v1.2 work.

**Blog system status:**
- ✅ Backend (Phase 15 - schema, queries, mutations)
- ✅ Admin UI (Phase 16 - create, edit, publish, case study builder)
- ✅ Public pages (Phase 17 - list, detail, SEO, navigation)
- ✅ Content ready - Jon can create blog posts in admin, they'll appear on /blog and /blog/[slug] with full SEO

**No blockers for next phase.**
