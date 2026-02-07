# Pitfalls Research: Blog and Content Management

**Domain:** Adding blog/content management to Next.js 14 + Convex portfolio site
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

Adding a blog and content management system to an existing portfolio site carries high integration risk. The research reveals three categories of critical failures:

1. **Performance regression through markdown overhead** - Code highlighting, large bundles, and client-side rendering can drop Lighthouse scores from 100 to 60-70
2. **Security vulnerabilities from user content** - XSS through markdown rendering, unsafe HTML, and inadequate sanitization
3. **Scalability pitfalls from naive queries** - Exhausting Convex free tier (1M calls/month) with unbounded queries and poor pagination

The dual constraints of maintaining existing quality (Lighthouse 100, WCAG AA) while adding dynamic features (blog, admin, CMS) makes this especially challenging. Most tutorials show greenfield blog setups; integrating into a working production site with placeholder data requires careful migration.

---

## Critical Pitfalls

### Pitfall 1: Convex Free Tier Overrun with Naive Pagination

**What goes wrong:** Blog listing pages consume excessive Convex function calls, exhausting the 1M monthly limit within days. A single user browsing the blog generates dozens of queries.

**Why it happens:** Using `.collect()` on unbounded queries or implementing client-side pagination that fetches ALL posts then slices them in React. Each page view triggers new queries, and reactive subscriptions re-run on every data change.

**How to avoid:**
- Use Convex's built-in cursor-based pagination (`.paginate()`)
- Apply `.withIndex()` on paginated queries for performance
- Use `.take(N)` for preview lists, not `.collect()` then slice
- Cache listing queries with Next.js ISR (revalidate: 3600) to reduce Convex calls
- Avoid useQuery in components that re-render frequently

**Warning signs:**
- Convex dashboard shows high read operations
- Blog listing page slower than expected
- Function call count climbing rapidly in analytics

**Phase to address:** Phase 1 (Schema Design) - Define indexes; Phase 2 (Blog Listing) - Implement pagination correctly

**Code smell:**
```typescript
// BAD: Fetches everything, unbounded
const allPosts = useQuery(api.posts.list);
const page = allPosts?.slice(start, end);

// GOOD: Cursor-based pagination with index
const { results, continueCursor } = usePaginatedQuery(
  api.posts.listPaginated,
  { status: "published" },
  { initialNumItems: 10 }
);
```

**Impact:** Could exhaust 1M free tier calls in 2-3 weeks with moderate traffic. Upgrade to paid tier ($25/mo for 25M calls) required.

---

### Pitfall 2: XSS Vulnerability in Markdown Rendering

**What goes wrong:** User-supplied markdown (from admin) renders malicious JavaScript, allowing attackers to hijack admin sessions or inject tracking scripts.

**Why it happens:** Using `dangerouslySetInnerHTML` with unsanitized markdown-to-HTML conversion, or rendering raw HTML embedded in markdown without filtering.

**How to avoid:**
- Use `react-markdown` instead of `dangerouslySetInnerHTML` (converts to React components, not raw HTML)
- If using `rehype-raw` for HTML support, pair with `rehype-sanitize` or DOMPurify
- Implement strict Content Security Policy (CSP) with nonces
- Never trust markdown input, even from "admin" users (defense in depth)
- Validate frontmatter separately from markdown body

**Warning signs:**
- Using `dangerouslySetInnerHTML` anywhere in blog rendering code
- Raw HTML tags appearing in rendered output
- No CSP headers in Next.js config

**Phase to address:** Phase 3 (Markdown Rendering) - Security-first implementation

**Code pattern:**
```typescript
// BAD: XSS vulnerable
<div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />

// GOOD: React components, auto-sanitized
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

<ReactMarkdown rehypePlugins={[rehypeSanitize]}>
  {markdown}
</ReactMarkdown>
```

**Impact:** CRITICAL security vulnerability. Could compromise admin accounts, inject malware, or deface site.

---

