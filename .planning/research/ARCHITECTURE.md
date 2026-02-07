# Architecture Research: Blog & Content Management Integration

**Domain:** Blog/Content Management for Next.js 14 + Convex Portfolio Site
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

This research covers integrating blog posts, testimonials, and case studies into the existing jpgerton.com portfolio architecture (Next.js 14 App Router + Convex + Tailwind v4). The architecture extends proven patterns from the existing projects table to new content types while maintaining server-first rendering for SEO and leveraging Convex's real-time capabilities for admin features.

**Key architectural decisions:**
- Markdown stored in Convex, rendered server-side with remark/rehype
- Three new tables: blogPosts, testimonials, caseStudies
- Existing admin layout pattern extended with new tabs
- Existing composition components (TestimonialCard, CaseStudyVisual) populated with real data
- Server Components for public pages, Client Components for admin CRUD
- Static generation for blog posts with ISR fallback

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC SITE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /blog (list) ────────┐                                        │
│  /blog/[slug] ────────┼──> Server Components                   │
│  /projects/[slug] ────┘    ├─> generateMetadata (SEO)         │
│                            ├─> fetchQuery (Convex SSR)         │
│                            └─> react-markdown (RSC)            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        ADMIN DASHBOARD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /admin/blog ─────────┐                                        │
│  /admin/testimonials ─┼──> Client Components                   │
│  /admin/case-studies ─┘    ├─> useQuery/useMutation           │
│                            ├─> dnd-kit (drag reorder)          │
│                            └─> ConfirmDialog (delete)          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        CONVEX BACKEND                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  blogPosts table ─────┐                                        │
│  testimonials table ──┼──> Schema + Indexes                    │
│  caseStudies table ───┘    ├─> Queries (list, getBySlug)      │
│                            ├─> Mutations (CRUD + reorder)      │
│                            └─> Auth checks (getAuthUserId)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Recommended Project Structure

```
wp-designer/
├── app/
│   ├── (home)/
│   │   └── page.tsx                    # Existing landing page
│   ├── blog/
│   │   ├── page.tsx                    # NEW: Blog list (Server Component)
│   │   └── [slug]/
│   │       └── page.tsx                # NEW: Blog post detail (Server Component)
│   ├── admin/
│   │   ├── layout.tsx                  # MODIFY: Add blog/testimonials/case-studies tabs
│   │   ├── blog/
│   │   │   ├── page.tsx                # NEW: Blog list admin (Client Component)
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # NEW: Create blog post
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx        # NEW: Edit blog post
│   │   ├── testimonials/
│   │   │   ├── page.tsx                # NEW: Testimonials admin
│   │   │   └── ...                     # NEW: CRUD pages
│   │   └── case-studies/
│   │       ├── page.tsx                # NEW: Case studies admin
│   │       └── ...                     # NEW: CRUD pages
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx                # MODIFY: Add real case study data
│   └── about/
│       └── page.tsx                    # MODIFY: Add real testimonials
├── components/
│   ├── admin/
│   │   ├── admin-tabs.tsx              # MODIFY: Add new tabs
│   │   ├── markdown-editor.tsx         # NEW: Rich markdown editor
│   │   ├── sortable-blog-list.tsx      # NEW: Drag-to-reorder blog posts
│   │   ├── sortable-testimonial-list.tsx # NEW: Drag-to-reorder testimonials
│   │   └── blog-post-form.tsx          # NEW: Blog post form fields
│   ├── blog/
│   │   ├── blog-post-card.tsx          # NEW: Blog preview card
│   │   ├── blog-post-content.tsx       # NEW: Markdown renderer wrapper
│   │   └── blog-post-meta.tsx          # NEW: Author, date, reading time
│   └── portfolio/
│       ├── testimonial-card.tsx        # EXISTING: Already supports props
│       ├── case-study-visual.tsx       # EXISTING: Already supports props
│       └── social-proof-display.tsx    # EXISTING: Already supports metrics
├── convex/
│   ├── schema.ts                       # MODIFY: Add new tables
│   ├── blogPosts.ts                    # NEW: Blog queries/mutations
│   ├── testimonials.ts                 # NEW: Testimonials queries/mutations
│   ├── caseStudies.ts                  # NEW: Case studies queries/mutations
│   └── projects.ts                     # EXISTING: Pattern to replicate
└── lib/
    ├── markdown.ts                     # NEW: remark/rehype utilities
    ├── slug.ts                         # NEW: Slug generation/validation
    └── reading-time.ts                 # NEW: Calculate reading time
```

