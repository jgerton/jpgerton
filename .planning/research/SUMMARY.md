# Project Research Summary

**Project:** jpgerton.com v1.2 Content Layer + Launch
**Domain:** Blog System, Content Management & Launch Prep (Next.js 14 + Convex + Tailwind v4)
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

The v1.1 site ships with a polished design system (Lighthouse 100, WCAG AA, custom typography, CSS-only animations) but relies on placeholder data for testimonials and case studies, and has no blog. For someone selling web design services to local businesses while showcasing technical depth to hiring managers, this content gap undermines credibility and blocks SEO-driven growth.

The research reveals a clear architecture: extend the proven Convex CRUD patterns (from projects table) to three new content types (blog posts, testimonials, case studies), render markdown server-side for SEO, and use the existing composition components (TestimonialCard, CaseStudyVisual) with real data. The stack additions are minimal: react-markdown + remark/rehype for rendering (~33KB), @uiw/react-md-editor for admin editing (~4.6KB, admin-only), slugify + dayjs for utilities. Total bundle impact: ~50KB, well within Lighthouse 100 tolerance.

The critical risks are: (1) performance regression from code syntax highlighting (full highlight.js = 500KB, must use server-side selective imports), (2) Convex free tier overrun from naive pagination (use cursor-based `.paginate()`, not `.collect()` + slice), and (3) XSS from markdown rendering (use react-markdown, never `dangerouslySetInnerHTML`). The dual constraint of maintaining existing quality while adding dynamic features makes careful architecture essential.

## Key Findings

### Recommended Stack (from STACK.md)

**New Dependencies (6 packages, ~50KB total):**

- **react-markdown** (^10.1.0) - Safe-by-default markdown rendering to React components, CommonMark/GFM compliant, ~20KB gzipped
- **remark-gfm** (^4.0.0) - GitHub Flavored Markdown (tables, task lists, strikethrough), ~5KB
- **rehype-highlight** (^7.0.0) - Server-side code syntax highlighting, lighter than Prism.js (2KB core), SSR-friendly, ~8KB
- **@uiw/react-md-editor** (^4.0.11) - Markdown editor with live preview for admin, smallest full-featured option (4.6KB), admin-only via code splitting
- **slugify** (^1.6.6) - URL-safe slug generation from titles, handles Unicode
- **dayjs** (^1.11.13) - Lightweight date formatting (6KB vs date-fns 18KB)

**Already Validated Stack (Maintain):**

- Convex (all backend: schema, CRUD, pagination, search, file storage, auth)
- Next.js 14 App Router (SSR, generateMetadata, dynamic routes, OG images)
- Tailwind v4 + shadcn/ui (existing design system, composition components)
- Existing composition components: TestimonialCard, CaseStudyVisual, SocialProofDisplay

**What NOT to use:**

- CMS platforms (Contentful, Sanity) - $0 budget constraint, Convex covers all needs
- Framer Motion - already decided CSS-only in v1.1, no animation library
- Shiki syntax highlighter - 280KB + WASM, breaks Lighthouse 100 target
- WYSIWYG editors (TinyMCE, CKEditor) - heavyweight, not markdown-first

### Expected Features (from FEATURES.md)

**P0 - Must Ship in v1.2:**

1. Blog posts CRUD (Convex schema, admin editor with markdown preview, list/detail pages)
2. Category filtering (dual-audience: "Local Business" vs "Technical" vs "Announcement")
3. Testimonials CRUD (admin + public display using existing TestimonialCard)
4. Case studies CRUD (admin + public display using existing CaseStudyVisual)
5. SEO per blog post (generateMetadata, Article schema, canonical URLs)
6. Auto-generated OG images (next/og ImageResponse, dynamic per post)
7. Syntax highlighting (server-side rehype-highlight, selective language imports)
8. Draft/publish workflow, slug auto-generation with manual override
9. Default OG image for non-blog pages
10. Site-wide structured data (Organization + WebSite schema)

**Anti-Features (Avoid):**