### Pitfall 3: Hydration Mismatch in Markdown Editor Preview

**What goes wrong:** Markdown preview in admin editor shows hydration errors, flashing/re-rendering, or mismatched content between server and client.

**Why it happens:** Rendering preview on server (SSR) with different markdown processor settings than client, or using browser-only APIs (localStorage for draft state) during SSR.

**How to avoid:**
- Make editor preview a Client Component with `"use client"`
- Use `useEffect` to delay preview rendering until after hydration
- Store draft state in React state, not localStorage during render
- Use identical markdown processor configuration for SSR and client
- Consider `suppressHydrationWarning` only for timestamps/dates, not content

**Warning signs:**
- Console errors: "Text content does not match server-rendered HTML"
- Preview flashes or re-renders on page load
- Different output in preview vs published post

**Phase to address:** Phase 5 (Admin Markdown Editor) - Client-only preview component

**Code pattern:**
```typescript
// BAD: SSR + browser API = hydration mismatch
const [draft, setDraft] = useState(localStorage.getItem('draft'));

// GOOD: Client-only, hydration-safe
'use client';
const [draft, setDraft] = useState('');
useEffect(() => {
  setDraft(localStorage.getItem('draft') || '');
}, []);
```

**Impact:** Degrades UX, confuses editors, risks publishing wrong content if preview doesn't match output.

---

### Pitfall 4: Slug Collision on Publish

**What goes wrong:** Publishing a new post fails silently or overwrites existing post because slugs collide ("my-post" vs "my-post-2").

**Why it happens:** Generating slugs client-side without checking uniqueness, or using title-to-slug conversion that produces duplicates for similar titles.

**How to avoid:**
- Generate slugs server-side in Convex mutation with uniqueness check
- Define unique index on `slug` field in schema
- Append `-2`, `-3` suffix automatically if collision detected
- Validate slug format (lowercase, hyphens, alphanumeric only)
- Allow manual slug override in admin UI

**Warning signs:**
- Posts not appearing after publish
- URL redirects to wrong post
- Schema validation errors on insert

**Phase to address:** Phase 1 (Schema Design) - Unique index; Phase 4 (Admin CRUD) - Slug generation logic

**Code pattern:**
```typescript
// Convex schema
posts: defineTable({
  slug: v.string(),
  title: v.string(),
  // ...
}).index("by_slug", ["slug"]), // Must be unique!

// Mutation: check uniqueness
const existing = await ctx.db
  .query("posts")
  .withIndex("by_slug", (q) => q.eq("slug", slug))
  .first();

if (existing && existing._id !== postId) {
  // Append suffix or throw error
  slug = `${slug}-${Date.now()}`;
}
```

**Impact:** Silent data loss, broken URLs, SEO damage from duplicate content.

---

### Pitfall 5: Missing Canonical URLs Causing Duplicate Content Penalty

**What goes wrong:** Blog posts accessible via multiple URLs (`/blog/post`, `/blog/post/`, `/blog/post?ref=twitter`) get flagged as duplicate content by Google, diluting SEO ranking.

**Why it happens:** Not setting canonical URL in Next.js metadata, or setting wrong canonical (pointing to draft URL instead of published URL).