## Convex Schema Design

### New Tables (add to schema.ts)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // EXISTING: healthChecks, projects, contactSubmissions

  // NEW: Blog posts table
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),                    // Short description (160 chars max)
    content: v.string(),                    // Full markdown content
    coverImageId: v.optional(v.id("_storage")), // Convex storage ID
    authorId: v.id("users"),                // Reference to auth user
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    publishedAt: v.optional(v.number()),    // null for drafts
    tags: v.array(v.string()),              // ["Next.js", "TypeScript"]
    displayOrder: v.number(),               // For manual ordering
    createdAt: v.number(),                  // Date.now()
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_published", ["publishedAt"])
    .index("by_order", ["displayOrder"]),

  // NEW: Testimonials table
  testimonials: defineTable({
    quote: v.string(),
    name: v.string(),
    title: v.string(),                      // Job title
    company: v.string(),
    photoId: v.optional(v.id("_storage")),  // Convex storage ID
    featured: v.boolean(),                  // Show on home page
    displayOrder: v.number(),
    createdAt: v.number(),
  })
    .index("by_featured", ["featured"])
    .index("by_order", ["displayOrder"]),

  // NEW: Case studies table
  caseStudies: defineTable({
    projectId: v.id("projects"),            // Link to project
    problemHeading: v.string(),
    problemContent: v.string(),
    solutionHeading: v.string(),
    solutionContent: v.string(),
    resultsHeading: v.string(),
    resultsContent: v.string(),
    metrics: v.array(v.string()),           // ["50% faster", "20K users"]
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"]),
});
```

**Key design decisions:**

1. **Slug uniqueness**: No unique constraint (Convex doesn't support), validate in mutation
2. **Author reference**: Uses Convex Auth userId, not embedded user data
3. **Image storage**: Uses Convex storage IDs, resolved to URLs in queries
4. **Ordering**: Manual displayOrder field (like projects table pattern)
5. **Timestamps**: Manual createdAt field (Date.now()), use _creationTime for audit trail
6. **Case studies**: Linked to projects table, not standalone content

## Data Flow Patterns

### Blog Post Creation Flow

```
1. Admin opens /admin/blog/new
   └─> Client Component with form + markdown editor

2. Admin fills form, uploads cover image
   ├─> useMutation(api.blogPosts.generateUploadUrl)
   ├─> POST to upload URL (Convex storage)
   └─> Receive storageId

3. Admin clicks "Save Draft"
   └─> useMutation(api.blogPosts.create, {
         title, slug, excerpt, content, coverImageId,
         status: "draft", tags, ...
       })

4. Mutation validates + inserts
   ├─> getAuthUserId(ctx) - auth check
   ├─> Check slug uniqueness
   ├─> Set displayOrder (max + 1)
   ├─> ctx.db.insert("blogPosts", {...})
   └─> Return postId

5. Admin navigates to blog list
   └─> useQuery(api.blogPosts.list) shows new draft
```

### Blog Post Rendering Flow (Public Site)

```
1. User navigates to /blog/my-first-post
   └─> Server Component: app/blog/[slug]/page.tsx

2. generateMetadata runs first
   ├─> await fetchQuery(api.blogPosts.getBySlug, { slug })
   ├─> Return { title, description, openGraph {...} }
   └─> Next.js sets <head> tags (SEO)

3. Page component renders
   ├─> await fetchQuery(api.blogPosts.getBySlug, { slug })
   ├─> if (!post) notFound()
   ├─> Pass post.content to <BlogPostContent>
   └─> Server Component renders markdown

4. BlogPostContent processes markdown
   ├─> import { unified } from "unified"
   ├─> .use(remarkParse)           # Parse markdown
   ├─> .use(remarkGfm)             # GitHub tables/strikethrough
   ├─> .use(remarkRehype)          # Convert to HTML
   ├─> .use(rehypeHighlight)       # Code syntax highlighting
   ├─> .use(rehypeReact)           # Convert to React elements
   └─> Return React tree (no client JS for markdown)

5. Next.js streams HTML to browser
   └─> Fully SEO-friendly (crawlers see rendered content)
```

### Testimonial Integration Flow

```
1. Admin creates testimonial at /admin/testimonials/new
   └─> useMutation(api.testimonials.create, { quote, name, title, company, photoId, featured })

