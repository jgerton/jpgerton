# Feature Research: Blog System & Content Management

**Domain:** Blog/Content Management for Portfolio/Agency Site
**Project:** jpgerton.com (WordPress services + technical portfolio)
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

Portfolio sites in 2026 use blogs for dual-purpose content marketing: local business SEO (geographic + service keywords) and thought leadership (technical expertise). The research reveals a clear pattern: markdown-based workflows for single authors, minimal admin dashboards, and SEO-first architecture. Testimonials and case studies serve as social proof, often integrated into both dedicated pages and sprinkled throughout case study narratives.

**Key insight:** The blog must serve TWO distinct audiences (local businesses + tech hiring managers) without feeling fragmented. Category-based filtering and different content types (local business guides vs technical deep-dives) solve this elegantly.

---

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| **Blog post list page** | Standard on all blogs | Low | None | Filter by category, sort by date |
| **Individual post pages** | Core reading experience | Low | None | Full markdown rendering, syntax highlighting |
| **Category filtering** | Users expect to browse by topic | Low | Blog posts exist | Essential for dual-audience content |
| **Author byline** | Social proof, credibility | Low | None | Name + photo (even single-author) |
| **Publish date** | Freshness indicator, trust | Low | None | Display + sort capability |
| **SEO metadata** | Bare minimum for discovery | Medium | None | Title, description, OG image per post |
| **Article schema markup** | Google expects this | Low | Blog posts exist | BlogPosting type, author, datePublished |
| **Responsive design** | Mobile-first web (50%+ traffic) | Low | Existing design system | Already handled by Tailwind |
| **Syntax highlighting** | Expected for technical posts | Low | Markdown renderer | react-syntax-highlighter |
| **Testimonial display page** | Social proof expectation | Low | None | Grid/list of all testimonials |
| **Case study detail pages** | Portfolio standard | Medium | Existing CaseStudyVisual component | Challenge/Approach/Results format |
| **Admin CRUD for posts** | Can't rely on Git workflow only | Medium | Convex auth | Create, edit, delete, publish/draft |
| **Admin CRUD for testimonials** | Need to manage social proof | Low | Convex auth | Author, company, quote, photo |
| **Admin CRUD for case studies** | Content management necessity | Medium | Convex auth | Challenge/approach/results + metrics |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| **Markdown live preview editor** | Better DX than WYSIWYG, cleaner output | Medium | @uiw/react-md-editor | Two audiences see "I know markdown" = technical credibility |
| **Dual-audience category system** | Serves both local + tech audiences without fragmentation | Low | Categories table | "Local Business" vs "Technical" top-level categories |
| **Auto-generated OG images** | Unique social share images per post, zero design work | Medium | next/og ImageResponse | Uses post title + category color |
| **Code snippet embedding** | Technical posts need runnable examples | Medium | MDX or react-markdown plugins | Differentiates from local-only competitors |
| **Testimonial attribution richness** | Company name, logo, role, project type | Low | Testimonials schema | Better than "- John D." quotes |
| **Case study metrics display** | Quantified results (50% faster, 10K visitors) | Low | Case studies schema | Separates amateur from pro portfolios |
| **Related posts** | Keeps users engaged, reduces bounce | Medium | Category/tag relationships | Algorithm: same category + recent |
| **Reading time estimate** | UX polish, expected on modern blogs | Low | Word count calculation | ~200 words/minute average |
| **Draft/publish workflow** | Preview before going live | Low | Boolean field in schema | Essential for quality control |
| **Slug customization** | SEO-friendly URLs, brand control | Low | Slug field + validation | Auto-generate from title, allow override |

### Anti-Features (Commonly Requested, Often Problematic)