**How to avoid:**
- Use Next.js `generateMetadata` to set canonical URL for every post
- Strip query params and trailing slashes from canonical
- Use absolute URLs (https://jpgerton.com/blog/my-post), not relative
- Test with Google Search Console for duplicate content warnings
- Ensure pagination pages don't canonicalize to page 1 (each page is unique content)

**Warning signs:**
- Search Console shows duplicate content issues
- Same post indexed multiple times
- Traffic split across URL variations

**Phase to address:** Phase 3 (Markdown Rendering) - Add metadata generation

**Code pattern:**
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await fetchConvex(api.posts.getBySlug, { slug: params.slug });

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://jpgerton.com/blog/${params.slug}`, // Absolute URL
    },
    openGraph: {
      url: `https://jpgerton.com/blog/${params.slug}`,
      // ...
    },
  };
}
```

**Impact:** SEO ranking drops, lower search visibility, wasted link equity across duplicates.

---

### Pitfall 6: Code Syntax Highlighter Bundle Size Explosion

**What goes wrong:** Adding `highlight.js` or `Prism` to markdown rendering adds 200-500KB to bundle, dropping Lighthouse performance score from 100 to 70-80.

**Why it happens:** Importing full syntax highlighter library with all languages, or client-side highlighting that blocks rendering.

**How to avoid:**
- Use server-side syntax highlighting (e.g., Bright for RSC, `rehype-highlight` with specific languages)
- Import only needed languages (JS, TS, CSS, Bash), not all 200+ languages
- Use `next/dynamic` with `ssr: false` to lazy-load highlighter only on posts with code blocks
- Consider CSS-only highlighting for simple cases (GitHub-style)
- Monitor bundle size with `bun run build` analyzer

**Warning signs:**
- Bundle size jumps by 200KB+ after adding code highlighting
- Lighthouse performance score drops below 90
- First Contentful Paint (FCP) increases
- Total Blocking Time (TBT) increases

**Phase to address:** Phase 3 (Markdown Rendering) - Server-side, selective language import

**Code pattern:**
```typescript
// BAD: Full library, client-side
import hljs from 'highlight.js'; // 500KB!

// GOOD: Server-side, specific languages only
import rehypeHighlight from 'rehype-highlight';
import langJavaScript from 'highlight.js/lib/languages/javascript';
import langTypescript from 'highlight.js/lib/languages/typescript';

<ReactMarkdown
  rehypePlugins={[
    [rehypeHighlight, {
      languages: { javascript: langJavaScript, typescript: langTypescript }
    }]
  ]}
>
  {markdown}
</ReactMarkdown>
```

**Impact:** Violates "maintain Lighthouse 100" constraint, degrades Core Web Vitals, poor mobile UX.

---

### Pitfall 7: Testimonials and Case Studies Still Using Placeholder Data

**What goes wrong:** After launching blog with real content, testimonials and case studies on homepage still show placeholder data, looking unprofessional.

**Why it happens:** Existing `TestimonialCard` and `CaseStudyVisual` components were built with hardcoded props, never wired to Convex. Blog launch focused on new features, not refactoring existing.

**How to avoid:**
- Plan migration phase explicitly before blog launch
- Create `testimonials` and `caseStudies` Convex tables
- Refactor components to use `useQuery` instead of props
- Add admin CRUD for testimonials/case studies alongside blog
- QA checklist must include "all data is dynamic, no placeholders"

**Warning signs:**
- Grep for hardcoded testimonial text in components
- No Convex queries for testimonials/case studies
- Admin panel missing CRUD for these entities

**Phase to address:** Phase 4 (Admin CRUD) or separate migration phase before blog launch

**Code pattern:**
```typescript
// BEFORE (Phase 11 composition):
<TestimonialCard
  quote="Amazing work on my site!"
  author="Jane Smith"
  role="Small Business Owner"
/>

// AFTER (Dynamic data):
const testimonials = useQuery(api.testimonials.listFeatured);
{testimonials?.map(t => <TestimonialCard key={t._id} testimonial={t} />)}
```

**Impact:** Damages credibility, looks like demo site, undermines professional positioning.

---

### Pitfall 8: Convex Schema Migration Breaks Existing Queries

**What goes wrong:** Adding new required fields to `projects` table breaks existing portfolio page because Convex enforces schema on reads.

**Why it happens:** Pushing schema with new required fields before migrating existing documents, or not understanding Convex schema evolution rules.

**How to avoid:**
- Always add new fields as `v.optional()` first
- Run migration mutation to populate field on existing docs
- After migration complete, change schema to required
- Use Convex Migrations component for complex changes
- Test schema changes on dev deployment first

**Warning signs:**
- Schema push rejected with validation errors
- Queries returning empty results after schema change
- TypeScript errors about missing required fields

**Phase to address:** Phase 1 (Schema Design) - Document migration strategy

**Migration workflow:**
```typescript
// Step 1: Add as optional
projects: defineTable({
  // ... existing fields
  category: v.optional(v.string()), // NEW
})