- Tag system (duplicate content risk, categories sufficient)
- Comment system (spam, moderation burden)
- Infinite scroll (breaks back button, SEO, accessibility)
- Multi-author support (YAGNI for single author)
- Newsletter integration (separate concern, defer)

**MVP Rationale:** Gets blog live for SEO content marketing, activates existing placeholder components, completes the site's content foundation.

### Architecture Approach (from ARCHITECTURE.md)

**Three New Convex Tables:**

```
blogPosts:   title, slug, excerpt, content (markdown), coverImageId, authorId, status, publishedAt, tags, displayOrder
testimonials: quote, name, title, company, photoId, featured, displayOrder
caseStudies:  projectId (linked), problemHeading/Content, solutionHeading/Content, resultsHeading/Content, metrics
```

**Key Architectural Patterns:**

1. **Server-side markdown rendering** - unified/remark/rehype pipeline in Server Components (SEO, no client JS)
2. **Convex storage for images** - generateUploadUrl pattern (already proven in projects), free CDN
3. **Slug generation + validation** - Server-side in mutations, uniqueness check via index
4. **SEO metadata generation** - generateMetadata() with canonical URLs, OG images per post
5. **Admin CRUD with dnd-kit** - Replicate existing SortableProjectList pattern for all 3 content types

**Component Strategy:**

- New: BlogPostCard, BlogPostContent, BlogPostMeta, MarkdownEditor, SortableBlogList
- Modified: admin-tabs.tsx (+3 tabs), projects/[slug] (real case study data), about page (real testimonials), home page (+Latest Posts section)
- Unchanged: TestimonialCard, CaseStudyVisual, SocialProofDisplay (already accept props)

**Build Order:**

```
Phase 1: Foundation (Schema + Queries)     - unblocks everything
Phase 2: Admin UI (CRUD)                   - enables content creation
Phase 3: Public Blog Pages (SEO)           - renders content, markdown pipeline
Phase 4: Integration (existing pages)      - wires real data to existing components
Phase 5: Launch Prep (OG, analytics, 404)  - production readiness
```

### Critical Pitfalls (from PITFALLS.md)

**Top 5 Most Dangerous:**

1. **Convex free tier overrun** (CRITICAL) - Using `.collect()` for pagination exhausts 1M calls/month. Fix: cursor-based `.paginate()` with indexes. Projected usage: ~32K calls/month (3% of limit), safe.

2. **XSS in markdown rendering** (CRITICAL) - `dangerouslySetInnerHTML` + unsanitized markdown = session hijacking. Fix: react-markdown (auto-sanitized, renders to React components). Never use `dangerouslySetInnerHTML`.

3. **Code highlighter bundle explosion** (HIGH) - Full highlight.js = 500KB, Lighthouse drops to 70. Fix: server-side rehype-highlight with specific language imports only (JS, TS, CSS, Bash).

4. **Slug collision** (HIGH) - Duplicate slugs overwrite posts silently. Fix: server-side uniqueness check in Convex mutation, auto-suffix on collision.

5. **Placeholder data not migrated** (HIGH) - Blog launches but TestimonialCard/CaseStudyVisual still use hardcoded data. Fix: explicit migration phase, QA checklist.

**Integration-Specific Warnings:**

- `fetchQuery` in Server Components, `useQuery` only in Client Components
- Tailwind v4: `@tailwindcss/typography` may not be compatible, define custom prose styles
- Code blocks must override `font-serif` inheritance with explicit `font-mono`
- Draft posts must check status in query, not just UI (prevent direct URL access)

**Performance Budget:**

| Metric | Current (v1.1) | After Blog | Target |
|--------|---------------|------------|--------|
| LCP | 132ms | ~150ms | <200ms |
| CLS | 0 | 0 | 0 |
| INP | 24ms | ~30ms | <50ms |
| Bundle | ~120KB | ~170KB | <250KB |
| Lighthouse | 100 | 98-100 | 95+ |

## Implications for Roadmap

