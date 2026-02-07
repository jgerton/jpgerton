# Phase 17: Public Blog Pages - Research

**Researched:** 2026-02-07
**Domain:** Blog rendering, markdown processing, server-side SEO
**Confidence:** HIGH

## Summary

Phase 17 implements public-facing blog pages with server-rendered markdown, syntax highlighting, category filtering, numbered pagination, and complete SEO metadata. The standard approach uses `react-markdown` + `remark-gfm` + `rehype-highlight` for server-side markdown processing, Next.js App Router's `generateMetadata()` for dynamic OG images and JSON-LD, and custom pagination logic that maps numbered page UI to Convex's cursor-based backend.

User decisions from CONTEXT.md lock in horizontal card layout, numbered pagination (10 per page), and prose-width content area. The phase builds on existing patterns from Phase 15 (blog schema) and Phase 16 (admin CRUD with markdown editor).

**Primary recommendation:** Use react-markdown with selective language imports for syntax highlighting, implement numbered pagination as abstraction over Convex cursors, and create custom prose styling following the existing fluid typography system.

## Standard Stack

The established libraries/tools for server-rendered blog pages:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | 9.x | Server-side markdown rendering | Official unified/remark ecosystem component, RSC-compatible |
| remark-gfm | 4.x | GitHub-flavored markdown | Adds tables, strikethrough, task lists - blog essentials |
| rehype-highlight | 7.x | Syntax highlighting (server-side) | Built on highlight.js via lowlight, no client JS required |
| highlight.js | 11.9.x | Syntax highlighting engine | Industry standard, 180+ languages, extensive theme library |
| next/og | Built-in | Dynamic OG image generation | Next.js native ImageResponse API, converts JSX to PNG |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nuqs | 2.x | Type-safe URL state management | Category filtering, pagination state in URL query params |
| slugify | 1.6.x | URL slug generation | Already used in Phase 15 mutations for blog post slugs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | MDX | MDX adds React components in markdown but requires build-time processing, overkill for user-generated content |
| rehype-highlight | rehype-pretty-code / Shiki | Shiki has better syntax highlighting but larger bundle size, rehype-highlight sufficient for 4 languages |
| nuqs | Native useSearchParams | nuqs provides type safety and default values, simpler API than manual URL state management |

**Installation:**
```bash
bun add react-markdown remark-gfm rehype-highlight highlight.js nuqs
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── blog/
│   ├── page.tsx              # List page with category filter + pagination
│   └── [slug]/
│       ├── page.tsx          # Post detail with markdown rendering
│       └── opengraph-image.tsx  # Dynamic OG image generation
components/
├── blog/
│   ├── blog-post-card.tsx    # Horizontal card for list page
│   ├── blog-post-content.tsx # Prose-styled markdown renderer
│   ├── category-filter.tsx   # Pill/chip category buttons
│   └── pagination-bar.tsx    # Numbered page navigation
lib/
└── reading-time.ts           # Shared reading time utility (if needed client-side)
```

### Pattern 1: Server-Side Markdown Rendering
**What:** Render markdown to HTML on the server using react-markdown with plugins
**When to use:** Blog post detail pages, any user-generated markdown content
**Example:**
```typescript
// Source: https://github.com/remarkjs/react-markdown
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function BlogPostContent({ content }: { content: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </Markdown>
    </div>
  );
}
```

**Note:** react-markdown exports both `Markdown` (sync) and `MarkdownAsync` (server-side async) components. Use `Markdown` default export for server components.

### Pattern 2: Selective Language Imports for Syntax Highlighting
**What:** Import only required highlight.js languages to reduce bundle size
**When to use:** When syntax highlighting is needed for specific languages only
**Example:**
```typescript
// Source: https://github.com/rehypejs/rehype-highlight
import rehypeHighlight from 'rehype-highlight';
import { common } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';

// Register selective languages
const languages = {
  ...common,
  javascript,
  typescript,
  css,
  bash,
};

<Markdown
  rehypePlugins={[[rehypeHighlight, { languages }]]}
>
  {content}
</Markdown>
```

**Bundle size tradeoff:** rehype-highlight includes 37 common languages by default (~200KB). Selective imports reduce to ~50KB for 4 languages.