2. About page renders testimonials
   ├─> Server Component: app/about/page.tsx
   ├─> const testimonials = await fetchQuery(api.testimonials.list, { featured: true })
   └─> <TestimonialCard {...testimonial} /> (existing component)

3. TestimonialCard receives real data
   ├─> photo URL resolved from photoId by query
   ├─> name/title/company from database
   └─> No code changes needed (already accepts props)
```

## Component Responsibilities

### New Components

| Component | Type | Responsibility | Implementation |
|-----------|------|---------------|----------------|
| `blog/page.tsx` | Server | Blog list page, pagination | fetchQuery + BlogPostCard grid |
| `blog/[slug]/page.tsx` | Server | Blog post detail, SEO | generateMetadata + BlogPostContent |
| `BlogPostCard` | Server | Blog preview in list | Card with image, title, excerpt, tags |
| `BlogPostContent` | Server | Markdown renderer | unified pipeline (remark/rehype) |
| `BlogPostMeta` | Server | Author, date, reading time | Avatar + formatted date |
| `admin/blog/page.tsx` | Client | Blog admin list | useQuery + SortableBlogList |
| `admin/blog/new/page.tsx` | Client | Create blog post | MarkdownEditor + form |
| `MarkdownEditor` | Client | Rich markdown editing | Textarea with preview, syntax highlighting |
| `SortableBlogList` | Client | Drag-to-reorder blog posts | dnd-kit (like SortableProjectList) |

### Modified Components

| Component | Change | Reason |
|-----------|--------|--------|
| `admin/layout.tsx` | Add tabs: Blog, Testimonials, Case Studies | Consistent admin nav |
| `admin/admin-tabs.tsx` | Add 3 new tab entries | Navigation |
| `projects/[slug]/page.tsx` | Query caseStudies table, populate CaseStudyVisual | Replace placeholder data |
| `about/page.tsx` | Query testimonials table, map to TestimonialCard | Replace placeholder data |

### Unchanged Components (already support props)

| Component | Why It Works |
|-----------|--------------|
| `TestimonialCard` | Already accepts quote, name, title, company, photo props |
| `CaseStudyVisual` | Already accepts problem, solution, results sections |
| `SocialProofDisplay` | Already accepts metrics array |

## Architectural Patterns

### Pattern 1: Server-Side Markdown Rendering

**What:** Render markdown to React on the server using unified/remark/rehype

**When:** Blog post content, case study descriptions

**Why:** SEO, performance (no client-side parsing), security (sanitized HTML)

**Implementation:**

```typescript
// lib/markdown.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";

export async function renderMarkdown(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeReact, prod)
    .process(content);

  return file.result;
}

// components/blog/blog-post-content.tsx (Server Component)
import { renderMarkdown } from "@/lib/markdown";

export async function BlogPostContent({ content }: { content: string }) {
  const rendered = await renderMarkdown(content);
  return <article className="prose prose-lg">{rendered}</article>;
}
```

### Pattern 2: Convex Storage for Images

**What:** Upload images to Convex storage, store IDs in database, resolve URLs in queries

**When:** Blog cover images, testimonial photos, project screenshots

**Why:** Free CDN, automatic cleanup, type-safe references, existing pattern

**Implementation:**

```typescript
// convex/blogPosts.ts
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!post) return null;

    const coverImageUrl = post.coverImageId
      ? await ctx.storage.getUrl(post.coverImageId)
      : null;

    return { ...post, coverImageUrl };
  },
});
```

### Pattern 3: Slug Generation and Validation

**What:** Generate URL-safe slugs from titles, validate uniqueness

**When:** Creating/editing blog posts, case studies

**Why:** SEO-friendly URLs, prevent duplicates, handle special characters

**Implementation:**

```typescript
// lib/slug.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")                   // Decompose accents
    .replace(/[\u0300-\u036f]/g, "")   // Remove accents
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")      // Remove special chars
    .replace(/\s+/g, "-")               // Spaces to hyphens
    .replace(/-+/g, "-")                // Collapse hyphens
    .replace(/^-|-$/g, "");             // Trim hyphens
}

// Zod validation
import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9][a-z0-9._-]*$/, "Invalid slug format");

