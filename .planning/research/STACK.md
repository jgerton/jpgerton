# Stack Research: Blog & Content Management

**Domain:** Blog/Content Management for Next.js + Convex Portfolio Site
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

Adding markdown blog with admin editor and content CRUD requires minimal new dependencies. The existing Next.js 14 + Convex stack handles most needs. Critical additions: `react-markdown` (rendering), `@uiw/react-md-editor` (editing), and unified ecosystem plugins for GitHub Flavored Markdown and syntax highlighting. Bundle impact: ~50KB total (4.6KB editor + ~20KB react-markdown + plugins). No additional backend infrastructure needed - Convex handles all storage, queries, and full-text search.

## Recommended Stack

### Markdown Rendering (Public Pages)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-markdown | ^10.1.0 | Render markdown to React components | Safe by default (no dangerouslySetInnerHTML), 100% CommonMark/GFM compliant, integrates with unified plugins, ~20KB gzipped |
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown support | Tables, task lists, strikethrough, autolinks - expected features for tech blog |
| rehype-highlight | ^7.0.0 | Code syntax highlighting | Lighter than Prism.js (2KB core), no client-side JS, SSR-friendly |

**Rationale:** react-markdown renders directly to React components without HTML strings, making it XSS-safe by default. The unified plugin ecosystem (remark/rehype) is industry standard and well-maintained. Alternative Shiki offers superior highlighting but adds 280KB + WASM dependency - unacceptable for Lighthouse 100 target.

### Markdown Editing (Admin)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @uiw/react-md-editor | ^4.0.11 | WYSIWYG markdown editor with preview | Smallest full-featured option (4.6KB gzipped), live split-pane preview, familiar toolbar UX, maintained actively (v4.0.11 Dec 2024) |

**Rationale:** Tiptap offers more flexibility but adds 50KB+ and requires custom markdown export logic. @uiw/react-md-editor provides markdown-first editing with built-in preview, keyboard shortcuts (Ctrl+D duplicate line, Alt+↑/↓ move), and simple value/onChange props that work with Convex mutations.

**Known limitation:** Uses !important CSS rules extensively. Override via Tailwind utility classes with higher specificity or wrapper container styles. Acceptable tradeoff for 4.6KB bundle.

### Content Management (Backend)

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Convex full-text search | (built-in) | Blog post search by title/content | Define search index on posts table, 1024 doc scan limit, 16 keyword max per query |
| Convex pagination | (built-in) | Cursor-based pagination for blog lists | usePaginatedQuery hook, fully reactive, works with filters |
| Convex Auth | (existing) | Protect admin routes | Already implemented, no additional setup |

**No additional backend needed.** Convex provides all CRUD, search, and pagination primitives.

### Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| slugify | ^1.6.6 | URL-safe slugs from blog titles | Generate post.slug from post.title on create/update |
| dayjs | ^1.11.13 | Date formatting | Display "Published Feb 6, 2026" - lighter than date-fns (6KB vs 18KB for common use case) |