| Anti-Feature | Why Requested | Why Problematic | Alternative | Priority |
|--------------|---------------|-----------------|-------------|----------|
| **Tag system** | "More ways to organize" | Creates duplicate content, keyword cannibalization, URL explosion | Use categories only, 1 primary category per post | AVOID |
| **Multi-author support** | "Future-proofing" | Complex permissions, workflow overhead, YAGNI for single author | Hard-code author, add later if needed | DEFER |
| **Comment system** | "Engagement!" | Spam magnet, moderation burden, low ROI for portfolio site | Contact form + social media discussion | AVOID |
| **Newsletter integration** | "Build email list" | Separate concern, premium features need $, low open rates | Link to Substack/ConvertKit if needed later | DEFER |
| **Post series/collections** | "Organize related posts" | Adds UI complexity, categories + "Part 1/2/3" in title works | Manual linking in post content | DEFER |
| **Infinite scroll** | "Modern UX" | Breaks back button, kills SEO for pagination, accessibility issues | Simple pagination or "load more" | AVOID |
| **Social share buttons** | "Virality!" | Slow page load (3rd party scripts), low actual usage, privacy concerns | Native browser share API on mobile, copy link | AVOID |
| **View counter** | "Show popularity" | Vanity metric, new posts look unpopular, DB writes on read | Omit entirely, use internal analytics | AVOID |
| **Rich media embedding** | "Embed videos/tweets" | Security risk (XSS), performance hit, breaks when 3rd party changes | Markdown image + link to source | DEFER |
| **Version history** | "Track changes" | Complex UI, storage overhead, Git already does this | Git history is enough for single author | AVOID |

---

## Feature Dependencies

```
Blog System:
  Posts Table (Convex)
    ├─> Admin CRUD UI
    ├─> Public List Page
    │     ├─> Category Filter
    │     └─> Date Sort
    ├─> Public Detail Page
    │     ├─> Markdown Renderer
    │     ├─> Syntax Highlighter
    │     ├─> Article Schema
    │     └─> OG Image Generation
    └─> Admin Editor
          ├─> Markdown Live Preview
          ├─> Slug Auto-generation
          └─> Draft/Publish Toggle

Testimonials System:
  Testimonials Table (Convex)
    ├─> Admin CRUD UI
    ├─> Public Display Page (grid/list)
    └─> Existing TestimonialCard Component (replace placeholder data)

Case Studies System:
  Case Studies Table (Convex)
    ├─> Admin CRUD UI
    ├─> Public Detail Pages
    └─> Existing CaseStudyVisual Component (replace placeholder data)
```

**Critical path:** Posts table → Admin editor → Public list/detail pages → SEO (schema + OG images)

**Existing components to leverage:**
- TestimonialCard (components/portfolio/TestimonialCard.tsx) - already built, just needs real data
- CaseStudyVisual (components/portfolio/CaseStudyVisual.tsx) - already built, just needs real data
- Admin dashboard layout - extends existing Projects CRUD patterns

---

## MVP Definition

### Launch With (v1.2 - This Milestone)

**Blog System:**
- [ ] Posts table (Convex schema: title, slug, content, category, publishedAt, draft)
- [ ] Admin post editor with markdown live preview (@uiw/react-md-editor)
- [ ] Admin post list (draft/published filter, edit/delete actions)
- [ ] Public /blog page (list all published posts, filter by category)
- [ ] Public /blog/[slug] pages (full post, Article schema, syntax highlighting)
- [ ] Category system (Local Business, Technical, Announcement - simple enum)
- [ ] Auto-generated OG images (next/og ImageResponse with title + category color)
- [ ] SEO metadata per post (title tag, meta description, canonical URL)
- [ ] Reading time estimate
- [ ] Slug auto-generation (title → kebab-case, with manual override)

**Testimonials System:**
- [ ] Testimonials table (Convex schema: author, role, company, quote, photoUrl, projectType)
- [ ] Admin testimonials CRUD (create/edit/delete)
- [ ] Public /testimonials page (grid display using existing TestimonialCard)
- [ ] Replace placeholder testimonials in existing components with real data

**Case Studies System:**
- [ ] Case studies table (Convex schema: title, slug, challenge, approach, results, metrics, featured)
- [ ] Admin case studies CRUD (create/edit/delete)
- [ ] Public /case-studies page (list view)
- [ ] Public /case-studies/[slug] pages (detail view using existing CaseStudyVisual)
- [ ] Replace placeholder case studies in existing components with real data

**Launch Prep:**
- [ ] Default OG image for non-blog pages (home, services, about, contact)
- [ ] Site-wide structured data (Organization schema, WebSite schema with sitelinks searchbox)
- [ ] Analytics placeholder (GA4 or Plausible, config only, Jon decides later)
- [ ] 404 page (with helpful navigation back to main sections)