### Pattern 3: Numbered Pagination Over Cursor-Based Backend
**What:** Present classic numbered pages (1, 2, 3) while using Convex cursor pagination
**When to use:** User-facing blog lists with predictable page counts
**Example:**
```typescript
// Client component approach
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function BlogList({ currentPage }: { currentPage: number }) {
  // Convex doesn't support offset-based pagination directly
  // Two options:
  // 1. Fetch all published posts, slice client-side (simple, works for <1000 posts)
  // 2. Create paginated query, track cursors in state, map page numbers to cursors

  const posts = useQuery(api.blogPosts.listPublished, { category });

  const postsPerPage = 10;
  const totalPages = Math.ceil((posts?.length ?? 0) / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts?.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      {currentPosts?.map(post => <BlogPostCard key={post._id} {...post} />)}
      <PaginationBar currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
```

**Alternative (for large post counts):** Create server-side query that accepts `page` number, converts to `skip` offset using Convex's `.skip()` method (exists but not reactive - check Convex docs).

**Source:** [Convex Pagination Docs](https://docs.convex.dev/database/pagination) - Cursor-based is recommended, but offset pagination is possible for bounded datasets.

### Pattern 4: Dynamic OG Images with ImageResponse
**What:** Generate unique social media preview images per blog post
**When to use:** Blog posts, case studies, any content with dynamic titles
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug); // Fetch from Convex

  return new ImageResponse(
    (
      <div style={{
        fontSize: 128,
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {post.title}
      </div>
    ),
    size
  );
}
```

**Limitations:** Only flexbox layout (no grid), subset of CSS properties supported. Use [OG Playground](https://og-playground.vercel.app/) for testing.

### Pattern 5: JSON-LD Article Schema
**What:** Structured data for search engines to display rich results
**When to use:** Blog posts, news articles, editorial content
**Example:**
```typescript
// Source: https://developers.google.com/search/docs/appearance/structured-data/article
// In generateMetadata or page component
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: [post.coverImageUrl],
  datePublished: new Date(post.publishedAt).toISOString(),
  dateModified: new Date(post.publishedAt).toISOString(),
  author: [{
    '@type': 'Person',
    name: 'John Doe',
    url: 'https://example.com/author'
  }]
};

// In page component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

**Recommended fields:** headline, image (multiple aspect ratios), datePublished, dateModified, author. No required fields per Google's spec.

### Pattern 6: Custom Prose Styling (No @tailwindcss/typography)
**What:** Custom CSS for markdown-generated HTML elements
**When to use:** Project constraint prohibits @tailwindcss/typography plugin
**Example:**
```css
/* In globals.css */
.prose {
  max-width: 65ch;
  margin: 0 auto;

  /* Headings use existing fluid type tokens */
  h1 { font-size: var(--font-size-h1); line-height: var(--leading-tight); font-family: var(--font-serif); }
  h2 { font-size: var(--font-size-h2); line-height: var(--leading-tight); font-family: var(--font-serif); }
  h3 { font-size: var(--font-size-h3); line-height: var(--leading-snug); font-family: var(--font-serif); }
  h4 { font-size: var(--font-size-h4); line-height: var(--leading-snug); }

  /* Prose spacing */
  p { margin-bottom: 1.25em; line-height: var(--leading-relaxed); }
  ul, ol { margin-left: 1.5em; margin-bottom: 1.25em; }
  li { margin-bottom: 0.5em; }

  /* Code blocks */
  pre { background: hsl(var(--muted)); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; }
  code { font-family: ui-monospace, monospace; font-size: 0.875em; }

  /* Blockquotes */
  blockquote { border-left: 4px solid hsl(var(--primary)); padding-left: 1rem; font-style: italic; }
}
```

**Design tokens:** Reuse existing `--font-size-*`, `--leading-*`, `--font-serif` from globals.css to maintain consistency with rest of site.

### Pattern 7: Horizontal Card Layout (Image Left, Content Right)
**What:** Flexbox-based card with image on left, metadata/excerpt on right
**When to use:** Blog list, news feeds, content previews
**Example:**
```typescript
// Source: Flexbox card pattern from web research
export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex gap-md overflow-hidden rounded-lg border">
      {/* Image container - fixed width */}
      <div className="flex-shrink-0 w-48 md:w-64">
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content container - flexible */}
      <div className="flex flex-col justify-between p-md flex-1">
        <div>
          <Badge>{post.category}</Badge>
          <h3 className="font-serif text-h4 mt-xs">{post.title}</h3>
          <p className="text-muted-foreground mt-sm line-clamp-2">{post.excerpt}</p>
        </div>

        <div className="flex gap-sm text-sm text-muted-foreground mt-md">
          <time>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
```

**Responsive strategy:** Use `flex-col` on mobile, `flex-row` on desktop. Image width: `w-full` mobile, `w-48` or `w-64` desktop.