**Rationale:** slugify is industry standard (2726 npm projects), handles Unicode well. dayjs chosen over date-fns for smaller bundle when not using tree-shaking (Next.js App Router server components don't always tree-shake client imports effectively).

### SEO (Built-in Next.js)

| Feature | Implementation | Notes |
|---------|---------------|-------|
| Blog post metadata | generateMetadata() | Dynamic title, description, OG image per post |
| Article JSON-LD | Script tag in page.tsx | Schema.org BlogPosting type |
| Sitemap | generateSitemapXML() | Dynamic sitemap including blog posts |

**No libraries needed.** Next.js 14 Metadata API and App Router handle all SEO primitives. JSON-LD implemented as inline script tag in server component.

## Installation

```bash
# Markdown rendering (public pages)
bun add react-markdown remark-gfm rehype-highlight

# Markdown editor (admin only)
bun add @uiw/react-md-editor

# Utilities
bun add slugify dayjs
```

Total added dependencies: 6 packages, ~50KB gzipped impact

## Integration Points

### With Existing Stack

**Next.js App Router:**
- Blog list: `app/(home)/blog/page.tsx` (server component, uses Convex query)
- Blog post: `app/(home)/blog/[slug]/page.tsx` (dynamic route, generateMetadata for SEO)
- Admin editor: `app/admin/posts/new/page.tsx` ("use client", useMutation for save)

**Convex Schema:**
```typescript
// convex/schema.ts
posts: defineTable({
  title: v.string(),
  slug: v.string(),        // URL-safe, unique
  content: v.string(),     // Raw markdown
  excerpt: v.string(),     // For list pages
  category: v.string(),    // "local-business" | "tech"
  imageUrl: v.optional(v.string()),  // External URL only
  publishedAt: v.optional(v.number()),
  authorId: v.id("users"),
}).index("by_slug", ["slug"])
  .searchIndex("search_posts", {
    searchField: "content",
    filterFields: ["category", "publishedAt"]
  })
```

**Tailwind v4:**
- Markdown prose styling via @layer components in globals.css
- Dark mode handled by existing CSS variables
- Code blocks use existing --color-muted-foreground tokens

**shadcn/ui:**
- Form components (Input, Textarea) for title/excerpt fields
- Button for save/publish actions
- Tabs for editor/preview toggle (alternative to split-pane)
- Badge for category pills

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Markdown rendering | react-markdown | MDX | Overkill - no need for JSX in markdown. Adds complexity and bundle size for blog content. Use for documentation sites, not blog posts. |
| Markdown rendering | react-markdown | marked | Outputs HTML strings, requires dangerouslySetInnerHTML. Not React-native. Less safe. |
| Syntax highlighting | rehype-highlight | Shiki | 280KB + WASM dependency breaks Lighthouse 100 target. Shiki quality advantage not worth 140x size penalty. |
| Syntax highlighting | rehype-highlight | Prism.js | Requires client-side JS. rehype-highlight runs at render time (SSR-friendly). Prism unmaintained (2-3 years stale). |
| Markdown editor | @uiw/react-md-editor | Tiptap | 50KB+ bundle, rich-text-first (markdown secondary). Requires custom export logic. Over-engineered for markdown blog. Use Tiptap when you need custom nodes/marks. |
| Markdown editor | @uiw/react-md-editor | Novel | WYSIWYG-first, not markdown-first. Opinionated AI features (not needed). Heavier bundle. |
| Date formatting | dayjs | date-fns | date-fns is 18KB without locales vs dayjs 6KB. date-fns tree-shaking advantage lost in App Router server components with client imports. |
| Slug generation | slugify | Custom regex | Don't reinvent. slugify handles Unicode, transliteration, edge cases (Vietnamese, Arabic, German umlauts). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| CMS platforms (Contentful, Sanity, Strapi) | $0 budget constraint. Convex provides all backend needs. CMS adds external dependency, breaks free tier goal. | Convex tables + queries |
| File upload libraries (uploadthing, cloudinary) | External image URLs only (project constraint). Avoid storage costs. | Input field for imageUrl string |
| Markdown-to-HTML parsers (marked, markdown-it) | Output raw HTML strings. Requires dangerouslySetInnerHTML. XSS risk if not sanitized. Not React-friendly. | react-markdown (renders to components) |
| WYSIWYG editors (TinyMCE, CKEditor, Quill) | Rich text ≠ markdown. Heavyweight (100KB+). Designed for word processor UX, not markdown workflow. | @uiw/react-md-editor |
| rehype-sanitize plugin | react-markdown is safe by default (ignores raw HTML). Sanitization adds bundle weight for no benefit. | None (react-markdown handles safety) |
| Framer Motion for editor transitions | Already have CSS-only animation system. Framer Motion 50KB violates "no animation library" constraint from v1.1. | CSS transitions in globals.css |

## Version Compatibility

| Package | Compatible With | Notes |
|---------|----------------|-------|
| react-markdown ^10.1.0 | React 18+ | Requires React 18 for automatic batching |
| remark-gfm ^4.0.0 | react-markdown ^9.0.0+ | Unified ecosystem v11 (ESM-only) |
| rehype-highlight ^7.0.0 | react-markdown ^9.0.0+ | Unified ecosystem v11 |
| @uiw/react-md-editor ^4.0.11 | React 16.8+, Next.js 14+ | Known issue: requires "use client", not SSR-safe |
| slugify ^1.6.6 | All environments | No peer dependencies |
| dayjs ^1.11.13 | All environments | No peer dependencies |

**Critical:** All unified packages (react-markdown, remark-gfm, rehype-highlight) are ESM-only. Next.js 14 handles this automatically - no configuration needed.

## Convex Free Tier Impact

| Operation | Free Tier Limit | Projected Usage | Risk Assessment |
|-----------|----------------|-----------------|-----------------|
| Function calls | 1M/month | +~50K/month (blog reads, searches) | LOW - Well within budget |
| Database reads | Unlimited | No additional cost | NONE |
| Search queries | Counts as function call | ~5K/month (assuming 10 searches/day) | LOW |
| Storage | 1GB | +~5MB (500 blog posts × 10KB avg) | NONE - Negligible |

**Conclusion:** Blog system adds ~5% to function call budget. Safe margin. Search index (1024 doc scan limit) prevents runaway queries.

## Performance Budget

| Metric | Current (v1.1) | After Blog Addition | Target | Status |
|--------|---------------|---------------------|--------|--------|
| LCP | 132ms | ~150ms (image lazy loading) | <200ms | PASS |
| CLS | 0 | 0 (no layout shift) | 0 | PASS |
| INP | 24ms | ~30ms (editor interaction) | <50ms | PASS |
| Bundle size (client) | ~120KB | ~170KB (+50KB markdown) | <250KB | PASS |
| Lighthouse Score | 100 | 98-100 (±2 variance) | 95+ | PASS |

**Bundle breakdown:**
- react-markdown: ~20KB gzipped
- @uiw/react-md-editor: ~4.6KB gzipped (admin only, code-split)
- remark-gfm: ~5KB gzipped
- rehype-highlight: ~8KB gzipped
- slugify: ~2KB gzipped
- dayjs: ~6KB gzipped

**Code-splitting:** Editor only loads on admin routes via dynamic import. Public blog pages load react-markdown + plugins (~33KB total).

## Implementation Pattern

### Public Blog Post Page

```typescript
// app/(home)/blog/[slug]/page.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = useQuery(api.posts.getBySlug, { slug: params.slug });

  return (
    <article className="prose prose-lg dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
```

### Admin Editor

```typescript
// app/admin/posts/new/page.tsx
"use client";
import MDEditor from "@uiw/react-md-editor";

export default function NewPost() {
  const [content, setContent] = useState("");
  const createPost = useMutation(api.posts.create);

  return (
    <MDEditor
      value={content}
      onChange={(val) => setContent(val || "")}
      height={600}
    />
  );
}
```

### Convex Query with Search

```typescript
// convex/posts.ts
export const search = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let results = ctx.db
      .query("posts")
      .withSearchIndex("search_posts", (q) =>
        q.search("content", args.query)
          .eq("category", args.category)
      );

    return await results.paginate(args.paginationOpts);
  },
});
```

## Security Considerations

**XSS Protection:**
- react-markdown ignores raw HTML by default (safe)
- Never set `allowDangerousHtml` flag
- External imageUrl validated on backend (URL format check)
- Content-Security-Policy header blocks inline scripts

**Input Validation:**
- Title: max 200 chars
- Slug: validate against pattern /^[a-z0-9-]+$/ before DB write
- Content: max 50KB (Convex document size limit is 1MB)
- Category: enum validation ["local-business", "tech"]

**Rate Limiting:**
- Convex Auth protects admin mutations (authenticated users only)
- Search queries: no rate limit needed (1024 doc scan cap prevents abuse)

## Migration Path

**Phase 1: Data model**
- Add posts table to schema
- Add search index on content field
- Deploy Convex schema

**Phase 2: Public rendering**
- Install react-markdown, remark-gfm, rehype-highlight
- Create blog list page with pagination
- Create blog post page with markdown rendering
- Add generateMetadata for SEO
- Add JSON-LD for articles

**Phase 3: Admin CRUD**
- Install @uiw/react-md-editor
- Create admin posts list with search
- Create new/edit post forms
- Add slug auto-generation from title
- Add publish/draft status

**Phase 4: Content migration**
- Add testimonials, caseStudies tables
- Create admin CRUD pages (reuse patterns from posts)
- Migrate hardcoded content to Convex

No breaking changes to existing code. All additions are isolated to new routes.

## Sources

**Markdown Libraries:**
- [react-markdown documentation](https://github.com/remarkjs/react-markdown)
- [Strapi: 5 Best Markdown Editors for React Compared](https://strapi.io/blog/top-5-markdown-editors-for-react)
- [Techolyze: Best Next.js WYSIWYG Editors in 2026](https://techolyze.com/open/blog/best-nextjs-wysiwyg-editors/)
- [@uiw/react-md-editor npm package](https://www.npmjs.com/package/@uiw/react-md-editor)

**Syntax Highlighting:**
- [npm-compare: Syntax Highlighting Libraries](https://npm-compare.com/highlight.js,prismjs,react-syntax-highlighter,shiki)
- [chsm.dev: Comparing web code highlighters](https://chsm.dev/blog/2025/01/08/shiki-code-highlighting)
- [Better Syntax Highlighting](https://dbushell.com/2024/03/14/better-syntax-highlighting/)

**Unified Plugins:**
- [remarkjs GitHub discussions](https://github.com/orgs/remarkjs/discussions/718)
- [remark-gfm documentation](https://github.com/remarkjs/remark-gfm)

**SEO:**
- [Next.js Metadata API documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js SEO Optimization Guide (2026 Edition)](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)

**Security:**
- [Strapi: React Markdown Complete Guide 2025 - Security](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [PullRequest: Secure Markdown Rendering in React](https://www.pullrequest.com/blog/secure-markdown-rendering-in-react-balancing-flexibility-and-safety/)

**Convex:**
- [Convex Full Text Search documentation](https://docs.convex.dev/search/text-search)
- [Convex Pagination documentation](https://docs.convex.dev/database/pagination)
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/)

**Utilities:**
- [slugify npm package](https://www.npmjs.com/package/slugify)
- [npm-compare: date-fns vs dayjs](https://npm-compare.com/date-fns,dayjs,moment)
- [DhiWise: date-fns vs dayjs comparison](https://www.dhiwise.com/post/date-fns-vs-dayjs-the-battle-of-javascript-date-libraries)