**Rationale for MVP:**
- Gets blog live for SEO content marketing (primary milestone goal)
- Activates existing placeholder components (testimonials, case studies)
- Completes site's content foundation (all major sections live)
- OG images improve social sharing (portfolio visibility)

### Add After Validation (v1.3+)

**Blog Enhancements:**
- [ ] Related posts algorithm (same category, sort by date, limit 3)
- [ ] Tag system (IF category proves insufficient - research first)
- [ ] Search functionality (client-side with Fuse.js or Algolia if traffic justifies)
- [ ] RSS feed (nice-to-have for technical audience)
- [ ] Code snippet copy button (UX polish for technical posts)

**Content Management:**
- [ ] Bulk actions in admin (delete multiple, change category)
- [ ] Image upload for blog posts (currently markdown image URLs only)
- [ ] Testimonial featured toggle (highlight best on homepage)
- [ ] Case study image galleries (currently single hero image)

**Analytics & Optimization:**
- [ ] Popular posts widget (if analytics show traffic patterns)
- [ ] A/B test CTA placements in blog posts
- [ ] Performance monitoring for markdown rendering

### Future Consideration (v2+)

- [ ] Multi-author support (if hiring or guest posts materialize)
- [ ] Newsletter integration (if email list strategy emerges)
- [ ] Comment system (explore Giscus - GitHub Discussions based, free)
- [ ] Content scheduling (publish at future date)
- [ ] Series/collections UI (if post series become common)
- [ ] Internationalization (if serving non-English markets)
- [ ] Video embedding (if creating video content)

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Rationale |
|---------|------------|---------------------|----------|-----------|
| Blog post CRUD | 10 | Medium | P0 | Core milestone deliverable |
| Markdown live preview | 8 | Medium | P0 | DX + credibility for tech audience |
| Category filtering | 9 | Low | P0 | Solves dual-audience problem |
| Auto OG images | 7 | Medium | P0 | Social sharing essential for portfolio visibility |
| Article schema | 9 | Low | P0 | Google SEO table stakes |
| Testimonials CRUD | 8 | Low | P0 | Leverages existing component, social proof |
| Case studies CRUD | 8 | Medium | P0 | Leverages existing component, portfolio depth |
| Syntax highlighting | 9 | Low | P0 | Required for technical posts |
| Reading time | 5 | Low | P1 | Easy win, modern UX expectation |
| Related posts | 6 | Medium | P1 | Engagement, but needs content first |
| Slug customization | 7 | Low | P0 | SEO control essential |
| Draft/publish toggle | 8 | Low | P0 | Quality control necessity |
| Default OG images | 6 | Low | P0 | Complete SEO coverage |
| Site-wide schema | 7 | Low | P0 | Organization + WebSite types |
| RSS feed | 4 | Low | P2 | Nice-to-have for subset of users |
| Search | 5 | High | P2 | YAGNI until content volume justifies |
| Tags | 3 | Medium | P3 | Anti-feature (duplicate content risk) |
| Comments | 2 | High | P3 | Anti-feature (spam, moderation) |
| Newsletter | 5 | High | P2 | Separate concern, defer to 3rd party |

**Priority levels:**
- **P0:** Must ship in v1.2 (this milestone)
- **P1:** Add in v1.3 after initial content published
- **P2:** Evaluate after 3+ months of blog traffic data
- **P3:** Avoid or defer indefinitely

---

## Complexity Estimates

**Low complexity (1-2 hours):**
- Convex schema definitions (posts, testimonials, case studies)
- Admin list views (reuse existing Projects CRUD patterns)
- Category filtering (enum + filter UI)
- Reading time calculation (word count / 200)
- Article schema markup (static JSON-LD)
- Slug generation (simple string transform)
- Draft/publish toggle (boolean field)

**Medium complexity (3-8 hours):**
- Markdown editor with live preview (integrate @uiw/react-md-editor)
- Admin post editor form (validation, auto-save to drafts)
- Public blog list page (layout, filtering, sorting)
- Public blog post pages (markdown rendering, syntax highlighting)
- OG image generation (next/og setup, dynamic rendering)
- Testimonials CRUD (form + validation)
- Case studies CRUD (multi-field form, metrics input)
- Default OG images (template design + generation)