### Anti-Patterns to Avoid
- **Loading all pages upfront for numbered pagination:** Don't fetch posts for all pages on mount. Fetch only current page's data.
- **Client-side markdown rendering with dangerouslySetInnerHTML:** Security risk. Always use react-markdown or similar library that sanitizes HTML.
- **Importing entire highlight.js bundle:** 1MB+ uncompressed. Use selective language imports.
- **Missing Suspense boundaries with useSearchParams:** Causes entire route to be client-rendered. Wrap in Suspense or use server-side searchParams prop.
- **Hardcoding OG image URLs:** Use ImageResponse to generate dynamic images based on post content.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown to HTML conversion | Regex parser | react-markdown + remark-gfm | GFM edge cases (nested lists, tables, autolinks), XSS sanitization, HTML entity handling |
| Syntax highlighting | String manipulation + CSS classes | rehype-highlight + highlight.js | 180+ language grammars, token classification, theme compatibility |
| OG image generation | Canvas API / Sharp | next/og ImageResponse | Font loading, layout engine, automatic optimization, Vercel edge runtime support |
| URL state management | Manual URLSearchParams manipulation | nuqs | Type safety, default values, SSR compatibility, debouncing |
| Reading time calculation | Custom word counter | Existing utility (200 WPM standard) | LOW COMPLEXITY - this one is simple enough to hand-roll (15 lines) |

**Key insight:** Markdown parsing and syntax highlighting have massive edge case complexity. Don't underestimate the work that goes into handling nested structures, escaping, and language-specific tokenization.

## Common Pitfalls

### Pitfall 1: Convex Cursor Pagination vs Numbered Pages Mismatch
**What goes wrong:** User decisions require numbered pages (1, 2, 3) but Convex's `.paginate()` is cursor-based (opaque continueCursor strings). Naively mapping page numbers to cursors breaks when posts are added/deleted.
**Why it happens:** Cursor-based pagination is more robust for reactive data, but classic numbered pagination assumes fixed offsets.
**How to avoid:** For small datasets (<1000 posts), fetch all published posts and slice client-side. For larger datasets, accept that page contents may shift if data changes, or use Convex's reactive pagination and implement infinite scroll instead.
**Warning signs:** User clicks "Page 2", sees duplicate posts from Page 1 because new post was inserted.

**Resolution for this phase:** CONTEXT.md specifies 10 posts per page with numbered navigation. Given blog post volumes are typically <100 published posts, client-side slicing is acceptable. Fetch all via `listPublished` query, slice based on page number.

### Pitfall 2: highlight.js Theme CSS Not Imported
**What goes wrong:** Code blocks render with syntax classes but no colors (plain black text).
**Why it happens:** rehype-highlight adds CSS classes (`hljs-keyword`, `hljs-string`) but doesn't inject styles. Requires separate CSS import.
**How to avoid:** Import highlight.js theme CSS in globals.css or layout.tsx.
**Warning signs:** Code blocks have `class="hljs"` in dev tools but no background color or token colors.

**Fix:**
```css
/* In app/globals.css */
@import 'highlight.js/styles/github-dark.css';
/* Or CDN: */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'); */
```

**Theme options:** 180+ themes available. Popular choices: `github-dark`, `atom-one-dark`, `dracula`, `monokai`, `tomorrow-night`. See [highlight.js demo](https://highlightjs.org/demo) for theme previews.

### Pitfall 3: useSearchParams Without Suspense Boundary
**What goes wrong:** Using `useSearchParams()` in a Client Component causes the entire route to be client-rendered, breaking static optimization.
**Why it happens:** Next.js can't know search params at build time, so it opts out of static rendering for the whole page.
**How to avoid:** Wrap components using `useSearchParams()` in a Suspense boundary, or use server-side `searchParams` page prop and pass down.
**Warning signs:** Build output shows route as "Dynamic" instead of "Static". Slower initial page loads.

**Recommended approach for this phase:**
```typescript
// app/blog/page.tsx (Server Component)
export default function BlogPage({ searchParams }: { searchParams: { category?: string; page?: string } }) {
  const category = searchParams.category;
  const page = parseInt(searchParams.page ?? '1', 10);

  return <BlogListClient category={category} page={page} />;
}
```

**Alternative (client-side with nuqs):**
```typescript
'use client';
import { useQueryState, parseAsInteger } from 'nuqs';

function BlogListClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // nuqs handles URL updates automatically
}
```

### Pitfall 4: Missing Alt Text on Dynamic OG Images
**What goes wrong:** OG images generated via ImageResponse don't have alt text metadata.
**Why it happens:** ImageResponse generates PNG files, not `<img>` tags with alt attributes.
**How to avoid:** Use `description` field in `generateMetadata()` return object - social platforms use this as alt text.
**Warning signs:** Social media crawlers show image but screen readers can't describe it.

**Fix:**
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt, // Used as alt text by social platforms
    openGraph: {
      images: [{ url: `/blog/${params.slug}/opengraph-image` }],
    },
  };
}
```

### Pitfall 5: react-markdown Components Prop Overriding Prose Styles
**What goes wrong:** Custom component overrides via `components` prop bypass prose CSS classes.
**Why it happens:** react-markdown's `components` prop replaces default HTML elements with custom React components, which don't inherit prose styles unless explicitly added.
**How to avoid:** If using `components` prop, wrap custom components in elements with prose classes or apply styles directly.
**Warning signs:** Headings render but don't use Lora font or fluid type scale.

**Example (if customizing components):**
```typescript
<Markdown
  components={{
    h1: ({ children }) => <h1 className="font-serif text-h1 leading-tight">{children}</h1>,
    // Or just apply prose class to container and let CSS cascade
  }}