// Step 2: Migrate data
internalMutation(async ({ db }) => {
  const projects = await db.query("projects").collect();
  for (const project of projects) {
    if (!project.category) {
      await db.patch(project._id, { category: "uncategorized" });
    }
  }
});

// Step 3: Change to required
projects: defineTable({
  // ... existing fields
  category: v.string(), // Now required
})
```

**Impact:** Site outage, broken portfolio page, emergency rollback required.

---

### Pitfall 9: RSS Feed and Sitemap Forgotten Until Launch

**What goes wrong:** Blog launches without RSS feed or sitemap, missing SEO opportunities and frustrating users who want to subscribe.

**Why it happens:** Treating RSS/sitemap as "nice to have" instead of core feature, or assuming Next.js auto-generates them (it doesn't).

**How to avoid:**
- Add RSS and sitemap to Phase 2 (Blog Listing) acceptance criteria
- Use Next.js `app/sitemap.ts` and `app/blog/rss.xml/route.ts` conventions
- Include blog posts, portfolio projects, and static pages in sitemap
- Validate RSS with feed validator before launch
- Link RSS in footer and blog header

**Warning signs:**
- No `sitemap.ts` or RSS route in codebase
- Google Search Console shows "no sitemap submitted"
- Users asking for RSS feed in feedback

**Phase to address:** Phase 2 (Blog Listing) - Build alongside pagination

**Code pattern:**
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const posts = await fetchConvex(api.posts.listPublished);

  return [
    { url: 'https://jpgerton.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://jpgerton.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    })),
  ];
}
```

**Impact:** Poor SEO, reduced discoverability, missed subscriber opportunities.

---

### Pitfall 10: Open Graph Images Not Generated for Blog Posts

**What goes wrong:** Sharing blog posts on Twitter/LinkedIn shows generic site OG image or no preview, reducing click-through.

**Why it happens:** Not implementing per-post OG images, or using static images that don't scale for dynamic content.

**How to avoid:**
- Use Next.js OG Image Generation (`ImageResponse`) to create dynamic previews
- Include post title, excerpt, and branding in OG image
- Set dimensions to 1200x630 (standard OG size)
- Test with Twitter Card Validator and LinkedIn Post Inspector
- Add OG metadata to `generateMetadata` for each post

**Warning signs:**
- Shared links show no preview image
- All blog posts show same generic OG image
- Social media shares have low engagement

**Phase to address:** Phase 6 (Launch Prep) - OG image generation route