**High complexity (8+ hours):**
- Related posts algorithm (if needs ML/similarity beyond category matching)
- Search functionality (indexing, UI, performance)
- Multi-author permissions (not in scope)
- Comment moderation system (not in scope)

**Total estimated effort for v1.2 MVP:** ~30-40 hours (P0 features only)

---

## Research Findings by Category

### Blog Systems on Portfolio Sites (2026)

**Purpose:** Dual-purpose content marketing
- Local business SEO (geographic + service keywords)
- Thought leadership (technical expertise showcase)
- Consistency > volume (1 quality post/week > 10 rushed posts)

**Content strategy patterns:**
- "Ultimate Guides" and "How-To" posts perform best
- Geographic targeting for local (e.g., "Anchorage WordPress developer")
- Technical depth for hiring managers (e.g., "Next.js 16 performance optimization")
- Google rewards expertise and authentic insights (helpful content update)

**Technical implementation:**
- Markdown-based workflows dominate for single authors
- Live preview expected (WYSIWYG creates messy HTML)
- Static site generation preferred (performance + SEO)
- Next.js App Router + markdown = standard 2026 stack

**SEO requirements:**
- Article schema markup (BlogPosting type)
- author, datePublished, dateModified, headline, image properties
- One primary category per post (avoid tag-based duplicate content)
- Canonical URLs for each post
- OG images (1200x630px, unique per post)
- Sitemap inclusion

**Anti-patterns to avoid:**
- Tag systems that create duplicate content
- Infinite scroll (breaks back button, SEO pagination)
- Feature creep (bloated CMS = slow editing)
- Plugin overload (each adds code, slows site)
- AI-generated shallow content (Google penalizes)

### Markdown Editors (2026)

**Top choices for React/Next.js:**
- **@uiw/react-md-editor:** Lightweight, comment sections + blog editors, fast implementation
- **MDXEditor:** Advanced WYSIWYG, eliminates preview pane, inline formatting
- **react-markdown + SimpleMDE:** Classic split-pane approach

**Implementation pattern:**
- useState for content
- Live preview with react-markdown or MDX
- Syntax highlighting with react-syntax-highlighter
- Auto-save to drafts (prevent content loss)

**Admin dashboard design (2026 trends):**
- Minimalism (show only what matters)
- Content management without coding
- Distraction-free writing environment

### Testimonial Management

**Display patterns:**
- Grid layout for testimonials page (3-column on desktop)
- Sprinkled throughout case studies (quotes at relevant stages)
- Homepage social proof section (3-5 featured)
- "Featured in" badges for authority

**Schema requirements:**
- Author name + role + company (attribution richness)
- Author photo (headshot, builds trust)
- Quote (150-300 words ideal)
- Optional: project type, date, star rating

**Admin needs:**
- Simple CRUD (create/edit/delete)
- Featured toggle (highlight best)
- Photo upload or URL
- No moderation workflow (manually added, not user-submitted)

### Case Study Management

**Structure (universal pattern):**
1. **Challenge:** Client problem, context, stakes
2. **Approach:** Solution, methodology, why this way
3. **Results:** Quantified outcomes, metrics, client quote

**Display patterns:**
- Dedicated case study pages (detail view)
- Portfolio grid (card preview with challenge/result)
- Visual timeline or step-by-step
- Metrics highlighted (badges, large numbers)

**Content elements:**
- Hero image or screenshot
- Client logo + industry
- Tags for filtering (industry, technology, service type)
- Metrics (50% faster, 10K visitors, $5K revenue increase)
- Testimonial quote (integrated in Results section)
- Before/after comparisons

**Admin needs:**
- Multi-field form (title, challenge, approach, results, metrics)
- Slug customization
- Image upload (hero + gallery)
- Featured toggle (homepage display)
- Draft/publish workflow

### OG Image Generation (Next.js 2026)

**Current standard:** next/og with ImageResponse (preferred over @vercel/og)
- Runs on Edge Runtime
- Supports flexbox layouts, custom fonts
- Renders JSX to image using Satori
- 1200x630px optimal dimensions
- Cache for 1 year (rarely change)