// convex/blogPosts.ts mutation
export const create = mutation({
  args: { slug: v.string(), ... },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Validate slug uniqueness
    const existing = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Slug "${args.slug}" already exists`);
    }

    // Insert...
  },
});
```

### Pattern 4: SEO Metadata Generation

**What:** Export async generateMetadata from page components to set dynamic <head> tags

**When:** Blog post pages, project pages, case study pages

**Why:** SEO, social sharing (Open Graph), Next.js best practice

**Implementation:**

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await fetchQuery(api.blogPosts.getBySlug, { slug });

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: "Jon Gerton" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}
```

### Pattern 5: Admin CRUD with dnd-kit Reordering

**What:** Replicate existing projects admin pattern for blog posts

**When:** Admin blog list, testimonials list, case studies list

**Why:** Consistent UX, proven pattern, manual ordering control

**Implementation:**

```typescript
// app/admin/blog/page.tsx (Client Component)
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SortableBlogList } from "@/components/admin/sortable-blog-list";

export default function AdminBlogPage() {
  const posts = useQuery(api.blogPosts.list);
  const reorder = useMutation(api.blogPosts.reorder);
  const remove = useMutation(api.blogPosts.remove);

  const handleReorder = async (reorderedPosts) => {
    const postIds = reorderedPosts.map((p) => p._id);
    await reorder({ postIds });
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      <SortableBlogList
        posts={posts}
        onReorder={handleReorder}
        onDelete={(post) => setDeleteTarget(post)}
      />
    </div>
  );
}

// components/admin/sortable-blog-list.tsx
// Copy SortableProjectList pattern, swap "project" with "post"
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side Markdown Rendering for SEO Content

**What:** Using `"use client"` + react-markdown for blog post pages

**Why bad:** Crawlers may not execute client JS, slower initial render, larger bundle

**Instead:** Use Server Component with unified/rehype-react pipeline

**Detection:** Blog post content appears blank when JS disabled

---

### Anti-Pattern 2: Storing Markdown in Separate Files

**What:** Storing markdown in `/content` directory, reading via fs.readFile

**Why bad:** Breaks Convex real-time model, requires build-time sync, admin can't edit

**Instead:** Store markdown as string field in Convex blogPosts table

**Detection:** Admin can't create posts without deploying code

---

### Anti-Pattern 3: Embedding User Data in Posts

**What:** Storing authorName, authorEmail directly in blogPosts table

**Why bad:** Duplication, stale data when user updates profile, no referential integrity

**Instead:** Store authorId reference, join in query

**Example:**

```typescript
// WRONG
blogPosts: defineTable({
  authorName: v.string(),
  authorEmail: v.string(),
})

// RIGHT
blogPosts: defineTable({
  authorId: v.id("users"),
})

// In query
export const getBySlug = query({
  handler: async (ctx, args) => {
    const post = await ctx.db.query("blogPosts")...;
    const author = await ctx.db.get(post.authorId);
    return { ...post, author };
  },
});
```

---

### Anti-Pattern 4: Manual Image Hosting

**What:** Uploading images to external CDN (Cloudinary, Imgix), storing URLs

**Why bad:** Extra cost, manual cleanup, broken links, ignores Convex storage

**Instead:** Use Convex storage with generateUploadUrl pattern (already proven in projects table)

**Detection:** Image URLs are external domains, not Convex storage URLs

---

### Anti-Pattern 5: Timestamps Without Timezone Awareness

**What:** Storing timestamps as locale strings ("2026-02-06 3:00 PM")

**Why bad:** Ambiguous timezone, unparseable, unsortable

**Instead:** Store as Unix timestamp (Date.now()), format in UI

**Example:**

```typescript
// WRONG
createdAt: v.string(), // "2026-02-06 3:00 PM"

// RIGHT
createdAt: v.number(), // 1707235200000

// In UI
new Date(post.createdAt).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
```

---

### Anti-Pattern 6: Coupling TestimonialCard to Testimonials Table

**What:** Fetching testimonials data inside TestimonialCard component

**Why bad:** Component becomes client-only, can't be reused with hardcoded data

**Instead:** Keep TestimonialCard presentational (props only), fetch in parent

**Detection:** Component has "use client" and useQuery inside

## Integration Points with Existing Architecture

### Integration Point 1: Admin Tabs Navigation

**File:** `components/admin/admin-tabs.tsx`

**Change:** Add 3 new tabs

```typescript
const tabs = [
  { name: "Projects", href: "/admin/projects" },
  { name: "Contacts", href: "/admin/contacts" },
  { name: "Blog", href: "/admin/blog" },              // NEW
  { name: "Testimonials", href: "/admin/testimonials" }, // NEW
  { name: "Case Studies", href: "/admin/case-studies" }, // NEW
];
```

**Impact:** Minimal, follows existing pattern

---

