# Requirements: jpgerton.com

**Defined:** 2026-02-06
**Core Value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.

## v1.2 Requirements

Requirements for v1.2 Content Layer + Launch. Each maps to roadmap phases.

### Blog System

- [ ] **BLOG-01**: User can create blog post with title, excerpt, and markdown content in admin
- [ ] **BLOG-02**: User can edit and delete own blog posts in admin
- [ ] **BLOG-03**: Blog post has draft/published status with publish date tracking
- [ ] **BLOG-04**: Blog post slug auto-generates from title with manual override
- [ ] **BLOG-05**: Slug uniqueness enforced server-side with auto-suffix on collision
- [ ] **BLOG-06**: Blog post can have a cover image (Convex storage)
- [ ] **BLOG-07**: Admin markdown editor with live preview
- [ ] **BLOG-08**: Blog posts have category assignment (Local Business, Technical, Announcement)
- [ ] **BLOG-09**: Public blog list page with category filtering
- [ ] **BLOG-10**: Public blog detail page with server-side markdown rendering
- [ ] **BLOG-11**: Code blocks render with syntax highlighting (server-side rehype-highlight)
- [ ] **BLOG-12**: Blog list uses cursor-based pagination (Convex `.paginate()`)
- [ ] **BLOG-13**: Draft posts not accessible via direct URL on public site

### Case Studies

- [ ] **CASE-01**: Admin can create case study linked to existing project
- [ ] **CASE-02**: Case study has problem, solution, and results sections with markdown content
- [ ] **CASE-03**: Case study has quantitative metrics display
- [ ] **CASE-04**: Admin can edit and delete case studies
- [ ] **CASE-05**: Admin can reorder case studies via drag-and-drop
- [ ] **CASE-06**: Public project pages display linked case study using CaseStudyVisual component
- [ ] **CASE-07**: Case study data replaces all hardcoded placeholder content

### Launch Prep

- [ ] **LNCH-01**: Default OG image (1200x630) created and configured for all pages
- [ ] **LNCH-02**: GA4 measurement ID set via NEXT_PUBLIC_GA_ID environment variable
- [ ] **LNCH-03**: noindex meta tag removed, site indexable by search engines

### Tech Debt

- [ ] **DEBT-01**: Orphaned HeroSection component removed
- [ ] **DEBT-02**: Hardcoded values extracted to configuration (Calendly URL, contract placeholders)

## Future Requirements

Deferred to later milestones. Tracked but not in current roadmap.

### Testimonials

- **TEST-01**: Admin can create testimonial with quote, name, title, company, and photo
- **TEST-02**: Admin can mark testimonials as featured and reorder via drag-and-drop
- **TEST-03**: Public pages display testimonials using existing TestimonialCard component

### Blog Enhancements

- **BLGE-01**: Auto-generated OG images per blog post (next/og ImageResponse)
- **BLGE-02**: Per-post SEO metadata (generateMetadata, Article schema, canonical URLs)
- **BLGE-03**: RSS feed for blog posts
- **BLGE-04**: Sitemap updates for blog posts

## Out of Scope

| Feature | Reason |
|---------|--------|
| Tag system for blog | Duplicate content risk, categories sufficient for dual-audience |
| Comment system | Spam and moderation burden, no clear value for portfolio site |
| Infinite scroll | Breaks back button, bad for SEO and accessibility |
| Multi-author support | Single-author site, YAGNI |
| Newsletter integration | Separate concern, defer until audience exists |
| WYSIWYG editor | Heavyweight, not markdown-first, worse DX |
| CMS platform (Contentful, Sanity) | $0 budget constraint, Convex covers all needs |
| Framer Motion | Already decided CSS-only animations in v1.1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BLOG-01 | Phase 15 | Complete |
| BLOG-02 | Phase 16 | Pending |
| BLOG-03 | Phase 15 | Complete |
| BLOG-04 | Phase 15 | Complete |
| BLOG-05 | Phase 15 | Complete |
| BLOG-06 | Phase 15 | Complete |
| BLOG-07 | Phase 16 | Pending |
| BLOG-08 | Phase 15 | Complete |
| BLOG-09 | Phase 17 | Pending |
| BLOG-10 | Phase 17 | Pending |
| BLOG-11 | Phase 17 | Pending |
| BLOG-12 | Phase 17 | Pending |
| BLOG-13 | Phase 17 | Pending |
| CASE-01 | Phase 15 | Complete |
| CASE-02 | Phase 15 | Complete |
| CASE-03 | Phase 15 | Complete |
| CASE-04 | Phase 16 | Pending |
| CASE-05 | Phase 16 | Pending |
| CASE-06 | Phase 18 | Pending |
| CASE-07 | Phase 18 | Pending |
| LNCH-01 | Phase 19 | Pending |
| LNCH-02 | Phase 19 | Pending |
| LNCH-03 | Phase 19 | Pending |
| DEBT-01 | Phase 19 | Pending |
| DEBT-02 | Phase 16 | Pending |

**Coverage:**
- v1.2 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0
- Coverage: 100%

---
*Requirements defined: 2026-02-06*
*Last updated: 2026-02-07 (Phase 15 complete)*