**Implementation:**
- `app/blog/[slug]/opengraph-image.tsx` for dynamic per-post
- `app/opengraph-image.tsx` for default site-wide
- Use post title + category color for visual differentiation

**Template design patterns:**
- Post title (large, serif font)
- Category badge (color-coded)
- Site branding (logo or domain)
- Gradient or pattern background

### Launch Prep Checklist

**SEO completeness:**
- [x] Home page meta + OG (already done in v1.1)
- [x] Projects pages meta + OG (already done)
- [x] Services page meta + OG (already done)
- [x] About/Contact meta + OG (already done)
- [ ] Blog post dynamic meta + OG
- [ ] Default OG for non-blog pages
- [ ] Organization schema (site-wide)
- [ ] WebSite schema with sitelinks searchbox
- [ ] Article schema per blog post
- [ ] Sitemap.xml including blog posts

**Analytics:**
- [ ] GA4 or Plausible config
- [ ] Event tracking (CTA clicks, form submissions)
- [ ] Core Web Vitals monitoring

**Error handling:**
- [ ] 404 page (helpful navigation)
- [ ] 500 page (generic error)
- [ ] Form validation errors (user-friendly)

**Performance:**
- [ ] Image optimization (already using next/image)
- [ ] Markdown rendering performance (memoization)
- [ ] OG image caching (1 year)

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| Blog system patterns | HIGH | Multiple authoritative sources, consistent 2026 patterns |
| Markdown editor choice | HIGH | @uiw/react-md-editor verified via official docs + comparison articles |
| SEO requirements | HIGH | Google official docs for Article schema, verified OG image specs |
| Testimonial display | HIGH | Consistent patterns across portfolio examples |
| Case study structure | HIGH | Universal Challenge/Approach/Results format confirmed |
| Anti-features | MEDIUM | Based on SEO best practices (tags = duplicate content) and CMS common mistakes articles |
| Complexity estimates | MEDIUM | Based on similar Convex + Next.js patterns from v1.0/v1.1 |

**Sources of uncertainty:**
- Exact markdown library choice (@uiw vs MDXEditor) - both viable, @uiw simpler
- Related posts algorithm specifics - needs A/B testing with real content
- Analytics platform (GA4 vs Plausible) - deferred to Jon's preference

---

## Gaps to Address

**Decisions needed from Jon:**
1. Analytics platform preference (GA4 free but complex, Plausible paid but simple)
2. Whether to enable tags in addition to categories (research recommends category-only)
3. Comment strategy (recommend defer to social media, but confirm)
4. Newsletter integration timing (recommend defer to v1.3+)

**Technical unknowns to explore during implementation:**
1. Markdown rendering performance with large posts (may need memoization or SSG)
2. OG image generation Edge Runtime limits on Vercel free tier
3. Convex query performance with 50+ blog posts (pagination strategy)

**Content strategy gaps:**
1. Initial blog post topics (needs content calendar)
2. Testimonial collection process (email template for clients)
3. Case study selection (which of 6 projects get full treatment)

---

## Sources