### Integration Point 2: Projects Detail Page

**File:** `app/projects/[slug]/page.tsx`

**Current:** Uses placeholder data for CaseStudyVisual

```typescript
const caseStudyData = {
  problem: { heading: "The Challenge", content: project.descriptionLong },
  solution: { heading: "The Approach", content: "Built with modern tech..." },
  results: { heading: "The Result", content: "A polished application...", metrics: [...] },
};
```

**Change:** Query caseStudies table

```typescript
const project = await fetchQuery(api.projects.getBySlug, { slug });
const caseStudy = await fetchQuery(api.caseStudies.getByProjectId, { projectId: project._id });

const caseStudyData = caseStudy
  ? {
      problem: { heading: caseStudy.problemHeading, content: caseStudy.problemContent },
      solution: { heading: caseStudy.solutionHeading, content: caseStudy.solutionContent },
      results: { heading: caseStudy.resultsHeading, content: caseStudy.resultsContent, metrics: caseStudy.metrics },
    }
  : defaultCaseStudyData; // Fallback
```

**Impact:** Moderate, requires new query, backward compatible with fallback

---

### Integration Point 3: About Page Testimonials

**File:** `app/about/page.tsx`

**Current:** No testimonials section (or hardcoded)

**Change:** Add testimonials section

```typescript
const testimonials = await fetchQuery(api.testimonials.list, { featured: true });

return (
  <SectionBackground variant="muted">
    <h2 className="font-serif text-h2 mb-lg">What Clients Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      {testimonials.map((t) => (
        <TestimonialCard key={t._id} {...t} />
      ))}
    </div>
  </SectionBackground>
);
```

**Impact:** Low, TestimonialCard already exists and accepts props

---

### Integration Point 4: Home Page Blog Preview

**File:** `app/(home)/page.tsx`

**Change:** Add "Latest Posts" section above footer CTA

```typescript
const latestPosts = await fetchQuery(api.blogPosts.listPublished, { limit: 3 });

return (
  <>
    {/* Existing hero, projects, services... */}

    <SectionBackground variant="neutral">
      <h2 className="font-serif text-h2 mb-lg">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {latestPosts.map((post) => (
          <BlogPostCard key={post._id} {...post} />
        ))}
      </div>
      <div className="text-center mt-lg">
        <Link href="/blog">
          <Button variant="outline">View All Posts</Button>
        </Link>
      </div>
    </SectionBackground>

    {/* Existing footer CTA */}
  </>
);
```

**Impact:** Low, new section but follows existing patterns

## Build Order Recommendations

### Phase 1: Foundation (Schema + Basic Queries)

**Why first:** Establishes data model, unblocks all other work

**Tasks:**
1. Add blogPosts, testimonials, caseStudies tables to schema.ts
2. Create convex/blogPosts.ts with list, getBySlug, create, update, remove, reorder mutations
3. Create convex/testimonials.ts (mirror projects.ts pattern)
4. Create convex/caseStudies.ts (mirror projects.ts pattern)
5. Deploy schema: `bunx convex deploy`

**Validation:** Run queries in Convex dashboard, insert test data

---

### Phase 2: Admin UI (CRUD Pages)

**Why second:** Enables content creation before public pages

**Tasks:**
1. Create components/admin/markdown-editor.tsx (textarea + preview)
2. Create components/admin/sortable-blog-list.tsx (copy SortableProjectList pattern)
3. Create app/admin/blog/page.tsx (list with drag-to-reorder)
4. Create app/admin/blog/new/page.tsx (form + markdown editor)
5. Create app/admin/blog/[id]/edit/page.tsx (edit form)
6. Repeat for testimonials and case-studies
7. Update components/admin/admin-tabs.tsx (add 3 tabs)

**Validation:** Create test blog post, testimonial, case study via admin

---

### Phase 3: Public Blog Pages (SEO-Optimized)

**Why third:** Requires content from Phase 2, benefits from admin testing

**Tasks:**
1. Create lib/markdown.ts (unified/remark/rehype pipeline)
2. Create lib/slug.ts (slugify + validation)
3. Create lib/reading-time.ts (calculate from word count)
4. Create components/blog/blog-post-content.tsx (markdown renderer)
5. Create components/blog/blog-post-card.tsx (preview card)
6. Create components/blog/blog-post-meta.tsx (author, date, reading time)
7. Create app/blog/page.tsx (list with pagination)
8. Create app/blog/[slug]/page.tsx (detail with generateMetadata)