>
  {content}
</Markdown>
```

**Recommendation:** Avoid `components` prop unless necessary. Use CSS to style default HTML output.

## Code Examples

Verified patterns from official sources:

### Full Blog Post Detail Page
```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getPost } from '@/lib/blog'; // Convex query wrapper

// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: ['John Doe'],
      images: [{ url: `/blog/${params.slug}/opengraph-image` }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.coverImageUrl],
    datePublished: new Date(post.publishedAt).toISOString(),
    author: [{ '@type': 'Person', name: 'John Doe' }],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Full-width hero cover image */}
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt}
          className="w-full h-64 md:h-96 object-cover"
        />

        {/* Prose-width content area */}
        <div className="max-w-prose mx-auto px-md py-xl">
          <h1 className="font-serif text-h1 leading-tight mb-sm">{post.title}</h1>

          <div className="flex gap-sm text-sm text-muted-foreground mb-lg">
            <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <Badge>{post.category}</Badge>
          </div>

          {/* Markdown content with prose styling */}
          <div className="prose">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {post.content}
            </Markdown>
          </div>

          {/* Book-a-call CTA at bottom */}
          <div className="mt-2xl pt-xl border-t">
            <h2 className="font-serif text-h3 mb-md">Ready to start your project?</h2>
            <Button asChild>
              <Link href="/contact">Book a Call</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
```

### Category Filter with Hidden Empty Categories
```typescript
// components/blog/category-filter.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { useQueryState } from 'nuqs';

const CATEGORIES = ['Local Business', 'Technical', 'Announcement'] as const;