### Blog & Portfolio Best Practices
- [5 Best Portfolio Website Builders Creators Are Using in 2026](https://emergent.sh/learn/best-portfolio-website-builders)
- [How to Make a Portfolio Website: The Definitive Guide for 2026](https://elementor.com/blog/how-to-make-a-portfolio-website/)
- [Best Web Developer Portfolio Examples from Top Developers in 2026](https://elementor.com/blog/best-web-developer-portfolio-examples/)
- [23 portfolio website examples, plus best practices to attract clients | Webflow Blog](https://webflow.com/blog/design-portfolio-examples)
- [Starting a Blog in 2026: An Overview | by Neasa Schukat | Medium](https://medium.com/creative-black-pug-studio/starting-a-blog-in-2026-an-overview-0f9d3d97bfed)

### Testimonial & Case Study Management
- [Testimonial's Portfolio Page Builder: A New Way to Showcase Your Business](https://testimonial.to/resources/portfolio-builder)
- [I Tried 25 Testimonial Collection Tools (These 9 Work Best in 2026)](https://wiserreview.com/blog/testimonial-software/)
- [Showcase of Case Studies in Design Portfolios — Smashing Magazine](https://www.smashingmagazine.com/2009/09/showcase-of-case-studies-in-design-portfolios/)
- [The Ultimate UX Case Study Template & Structure (2026 Guide)](https://blog.uxfol.io/ux-case-study-template/)
- [How to write the perfect web design case study to win more clients | Webflow Blog](https://webflow.com/blog/write-the-perfect-case-study)

### Markdown Editors for React/Next.js
- [GitHub - uiwjs/react-md-editor: A simple markdown editor with preview, implemented with React.js and TypeScript.](https://github.com/uiwjs/react-md-editor)
- [5 Best Markdown Editors for React Compared](https://strapi.io/blog/top-5-markdown-editors-for-react)
- [Build a Markdown Blog with Next.js and React Markdown | The Tech Pulse](https://medium.com/the-tech-pulse/just-files-build-a-blog-with-next-js-and-react-markdown-305935c86aca)
- [Building a Feature-Rich Markdown Editor in Next.js | by @rnab | Medium](https://arnab-k.medium.com/building-a-feature-rich-markdown-editor-in-next-js-71c83b9c9787)
- [12 Best Markdown Editors for 2026 (Our Top Picks)](https://www.shyeditor.com/blog/post/best-markdown-editor)

### SEO & Schema Markup
- [Learn About Article Schema Markup | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Schema Markup for Blogs: A Complete Guide to Boosting SEO and Visibility](https://www.pageoptimizer.pro/blog/schema-markup-for-blogs-a-complete-guide-to-boosting-seo-and-visibility)
- [Schema Markup Guide: Step-by-Step SEO Strategy for 2026](https://www.clickrank.ai/schema-markup/)
- [Categories and Tags on Your Blog: How to Use Them the Right Way | SEO / SEM Agency: Delante Blog](https://delante.co/categories-and-tags-on-the-blog/)
- [Taxonomy SEO: How to optimize your categories and tags • Yoast](https://yoast.com/taxonomy-seo-categories-tags/)

### OG Image Generation
- [Generate Dynamic OG Images with Next.js 16](https://makerkit.dev/blog/tutorials/dynamic-og-image)
- [How to Automatically Generate Unique OG Images for Every Page in Next.js 15.4+ | Build with Matija](https://www.buildwithmatija.com/blog/complete-guide-dynamic-og-image-generation-for-next-js-15)
- [Getting Started: Metadata and OG images | Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Metadata Files: opengraph-image and twitter-image | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

### Content Strategy & Business Blogging
- [The Ultimate Guide to Blogging for Business in 2026 (and Why You Should Still Do It!)](https://www.socialnicole.com/ultimate-guide-blogging-for-business-2026/)
- [Why do we need SEO in 2026: The complete guide](https://nestcontent.com/blog/why-do-we-need-seo)
- [How to Build Your 2026 Content Strategy | Intrepid Digital](https://www.intrepidonline.com/blog/content/how-build-your-2026-content-strategy/)
- [23 Business Blogging Statistics of 2026 (Latest Data)](https://www.demandsage.com/business-blogging-statistics/)

### CMS Anti-Patterns & Common Mistakes
- [How to Avoid Common CMS Mistakes in 2026](https://digiteins.com/how-to-avoid-common-cms-mistakes/)
- [CMS Feature Creep Is Real: Why Too Many Options Hurt Teams](https://www.concretecms.com/about/blog/web-design/cms-feature-creep-is-real-why-too-many-options-hurt-teams)
- [17 SEO mistakes to avoid in 2026 - Productive Blogging](https://www.productiveblogging.com/seo-mistakes-to-avoid/)
- [How Tags and Categories Create Duplicate Content: Use with Caution](https://savyagency.com/tags-and-categories-create-duplicate-content/)

### CMS Platforms for Portfolio Sites
- [CMS for Portfolio Website · BCMS](https://thebcms.com/cms-for-portfolio-website)
- [18 CMS Platforms For Building Portfolio Websites | Marketer Interview](https://marketerinterview.com/18-cms-platforms-for-building-portfolio-websites/)