### Phase Structure (5-6 Phases Recommended)

The research strongly suggests a foundation-up approach: schema and queries first, then admin CRUD (to enable content creation), then public-facing pages, then integration with existing components, and finally launch prep.

### Phase 1: Content Schema + Backend
**Delivers:** 3 new Convex tables, all queries/mutations, indexes, auth checks
**Rationale:** Unblocks all other phases. Follow existing projects.ts pattern.

### Phase 2: Admin Content Management
**Delivers:** Blog editor with markdown preview, testimonials CRUD, case studies CRUD, 3 new admin tabs
**Rationale:** Must create content before building public pages. Reuses dnd-kit patterns.

### Phase 3: Public Blog Pages
**Delivers:** /blog list, /blog/[slug] detail, markdown rendering pipeline, SEO metadata, syntax highlighting
**Rationale:** Core milestone deliverable. Server-side rendering for SEO.

### Phase 4: Content Integration
**Delivers:** Real testimonials on about page, real case studies on project pages, latest posts on home page
**Rationale:** Replaces all placeholder data with dynamic Convex queries.

### Phase 5: Launch Prep + Polish
**Delivers:** OG image generation, site-wide schema, 404 page, analytics config, RSS/sitemap updates
**Rationale:** Production readiness. Must ship before going live.

### Optional Phase 6: Tech Debt Cleanup
**Delivers:** Remove orphaned HeroSection, move Calendly URL to env var, fill contract placeholders
**Rationale:** From v1.1 audit findings. Low risk, high polish.

### Research Flags

**No phases need additional research.** All patterns are well-documented:
- Convex CRUD: proven pattern from projects table
- Markdown rendering: react-markdown + unified ecosystem is standard
- OG images: Next.js built-in ImageResponse API
- Admin patterns: replicate existing SortableProjectList

### Decisions Needed from Jon

1. Analytics platform: GA4 (free, complex) vs Plausible (paid, simple)
2. Confirm category-only approach (no tags) for blog
3. Which of the 6 projects get full case study treatment first

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Minimal additions, all verified via npm + official docs. react-markdown (10M+ downloads), rehype ecosystem mature. |
| **Features** | HIGH | MVP scoped tightly to content CRUD + blog. Anti-features clearly documented. Leverages existing composition components. |
| **Architecture** | HIGH | Extends proven Convex patterns. Server-side markdown is standard Next.js 14 pattern. Schema design follows existing projects table. |
| **Pitfalls** | HIGH | Convex free tier impact calculated (3% usage). Security approach validated (react-markdown auto-sanitizes). Performance budget has 80KB headroom. |

**Overall Confidence: HIGH**

All four research dimensions converge on consistent recommendations:
- Extend existing patterns (Convex CRUD, admin layout, composition components)
- Server-first rendering (SEO, performance, security)
- Minimal dependencies (~50KB total addition)
- Foundation-up build order (schema -> admin -> public -> integration -> launch)

### Gaps to Address

1. **Analytics platform choice** - Deferred to Jon's preference, config-only implementation
2. **Initial content** - Need first blog posts, testimonial collection, case study selection
3. **Tailwind v4 prose styling** - May need custom prose classes if @tailwindcss/typography incompatible
4. **OG image Edge Runtime limits** - Test on Vercel free tier during implementation

## Sources

See individual research files for comprehensive source lists:
- **STACK.md** - 15 sources (npm packages, comparison articles, Convex/Next.js docs)
- **FEATURES.md** - 25 sources (portfolio best practices, SEO, CMS patterns, markdown editors)
- **ARCHITECTURE.md** - 12 sources (Convex docs, Next.js patterns, markdown processing)
- **PITFALLS.md** - 30 sources (security, performance, SEO, Convex migrations, Vercel pricing)

---

*Research completed: 2026-02-06*
*Ready for roadmap: YES*

**Next Steps:**
1. Commit research files
2. Create v1.2 roadmap with phase breakdown
3. Begin Phase 1 (Content Schema + Backend)