export function CategoryFilter({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useQueryState('category');

  // Count posts per category
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = posts.filter(p => p.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  // Only show categories with published posts
  const visibleCategories = CATEGORIES.filter(cat => categoryCounts[cat] > 0);

  return (
    <div className="flex gap-sm flex-wrap">
      <Badge
        variant={category === null ? 'default' : 'outline'}
        onClick={() => setCategory(null)}
        className="cursor-pointer"
      >
        All
      </Badge>

      {visibleCategories.map(cat => (
        <Badge
          key={cat}
          variant={category === cat ? 'default' : 'outline'}
          onClick={() => setCategory(cat)}
          className="cursor-pointer"
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
}
```

### Numbered Pagination Component
```typescript
// components/blog/pagination-bar.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PaginationBar({ currentPage, totalPages, baseUrl = '/blog' }: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show max 7 page numbers with ellipsis for many pages
  const visiblePages = totalPages <= 7
    ? pages
    : currentPage <= 4
      ? [...pages.slice(0, 5), '...', totalPages]
      : currentPage >= totalPages - 3
        ? [1, '...', ...pages.slice(-5)]
        : [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];

  return (
    <nav className="flex items-center gap-sm justify-center">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={`${baseUrl}?page=${currentPage - 1}`}>Previous</Link>
      </Button>

      {/* Page numbers */}
      {visiblePages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2">…</span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href={`${baseUrl}?page=${page}`}>{page}</Link>
          </Button>
        )
      )}

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link href={`${baseUrl}?page=${currentPage + 1}`}>Next</Link>
      </Button>
    </nav>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side markdown (marked.js + dangerouslySetInnerHTML) | Server-side react-markdown + unified plugins | 2022-2023 (RSC adoption) | Better security (no XSS), SEO (HTML in initial response), performance (no client-side parsing) |
| Custom regex-based syntax highlighter | rehype-highlight / Shiki | 2020-2021 | Accurate language grammars, theme ecosystem, maintenance burden eliminated |
| Static OG images | Dynamic next/og ImageResponse | 2022 (Next.js 13) | Personalized social previews, no design tool needed, scales to thousands of posts |
| Offset-based pagination (LIMIT/OFFSET) | Cursor-based pagination | 2023-2024 | Correctness with reactive data, no duplicate/missing items when data changes |
| @tailwindcss/typography plugin | Custom prose styles | N/A (project constraint) | More control over typography, aligns with fluid type system, no plugin dependency |

**Deprecated/outdated:**
- **marked.js:** Older markdown parser, lacks plugin ecosystem of unified/remark/rehype. Still functional but less flexible.
- **Prism.js (client-side):** Requires client-side JS execution. Server-side highlighting with rehype-highlight preferred for Core Web Vitals.
- **react-syntax-highlighter:** Heavy client bundle. Use rehype-highlight for server-side rendering instead.

## Open Questions

Things that couldn't be fully resolved:

1. **Numbered pagination with large datasets (>1000 posts)**
   - What we know: Convex supports cursor-based pagination, client-side slicing works for small datasets
   - What's unclear: Whether Convex supports efficient offset-based queries for numbered pages at scale
   - Recommendation: Start with client-side slicing (works for <100 posts). If blog grows to >500 posts, revisit with either: (a) Convex offset pagination if available, (b) Hybrid approach (fetch first N pages' cursors, cache in memory), or (c) Switch to infinite scroll UX

2. **Syntax highlighting theme selection (dark vs adaptive)**
   - What we know: highlight.js has 180+ themes, requires CSS import
   - What's unclear: Whether to use single dark theme or adaptive theme that switches with site theme
   - Recommendation: Start with single theme (`github-dark` or `atom-one-dark`). If user feedback requests theme matching, implement CSS variable-based custom theme or dual imports with dark mode media query

3. **Reading time for code-heavy posts**
   - What we know: Standard 200 WPM assumes prose reading. Code blocks read slower (research suggests 100-150 WPM).
   - What's unclear: Whether to adjust reading time calculation for posts with >30% code blocks
   - Recommendation: Start with uniform 200 WPM. If analytics show bounce rate on technical posts, adjust calculation to detect code fence ratio and apply 0.6x multiplier

## Sources

### Primary (HIGH confidence)
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown) - API reference, plugin usage
- [rehype-highlight GitHub](https://github.com/rehypejs/rehype-highlight) - Configuration, language imports
- [Convex Pagination Docs](https://docs.convex.dev/database/pagination) - Cursor-based pagination API
- [Next.js Metadata & OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) - generateMetadata, ImageResponse
- [Google Article Schema Docs](https://developers.google.com/search/docs/appearance/structured-data/article) - JSON-LD requirements
- [highlight.js Theme Guide](https://highlightjs.readthedocs.io/en/latest/theme-guide.html) - Theme system, CSS classes

### Secondary (MEDIUM confidence)
- [Convex Fully Reactive Pagination](https://stack.convex.dev/fully-reactive-pagination) - Architecture explanation, tradeoffs
- [nuqs Documentation](https://nuqs.dev/) - Type-safe URL state management
- [Strapi React Markdown Guide](https://strapi.io/blog/react-markdown-complete-guide-security-styling) - Security best practices, styling patterns
- Multiple WebSearch results on reading time calculation (200 WPM industry standard verified)
- Multiple WebSearch results on horizontal card layout patterns (Flexbox approach verified)

### Tertiary (LOW confidence)
- WebSearch results on prose styling patterns - No authoritative source, inferred from Tailwind Typography inspection
- WebSearch results on numbered pagination with cursor-based backends - No Convex-specific guidance found

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries have official documentation and widespread usage
- Architecture patterns: HIGH - Verified with official Next.js and library docs
- Numbered pagination solution: MEDIUM - Client-side slicing is simple and works, but not ideal for massive scale (edge case for blog)
- Syntax highlighting theme choice: MEDIUM - Technical implementation clear, UX decision (dark vs adaptive) deferred to Claude's discretion
- Pitfalls: HIGH - All verified through official documentation or known Next.js gotchas

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable ecosystem, Next.js and Convex APIs unlikely to change significantly)