**Validation:** Visit /blog, click post, check SEO with Lighthouse

---

### Phase 4: Integration with Existing Pages

**Why fourth:** Depends on testimonials/case studies data from Phase 2

**Tasks:**
1. Modify app/projects/[slug]/page.tsx to query caseStudies table
2. Modify app/about/page.tsx to query testimonials table
3. Modify app/(home)/page.tsx to add "Latest Posts" section
4. Update testimonials/case studies to use real Avatar URLs from storage

**Validation:** Check projects detail page shows real case study, about page shows testimonials

---

### Phase 5: Polish (Search, Tags, Analytics)

**Why last:** Nice-to-have features, requires Phase 3 complete

**Tasks:**
1. Add tag filtering to blog list page
2. Add search input (client-side filter or Convex search index)
3. Add "Related Posts" to blog detail (same tags)
4. Add reading progress indicator
5. Add social share buttons

**Validation:** Filter by tag, search posts, click related post

## Scalability Considerations

### At Launch (< 100 posts)

**Approach:** Simple pagination, no search index

**Implementation:**

```typescript
export const listPublished = query({
  args: { limit: v.optional(v.number()), offset: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const offset = args.offset ?? 0;

    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published")
      .order("desc")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    const paginated = posts.slice(offset, offset + limit);
    return { posts: paginated, total: posts.length };
  },
});
```

**Constraints:** O(n) query, acceptable under 1000 posts

---

### At Growth (1K+ posts)

**Approach:** Cursor-based pagination, tag indexes

**Implementation:**

```typescript
// Add index to schema
blogPosts: defineTable({...})
  .index("by_published_desc", ["status", "publishedAt"])

export const listPublished = query({
  args: { cursor: v.optional(v.number()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const cursor = args.cursor;

    let query = ctx.db
      .query("blogPosts")
      .withIndex("by_published_desc", (q) => q.eq("status", "published"))
      .order("desc");

    if (cursor) {
      query = query.filter((q) => q.lt(q.field("publishedAt"), cursor));
    }

    const posts = await query.take(limit + 1);
    const hasMore = posts.length > limit;
    const results = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? results[results.length - 1].publishedAt : null;

    return { posts: results, nextCursor, hasMore };
  },
});
```

**Benefits:** O(1) cursor lookup, infinite scroll support

---

### At Scale (10K+ posts, high traffic)

**Approach:** Convex search index, static generation with ISR

**Implementation:**

```typescript
// Define search index in schema
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

blogPosts: defineTable({...})
  .searchIndex("search_title_content", {
    searchField: "title",
    filterFields: ["status"],
  })

// Search query
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("blogPosts")
      .withSearchIndex("search_title_content", (q) =>
        q.search("title", args.searchTerm).eq("status", "published")
      )
      .take(20);

    return results;
  },
});

// Next.js ISR (app/blog/[slug]/page.tsx)
export const revalidate = 3600; // Revalidate every hour
```

**Benefits:** Full-text search, CDN caching for published posts

## Sources

**Convex Documentation:**
- [Convex Schemas](https://docs.convex.dev/database/schemas) - Schema field types and validation
- [Convex File Storage](https://docs.convex.dev/file-storage) - Upload patterns and CDN integration
- [Convex Likes & Reactions](https://www.convex.dev/can-do/likes-and-reactions) - Real-time interaction patterns
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/) - Query optimization

**Next.js Documentation:**
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Markdown integration with App Router
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Dynamic SEO metadata
- [Next.js Getting Started: Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) - SEO setup

**Markdown Processing:**
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown) - Server component support
- [Markdown Syntax Highlighting with Next.js App Router](https://colinhemphill.com/blog/markdown-syntax-highlighting-with-the-nextjs-app-router) - rehype-highlight patterns
- [Strapi React Markdown Guide](https://strapi.io/blog/react-markdown-complete-guide-security-styling) - Security and styling tips

**Patterns and Best Practices:**
- [Next.js SEO Optimization Guide 2026](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition) - Current SEO best practices
- [Infinite Scroll with Next.js Server Actions](https://blog.logrocket.com/implementing-infinite-scroll-next-js-server-actions/) - Pagination patterns
- [How to slugify a string in JavaScript](https://byby.dev/js-slugify-string) - Slug generation patterns

**Community Resources:**
- [GitHub: markdown-site](https://github.com/waynesutton/markdown-site) - Convex + markdown publishing framework
- [Convex Best Practices Gist](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339) - Schema design patterns