**Code pattern:**
```typescript
// app/blog/[slug]/opengraph-image.tsx
export default async function OGImage({ params }) {
  const post = await fetchConvex(api.posts.getBySlug, { slug: params.slug });

  return new ImageResponse(
    <div style={{ /* OG layout */ }}>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

**Impact:** Lower social media engagement, unprofessional appearance, lost traffic.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded blog posts in markdown files | No database setup, simple deployment | Can't edit without redeployment, no search, no filtering | Proof of concept only |
| Client-side markdown rendering | Simpler code, no SSR complexity | XSS risk, poor SEO, slow rendering | Never for production blog |
| `.collect()` instead of `.paginate()` | Works for small datasets | Exhausts Convex limits, performance degrades | Dev environment only |
| Skip RSS/sitemap | Ship faster | SEO penalty, manual outreach required | MVP if committed to add in v1.1 |
| Generic OG images for all posts | One image, done | Low social engagement | Personal blog with minimal sharing |
| Admin without auth | Faster development | Anyone can edit content | Local dev only, NEVER production |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Importing full highlight.js | Bundle +500KB, Lighthouse 70 | Server-side highlighting, specific languages only | First code snippet added |
| Fetching all posts for pagination | Slow listing page, high Convex usage | Cursor-based pagination with indexes | 10+ blog posts |
| No image optimization in markdown | LCP 3-5s, poor mobile UX | `next/image` or `rehype-img-size` plugin | First image-heavy post |
| Client-side syntax highlighting | Blocking JavaScript, TBT spike | Server-side with rehype plugins | Production traffic |
| Unbounded search queries | Timeout after 100+ posts | Full-text search indexes, pagination | 50+ posts |
| Re-rendering markdown on every keystroke | Editor lag, CPU spike | Debounce preview updates (300ms) | Long blog posts (2000+ words) |

**Lighthouse preservation checklist:**
- [ ] Code highlighting is server-side
- [ ] Images use `next/image` or optimized
- [ ] JavaScript bundle under 200KB
- [ ] No blocking scripts in markdown content
- [ ] Fonts preloaded (Inter, Lora already configured)
- [ ] CSS-only animations (existing constraint met)

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using `dangerouslySetInnerHTML` for markdown | XSS, session hijacking | Use `react-markdown` with `rehype-sanitize` |
| No auth check in blog mutations | Anyone can publish/delete posts | `getAuthUserId(ctx)` in all mutations |
| Storing markdown with embedded `<script>` tags | Persistent XSS | Sanitize on input AND output |
| No CSP headers | XSS exploitation easier | Add strict CSP to `next.config.js` |
| Trusting frontmatter without validation | Schema injection, type errors | Validate with Zod before parsing |
| Admin routes not protected | Public content management | Middleware check for `/admin/*` routes |
| Draft posts accessible via direct URL | Content leaks before publish | Status check in query, not just UI |

**Security checklist:**
- [ ] All admin mutations require auth
- [ ] Markdown rendered with sanitization
- [ ] CSP headers configured
- [ ] Frontmatter validated (Zod or similar)
- [ ] Draft posts require auth to view
- [ ] No `dangerouslySetInnerHTML` in codebase

---

## "Looks Done But Isn't" Checklist

Features that appear complete but have critical gaps:

- [ ] **Blog post detail page** - Works, but no canonical URL set (SEO issue)
- [ ] **Markdown editor** - Renders preview, but no XSS sanitization
- [ ] **Pagination** - Shows pages, but uses `.collect()` + slice (will break at scale)
- [ ] **Code highlighting** - Works, but imported full library (500KB bundle)
- [ ] **Admin CRUD** - Can create posts, but no slug uniqueness check (collision risk)
- [ ] **Testimonials section** - Displays on homepage, but hardcoded data (not dynamic)
- [ ] **Search functionality** - Filters posts, but no index (slow with 100+ posts)
- [ ] **Social sharing** - Share buttons present, but generic OG images
- [ ] **Draft workflow** - Can mark as draft, but accessible via direct URL
- [ ] **RSS feed** - Generated, but no validation (may not parse correctly)
- [ ] **Sitemap** - Created, but not submitted to Search Console
- [ ] **Image upload** - Works, but no size limits (could exhaust Convex storage)
- [ ] **Categories/tags** - Display on posts, but no index page for browsing
- [ ] **Related posts** - Shows suggestions, but query fetches all posts (unbounded)

**Validation tests:**
```bash
# RSS feed validation
curl https://jpgerton.com/blog/rss.xml | xmllint --valid -

# Lighthouse CI
bun run build && lighthouse http://localhost:3400/blog --view

# Bundle size check
bun run build && du -sh .next/static/chunks/*.js | sort -h

# Convex query performance
# Check Convex dashboard for queries taking >100ms
```

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Exhausted Convex free tier mid-month | $25 immediate upgrade | 1. Upgrade to Pro plan<br>2. Add ISR caching to reduce queries<br>3. Audit query patterns for inefficiency |
| XSS vulnerability exploited | HIGH - incident response | 1. Take admin offline immediately<br>2. Audit all posts for malicious content<br>3. Deploy sanitization fix<br>4. Reset all admin sessions |
| Slug collision overwrote post | MEDIUM - data recovery | 1. Restore from Convex backup (automatic)<br>2. Add unique index to schema<br>3. Regenerate colliding slugs |
| Lighthouse score dropped to 60 | LOW - optimization sprint | 1. Identify bundle bloat with analyzer<br>2. Switch to server-side highlighting<br>3. Add image optimization<br>4. Re-test and iterate |
| Missing canonical URLs, SEO penalty | MEDIUM - SEO recovery | 1. Add canonical metadata to all posts<br>2. Submit updated sitemap to Search Console<br>3. Wait 2-4 weeks for re-indexing |
| Hydration errors in preview | LOW - component refactor | 1. Convert editor to Client Component<br>2. Delay preview until `useEffect`<br>3. Test with Strict Mode enabled |
| Schema migration broke portfolio | HIGH - emergency rollback | 1. Rollback schema to previous version<br>2. Plan migration with optional fields<br>3. Test on dev deployment first |

**Emergency rollback procedure:**
```bash
# Convex schema rollback
bunx convex deploy --schema-only --prev-version

# Next.js deployment rollback (Vercel)
vercel rollback <deployment-url>

# Local verification
docker compose up
bun run build  # Check for errors
```

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|---------------|------------|
| 1 | Schema Design | Adding required fields without migration plan | Start with `v.optional()`, document upgrade path |
| 1 | Indexes | Missing index on `slug` causes slow lookups | Add `by_slug` index, unique constraint |
| 2 | Blog Listing | Using `.collect()` for pagination | Use `.paginate()` with cursor |
| 2 | Query Performance | No index on `status` + `publishedAt` | Add compound index for published posts query |
| 3 | Markdown Rendering | XSS via `dangerouslySetInnerHTML` | Use `react-markdown` with `rehype-sanitize` |
| 3 | Code Highlighting | Full library import (500KB) | Server-side, specific languages only |
| 3 | SEO Metadata | Missing canonical URLs | Implement `generateMetadata` for all posts |
| 4 | Admin CRUD | No slug uniqueness check | Server-side validation in mutation |
| 4 | Data Migration | Testimonials still hardcoded | Migrate to Convex, create admin UI |
| 5 | Markdown Editor | Hydration mismatch in preview | Client Component with `useEffect` delay |
| 5 | Draft State | localStorage conflicts with SSR | Store drafts in Convex, not browser |
| 6 | Launch Prep | RSS/sitemap forgotten | Add to acceptance criteria, validate before launch |
| 6 | OG Images | Generic images for all posts | Dynamic generation with `ImageResponse` |
| 6 | Analytics | No event tracking for blog interactions | Add PostHog/Plausible for read time, scrolls |

---

## Integration-Specific Warnings (Next.js + Convex + Tailwind v4)

### Convex Reactive Queries with SSR
**Pitfall:** Using `useQuery` in Server Components causes build errors.
**Fix:** Use `fetchQuery` from `convex/nextjs` in Server Components, `useQuery` only in Client Components.

### Tailwind v4 Prose Styling
**Pitfall:** `@tailwindcss/typography` not compatible with Tailwind v4 yet (as of Feb 2026).
**Fix:** Define custom prose styles in `globals.css` under `@layer utilities`, or wait for v4 plugin.

### Docker + Convex Dev Mode
**Pitfall:** Convex dev server runs on host, but Next.js in container can't reach `localhost:3001`.
**Fix:** Run `bunx convex dev` on host (not in container), Next.js can access via host.docker.internal or run Convex in separate container.

### Lora Font with Code Blocks
**Pitfall:** Code blocks inherit `font-serif` (Lora) from heading context, looks unprofessional.
**Fix:** Explicitly set `font-mono` on `<code>` and `<pre>` elements in markdown styles.

### Existing useIntersectionObserver Hook
**Pitfall:** Hook uses callback ref pattern, easy to misuse with markdown-rendered content.
**Fix:** Ensure ref attached to wrapper div, not markdown-generated elements that mount conditionally.

---

## Vercel + Convex Cost Traps

### Vercel Free Tier Limits
- 100 GB bandwidth/month
- 6,000 build minutes/month
- 100 GB-hours serverless execution/month

**Trap:** Blog with images and high traffic can exceed bandwidth.
**Mitigation:** Use Cloudflare CDN for images, or optimize with `next/image` (auto-serves WebP).

### Convex Free Tier Limits
- 1M function calls/month
- 1 GB storage
- 1 GB file storage

**Trap:** Each blog listing page view = 1-3 queries (posts + categories + featured). 10K visitors = 30K calls. With homepage testimonials (now dynamic) + portfolio = 50K calls easily.

**Usage projection:**
```
Homepage views: 5K/month × 3 queries = 15K
Blog listing: 3K/month × 2 queries = 6K
Blog post views: 8K/month × 1 query = 8K
Portfolio: 2K/month × 1 query = 2K
Admin edits: 100/month × 5 mutations = 500
Total: ~32K calls/month (3% of free tier)
```

**When to worry:** If traffic 10x (realistic for viral post), jumps to 320K calls/month (32% of limit). Still safe, but watch dashboard.

**When to upgrade:** Sustained 100K+ calls/month, or need team collaboration (free tier is single user).

---

## Common Mistakes from Other Platforms

### WordPress Habits to Unlearn
- **Don't:** Store images in markdown as base64 strings (Convex has file storage).
- **Don't:** Use shortcodes `[gallery id="1"]` (React components instead).
- **Don't:** Rely on auto-save every 30 seconds (implement explicit save in admin).

### CMS Migration Gotchas
- **Contentful/Sanity patterns:** They use rich text objects, not markdown strings. Convex stores raw markdown, simpler but less structured.
- **Ghost patterns:** Ghost auto-generates slugs on title change. Convex requires explicit slug generation in mutation.

---

## Sources

**Next.js App Router and Markdown Performance:**
- [Building a Markdown-driven blog using Next.js 13 and App Router](https://www.singlehanded.dev/blog/building-markdown-blog-with-nextjs-app-router)
- [Building a High-Performance Blog with Next.js 15 App Router: A Complete Guide](https://dev.to/dylan-neanix/building-a-high-performance-blog-with-nextjs-15-app-router-a-complete-guide-16jo)
- [Next.js Best Practices in 2025: Performance & Architecture](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)

**Convex Schema Design and Query Performance:**
- [Opinionated guidelines and best practices for building Convex projects](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339)
- [10 Essential Tips for New Convex Developers](https://www.schemets.com/blog/10-convex-developer-tips-pitfalls-productivity)
- [Queries that scale](https://stack.convex.dev/queries-that-scale)
- [Intro to Convex Query Performance](https://stack.convex.dev/convex-query-performance)
- [Paginated Queries | Convex Developer Hub](https://docs.convex.dev/database/pagination)

**Markdown Security (XSS):**
- [React Markdown Complete Guide 2025: Security & Styling Tips](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [Secure Markdown Rendering in React: Balancing Flexibility and Safety](https://www.pullrequest.com/blog/secure-markdown-rendering-in-react-balancing-flexibility-and-safety/)
- [XSS Attacks in Next.js: How to Secure Your App Like a Pro!](https://medium.com/@kayahuseyin/xss-attacks-in-next-js-how-to-secure-your-app-like-a-pro-9a81d3513d62)
- [Avoiding XSS via Markdown in React](https://medium.com/javascript-security/avoiding-xss-via-markdown-in-react-91665479900)

**SEO and Canonical URLs:**
- [Canonical Tags for SEO: How to Fix Duplicate Content URLs](https://backlinko.com/canonical-url-guide)
- [How to Use Canonical URL for SEO: Best Practices & Common Mistakes](https://wideripples.com/how-use-canonical-url-seo/)
- [Canonicalization and SEO: A guide for 2026](https://searchengineland.com/canonicalization-seo-448161)
- [How to Specify a Canonical with rel="canonical" | Google Search Central](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

**Next.js Metadata and Open Graph:**
- [Next.js SEO Optimization Guide (2026 Edition)](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition)
- [Getting Started: Metadata and OG images | Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Automate Open Graph Image Creation in Next.js](https://www.davegray.codes/posts/automate-open-graph-images-nextjs)
- [Complete Guide to Dynamic OG Images in Next.js(15+)](https://medium.com/@uyiosazeeirvin/complete-guide-to-dynamic-og-images-in-next-js-15-5f69fd583dbe)

**Code Highlighting and Bundle Size:**
- [React Markdown Complete Guide 2025: Security & Styling Tips](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [Code highlighting and bundle optimizations](https://fatfisz.com/blog/code-highlighting-and-bundle-optimizations)

**RSS and Sitemaps:**
- [How to Add a Sitemap & RSS Feed in Next.js App Router](https://spacejelly.dev/posts/how-to-add-a-sitemap-rss-feed-in-next-js-app-router)
- [Next.js: How to Build an RSS Feed](https://www.davegray.codes/posts/nextjs-how-to-build-an-rss-feed)
- [Learn Pro Sitemap in Next.js 15: Built-in sitemap.ts vs Custom XML](https://techolyze.com/open/blog/nextjs-15-sitemap-guide-built-in-vs-xml/)

**Lighthouse Performance:**
- [Lighthouse performance scoring | Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Next.js performance tuning: practical fixes for better Lighthouse scores](https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores)
- [Google Lighthouse: How To Achieve Highest Score In 2026](https://wpdeveloper.com/google-lighthouse-how-to-achieve-highest-score/)

**Convex Migrations:**
- [Intro to Migrations](https://stack.convex.dev/intro-to-migrations)
- [Stateful Online Migrations using Mutations](https://stack.convex.dev/migrating-data-with-mutations)
- [Lightweight Migrations](https://stack.convex.dev/lightweight-zero-downtime-migrations)

**Slug Generation:**
- [Reddit Style Title Slugs for your Next.js URLs](https://repraze.com/posts/oX7H0aAbeS3Q/reddit-style-title-slugs-for-your-next_js-urls)
- [Guide to the WordPress sanitize_title Function for Safe Slug Generation](https://smartupworld.com/sanitize_title-wordpress-function/)
- [URL Slug pattern](https://patterns.dataincubator.org/book/url-slug.html)

**Frontmatter Validation:**
- [Using Frontmatter in Markdown](https://www.markdownlang.com/advanced/frontmatter.html)
- [Do you know the best practices for Frontmatter in markdown?](https://www.ssw.com.au/rules/best-practices-for-frontmatter-in-markdown)

**Hydration Errors:**
- [Next.js Hydration Errors in 2026: The Real Causes, Fixes, and Prevention Checklist](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702)
- [Text content does not match server-rendered HTML | Next.js](https://nextjs.org/docs/messages/react-hydration-error)
- [Fixing Hydration Errors in server-rendered Components | Sentry](https://sentry.io/answers/hydration-error-nextjs/)

**Vercel Pricing and Limits:**
- [Vercel Pricing: Hobby, Pro, and Enterprise plans](https://vercel.com/pricing)
- [Limits](https://vercel.com/docs/limits)
- [How to Lower Vercel Hosting Costs by 35% in 2026](https://pagepro.co/blog/vercel-hosting-costs/)

**Convex Pricing:**
- [ConvexDB Pricing Guide: Plans, Features & Cost Optimization](https://airbyte.com/data-engineering-resources/convexdb-pricing)
- [Plans and Pricing](https://www.convex.dev/pricing)
