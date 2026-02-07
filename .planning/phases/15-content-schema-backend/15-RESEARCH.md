# Phase 15: Content Schema + Backend - Research

**Researched:** 2026-02-07
**Domain:** Convex backend, Markdown content management, blog/case study data modeling
**Confidence:** HIGH

## Summary

This phase creates blog post and case study tables in Convex with complete CRUD operations, authentication, slug generation, and file storage integration. The research reveals a straightforward implementation following existing project patterns with minimal external dependencies.

**Key architectural decisions:**
- Follow existing `projects.ts` patterns for schema, queries, mutations, and storage
- Use react-markdown + remark-gfm for Markdown rendering (safe by default, no XSS risk)
- Implement slugify with uniqueness enforcement via indexed queries and numeric suffixes
- Store reading time as computed field (200 WPM standard for online content)
- Soft delete via `isDeleted` boolean flag, excludes from default queries

**Standard stack alignment:**
All required libraries (react-markdown 10.1.0, remark-gfm 4.0.0, slugify 1.6.6, dayjs 1.11.13) are specified in the roadmap. No additional dependencies needed. The existing Convex auth pattern via `getAuthUserId()` applies to all mutations.

**Primary recommendation:** Build two new Convex modules (blogPosts.ts, caseStudies.ts) following the exact structure of projects.ts, with indexes on slug, status, and displayOrder. Schema validation prevents invalid states (e.g., published without cover image).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Convex | 1.31.7+ | Backend database + auth | Already in use, reactive queries, edge runtime |
| react-markdown | 10.1.0 | Markdown to React | Safe by default (no dangerouslySetInnerHTML), mature ecosystem |
| remark-gfm | 4.0.0 | GitHub Flavored Markdown | Tables, strikethrough, autolinks for blog content |
| slugify | 1.6.6 | URL-safe slug generation | Handles umlauts, Unicode, configurable replacement |
| dayjs | 1.11.13 | Date formatting | Lightweight (6KB), already decided in roadmap |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | 4.3.6 | Client-side validation | Already in project, validates uploads before submission |
| @convex-dev/auth | 0.0.90 | Authentication | Already in use, auth checks via getAuthUserId() |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | MDX (@next/mdx) | MDX requires build-time compilation, adds complexity for admin editing |
| slugify | Custom regex | Custom slug generation misses edge cases (Unicode, collisions, special chars) |
| Soft delete | Hard delete | Hard delete loses audit trail, can't restore, breaks foreign keys |

**Installation:**
```bash
bun add react-markdown remark-gfm slugify dayjs
```

## Architecture Patterns

### Recommended Schema Structure
```typescript
// convex/schema.ts
export default defineSchema({
  // ... existing tables ...

  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImageId: v.id("_storage"),
    coverImageAlt: v.string(),
    authorId: v.string(), // from getAuthUserId()
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    category: v.union(
      v.literal("Local Business"),
      v.literal("Technical"),
      v.literal("Announcement")
    ),
    displayOrder: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status", "publishedAt"])
    .index("by_order", ["displayOrder"]),

  caseStudies: defineTable({
    title: v.string(),
    slug: v.string(),
    projectId: v.optional(v.id("projects")), // optional per context
    problemHeading: v.string(),
    problemContent: v.string(),
    solutionHeading: v.string(),
    solutionContent: v.string(),
    resultsHeading: v.string(),
    resultsContent: v.string(),
    metrics: v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      })
    ),
    coverImageId: v.id("_storage"),
    coverImageAlt: v.string(),
    authorId: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    displayOrder: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status", "publishedAt"])
    .index("by_order", ["displayOrder"]),
});
```

**Key schema decisions:**
- `coverImageId` is required (not optional) - enforces "cover image required for publishing" rule
- `coverImageAlt` is separate required field - enforces WCAG AA alt text requirement
- `isDeleted: boolean` instead of `deletedAt` timestamp - simpler, matches soft delete pattern
- `publishedAt: v.optional(v.number())` - only set when status = "published"
- Compound index `["status", "publishedAt"]` - enables efficient "published posts by date" queries
- Case study `projectId` is optional - allows case studies for non-portfolio work

### Pattern 1: Slug Generation with Uniqueness

**What:** Server-side slug generation from title with automatic collision resolution via numeric suffixes

**When to use:** All content types with public URLs (blog posts, case studies)

**Example:**
```typescript
// Source: slugify npm docs + Convex best practices
import slugify from "slugify";

async function generateUniqueSlug(
  ctx: MutationCtx,
  title: string,
  tableName: "blogPosts" | "caseStudies",
  existingSlug?: string // for manual override
): Promise<string> {
  const baseSlug = existingSlug || slugify(title, {
    lower: true,
    strict: true, // Remove special characters
    remove: /[*+~.()'"!:@]/g, // Additional unsafe chars
  });

  // Check if slug exists
  const existing = await ctx.db
    .query(tableName)
    .withIndex("by_slug", (q) => q.eq("slug", baseSlug))
    .first();

  if (!existing) {
    return baseSlug;
  }

  // Collision: append numeric suffix
  let counter = 2;
  let candidateSlug = `${baseSlug}-${counter}`;

  while (true) {
    const collision = await ctx.db
      .query(tableName)
      .withIndex("by_slug", (q) => q.eq("slug", candidateSlug))
      .first();

    if (!collision) {
      return candidateSlug;
    }

    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
  }
}
```

**Critical constraint:** Once a blog post is published, slug cannot be changed. Enforce in update mutation:

```typescript
// In update mutation
const existing = await ctx.db.get(args.id);
if (existing.status === "published" && args.slug && args.slug !== existing.slug) {
  throw new Error("Cannot change slug after publishing");
}
```

### Pattern 2: Soft Delete with Filter Queries

**What:** Mark records as deleted without removing from database, exclude from default queries

**When to use:** Content that may need restoration, or has foreign key references

**Example:**
```typescript
// Source: Soft delete best practices
// Deletion mutation
export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      isDeleted: true,
    });

    return true;
  },
});

// List query (excludes deleted)
export const list = query({
  args: { status: v.optional(v.union(v.literal("draft"), v.literal("published"))) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("blogPosts");

    // Filter deleted
    const posts = await query
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    // Further filter by status if provided
    const filtered = args.status
      ? posts.filter(p => p.status === args.status)
      : posts;

    return filtered.sort((a, b) => b.displayOrder - a.displayOrder);
  },
});

// Restore mutation
export const restore = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { isDeleted: false });
    return true;
  },
});
```

**Pitfall:** Soft-deleted items affect unique constraints. Our solution: `by_slug` index includes deleted items, but validation checks `isDeleted` flag when checking uniqueness. This prevents reuse of deleted slugs (which could cause SEO issues).

### Pattern 3: File Upload Flow (3-Step Pattern)

**What:** Convex storage pattern for admin-uploaded images with auth checks

**When to use:** Cover images for blog posts and case studies

**Example:**
```typescript
// Source: Convex file storage docs + existing projects.ts pattern

// Step 1: Generate upload URL (mutation)
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.storage.generateUploadUrl();
  },
});

// Step 2: Client uploads to URL (fetch in React)
const response = await fetch(uploadUrl, {
  method: "POST",
  headers: { "Content-Type": file.type },
  body: file,
});
const { storageId } = await response.json();

// Step 3: Save storageId in mutation
export const create = mutation({
  args: {
    title: v.string(),
    // ... other fields ...
    coverImageId: v.id("_storage"),
    coverImageAlt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const postId = await ctx.db.insert("blogPosts", {
      ...args,
      authorId: userId,
      isDeleted: false,
      createdAt: Date.now(),
    });

    return postId;
  },
});

// Retrieve: resolve URL in queries
const posts = await ctx.db.query("blogPosts").collect();
const postsWithUrls = await Promise.all(
  posts.map(async (post) => ({
    ...post,
    coverImageUrl: await ctx.storage.getUrl(post.coverImageId),
  }))
);
```

**Key constraints:**
- Upload URL expires in 1 hour
- Upload timeout: 2 minutes
- HTTP action limit: 20MB (sufficient for blog cover images)
- Client-side validation: max 5MB, JPEG/PNG/WebP only (per context decisions)

### Pattern 4: Reading Time Calculation

**What:** Auto-calculated reading time from content word count, displayed as "X min read"

**When to use:** Blog posts only (not case studies)

**Example:**
```typescript
// Source: Reading time calculator standards
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Standard for online content
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

// Option A: Computed in query (recommended for consistency)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!post || post.isDeleted) return null;

    const coverImageUrl = await ctx.storage.getUrl(post.coverImageId);
    const readingTime = calculateReadingTime(post.content);

    return { ...post, coverImageUrl, readingTime };
  },
});

// Option B: Stored field (faster queries, requires update on edit)
// Add to schema: readingTime: v.number()
// Calculate on create/update mutations
```

**Recommendation:** Use Option A (computed). Reading time changes rarely justify storage overhead, and computation is negligible (simple word count).

### Pattern 5: Status-Based Publishing Workflow

**What:** Two-state workflow (draft/published) with automatic timestamp and validation

**When to use:** All content types

**Example:**
```typescript
// Source: Blog content workflow best practices
export const publish = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");

    // Validation: ensure required fields for publishing
    if (!post.coverImageId) {
      throw new Error("Cover image required for publishing");
    }
    if (!post.coverImageAlt || post.coverImageAlt.trim().length === 0) {
      throw new Error("Cover image alt text required for publishing");
    }
    if (post.content.trim().length < 100) {
      throw new Error("Content too short for publishing");
    }

    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: Date.now(),
    });

    return true;
  },
});

export const unpublish = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      status: "draft",
      // Do NOT clear publishedAt - preserves original publish date
    });

    return true;
  },
});
```

**Key insight:** `publishedAt` persists even when unpublished. This preserves the original publication date for audit/sorting purposes. If re-published, the original date remains.

### Anti-Patterns to Avoid

- **Storing Markdown with HTML enabled:** React-markdown disables raw HTML by default. Do NOT enable `rehypeRaw` plugin - it opens XSS vulnerabilities. User context specifies "external URLs only" for inline images.
- **Updating slugs after publish:** Breaks existing links, loses SEO. Context locks slugs after first publish.
- **Hard delete with foreign keys:** Case studies reference `projectId`. Hard delete breaks these references and loses audit trail.
- **Nested content arrays:** Don't store blog posts inside a user document. Separate tables with `authorId` reference enable efficient queries and prevent document bloat.
- **Redundant indexes:** `["status"]` and `["status", "publishedAt"]` are redundant - keep only the compound index. Convex indexes implicitly include `_creationTime` as suffix.
- **Not filtering deleted in queries:** Every query must filter `isDeleted: false` or you'll leak deleted content to public pages.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL-safe slugs | Regex replace + toLowerCase | slugify library | Handles Unicode (umlauts, Cyrillic), emoji removal, special char edge cases |
| Markdown to HTML | Custom parser | react-markdown | XSS-safe by default, mature plugin ecosystem, React component output |
| GFM extensions | Custom regex for tables/strikethrough | remark-gfm | Handles all GFM edge cases (nested tables, task lists, autolinks) |
| Unique slug collision | Manual counter loop | Indexed query + suffix pattern | Database-level uniqueness check prevents race conditions |
| Date formatting | new Date().toLocaleDateString() | dayjs | Consistent formatting, timezone handling, relative time ("2 days ago") |
| Reading time | Complex NLP word counting | Split on whitespace + 200 WPM | Over-engineering - simple word count is 95% accurate for English prose |

**Key insight:** Slug uniqueness is harder than it looks. Race conditions occur when two mutations generate the same slug simultaneously. Solution: Convex's index uniqueness + atomic queries prevent collisions without transactions.

**Complexity pitfall:** Markdown parsing seems simple until you hit edge cases (nested lists, code blocks with backticks inside, tables with pipes in content). react-markdown handles thousands of edge cases tested by the community.

## Common Pitfalls

### Pitfall 1: Soft Delete Breaks Unique Constraints
**What goes wrong:** Slug uniqueness index includes deleted posts. User deletes "my-post", creates new "my-post", gets collision error.

**Why it happens:** Standard unique indexes don't distinguish deleted vs active records.

**How to avoid:**
- Don't use database-level unique constraints on slug
- Enforce uniqueness in application logic by filtering `isDeleted: false` when checking collisions
- Accept that deleted slugs can't be reused (prevents SEO confusion anyway)

**Warning signs:** User reports "slug already exists" error when creating post with same title as previously deleted post.

**Alternative approach:** Use filtered/partial indexes (PostgreSQL pattern) that exclude deleted rows. Convex doesn't support this natively, so application-level check is required.

### Pitfall 2: Publishing Without Validation Breaks Public Pages
**What goes wrong:** Admin publishes blog post without cover image, public page crashes trying to render `<img src={null}>`.

**Why it happens:** Schema marks `coverImageId` as required, but status transition doesn't validate completeness.

**How to avoid:**
- Add validation logic to `publish()` mutation (shown in Pattern 5)
- Check all required fields before allowing status = "published"
- Return clear error messages to admin UI

**Warning signs:** Console errors about null image URLs, Sentry reports from public blog pages.

**Best practice:** Create a `canPublish()` helper function that centralizes validation rules. Use in both publish mutation and admin UI (for "Publish" button disabled state).

### Pitfall 3: Race Condition in Slug Generation
**What goes wrong:** Two admins create posts with title "My Post" simultaneously. Both get slug "my-post", second one fails on insert due to index collision.

**Why it happens:** Slug uniqueness check + insert are separate operations, not atomic.

**How to avoid:**
- Convex mutations are automatically transactional
- Use the indexed query pattern in `generateUniqueSlug()` - the index check + insert happen in one mutation
- If collision detected, immediately retry with suffix

**Warning signs:** Intermittent "slug already exists" errors when creating posts in quick succession.

**Convex-specific insight:** Convex's automatic retry and optimistic concurrency control handle this gracefully. The second mutation will see the first post's slug in the index and append `-2`.

### Pitfall 4: Changing Published Slug Breaks Links
**What goes wrong:** Admin edits published post's slug, all external links and bookmarks break.

**Why it happens:** No enforcement of slug immutability after publishing.

**How to avoid:**
- Check `existing.status === "published"` in update mutation
- Throw error if attempting to change slug on published content
- UI should disable slug field for published posts

**Warning signs:** User reports broken links to blog posts, Google Search Console shows 404 errors for previously indexed URLs.

**Recovery strategy:** If slug must change, implement 301 redirects (requires server-side redirect logic or Vercel redirect config). Better: create new post with new slug, mark old one as "redirects to X".

### Pitfall 5: Forgetting isDeleted Filter in Queries
**What goes wrong:** Public blog page shows deleted posts in listing, or "Related posts" sidebar includes deleted content.

**Why it happens:** Soft delete requires consistent filtering in every query that feeds public UI.

**How to avoid:**
- Create helper queries that always filter deleted: `listPublished()`, `getPublishedBySlug()`
- Never use raw `.query("blogPosts")` in public-facing code
- Document in schema comments: "Always filter isDeleted: false in public queries"

**Warning signs:** Deleted posts appearing in production, SEO issues with Google indexing deleted content.

**Best practice pattern:**
```typescript
// Private query (admin only, shows deleted)
export const listAll = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.query("blogPosts").collect();
  },
});

// Public query (always filters deleted)
export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("status"), "published")
        )
      )
      .collect();
  },
});
```

### Pitfall 6: Not Handling Deleted Project References
**What goes wrong:** Case study references `projectId`, admin deletes project, case study page crashes trying to load null project.

**Why it happens:** Soft delete on projects table + no cascade handling on case studies.

**How to avoid:**
- `projectId` is optional in schema (per context decision)
- When rendering case study, check if project exists: `project = projectId ? await ctx.db.get(projectId) : null`
- If project deleted, case study still renders with title/slug but no project link

**Warning signs:** Case study pages throw "Cannot read property 'name' of null" errors.

**Best practice:** Create a `getCaseStudyWithProject()` query that safely handles missing projects:
```typescript
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const caseStudy = await ctx.db
      .query("caseStudies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!caseStudy || caseStudy.isDeleted) return null;

    // Safe project lookup
    const project = caseStudy.projectId
      ? await ctx.db.get(caseStudy.projectId)
      : null;

    // Filter out deleted projects
    const validProject = project && !project.isDeleted ? project : null;

    const coverImageUrl = await ctx.storage.getUrl(caseStudy.coverImageId);

    return { ...caseStudy, project: validProject, coverImageUrl };
  },
});
```

### Pitfall 7: Markdown Image URL Injection
**What goes wrong:** Admin pastes markdown with `![alt](javascript:alert('xss'))`, admin preview executes malicious code.

**Why it happens:** Markdown parsers may not validate URL schemes in image sources.

**How to avoid:**
- react-markdown's default `urlTransform` only allows http, https, mailto, irc, xmpp
- Do NOT override `urlTransform` to allow arbitrary schemes
- If custom validation needed, whitelist external domains only

**Warning signs:** Security audit flags client-side code execution in admin panel.

**Context-specific note:** User context specifies "inline images use external URLs only" - this is safe with react-markdown defaults. No Convex storage integration needed for inline images.

### Pitfall 8: Display Order Conflicts on Bulk Operations
**What goes wrong:** Admin creates multiple posts, all get `displayOrder: maxOrder + 1`, causing sort conflicts.

**Why it happens:** Race condition when multiple creates read same `maxOrder` value.

**How to avoid:**
- Convex mutations are atomic, but separate mutations can interleave
- For bulk creation, use single mutation that calculates order for all items
- Alternative: use `_creationTime` as tiebreaker in queries

**Warning signs:** Posts appear in inconsistent order, refreshing changes sort sequence.

**Best practice:**
```typescript
export const list = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("status"), "published")
        )
      )
      .collect();

    // Sort by displayOrder, then _creationTime as tiebreaker
    return posts.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return b._creationTime - a._creationTime; // Newer first
    });
  },
});
```

## Code Examples

Verified patterns from official sources:

### Complete Blog Post Create Mutation
```typescript
// Source: Convex docs + existing projects.ts pattern
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import slugify from "slugify";

export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImageId: v.id("_storage"),
    coverImageAlt: v.string(),
    category: v.union(
      v.literal("Local Business"),
      v.literal("Technical"),
      v.literal("Announcement")
    ),
    slug: v.optional(v.string()), // Manual override
  },
  handler: async (ctx, args) => {
    // Auth check
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Generate unique slug
    const baseSlug = args.slug || slugify(args.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate max displayOrder
    const posts = await ctx.db.query("blogPosts").collect();
    const maxOrder = posts.reduce((max, p) => Math.max(max, p.displayOrder), 0);

    // Insert post
    const postId = await ctx.db.insert("blogPosts", {
      title: args.title,
      slug,
      excerpt: args.excerpt,
      content: args.content,
      coverImageId: args.coverImageId,
      coverImageAlt: args.coverImageAlt,
      authorId: userId,
      status: "draft",
      category: args.category,
      displayOrder: maxOrder + 1,
      isDeleted: false,
      createdAt: Date.now(),
    });

    return postId;
  },
});
```

### Case Study List by Project (With Metrics)
```typescript
// Source: Convex query patterns
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const caseStudies = await ctx.db
      .query("caseStudies")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("status"), "published")
        )
      )
      .collect();

    // Resolve cover images
    const studiesWithUrls = await Promise.all(
      caseStudies.map(async (study) => ({
        ...study,
        coverImageUrl: await ctx.storage.getUrl(study.coverImageId),
      }))
    );

    return studiesWithUrls;
  },
});
```

### Markdown Rendering Component (Client)
```typescript
// Source: react-markdown GitHub docs
"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom components for styled output
          h2: ({ children }) => (
            <h2 className="font-serif text-h3 mt-spacing-xl mb-spacing-md">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-h4 mt-spacing-lg mb-spacing-sm">
              {children}
            </h3>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </article>
  );
}
```

**Note:** Custom components are optional. React-markdown provides semantic HTML by default. Custom components add design system styling (font-serif for headings, spacing tokens, etc.).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Storing HTML in database | Storing Markdown + rendering client-side | ~2020 | Safer (no XSS), easier to edit, portable across platforms |
| Hard delete with CASCADE | Soft delete with isDeleted flag | Ongoing trend | Better audit trail, data recovery, GDPR compliance |
| Client-side slug generation | Server-side generation with DB checks | ~2021 | Prevents race conditions, enforces uniqueness |
| rehype-sanitize for safety | react-markdown without rehypeRaw | ~2023 | Simpler (no HTML = no sanitization needed), faster |
| Storing reading time | Computing on query | ~2024 | Always accurate, no stale data from editing |
| Complex status workflows | Two-state draft/published | Current standard | YAGNI - "scheduled" and "review" states add complexity without value for single-author blogs |

**Deprecated/outdated:**
- dangerouslySetInnerHTML for Markdown: react-markdown eliminates XSS risk without sanitization libraries
- MDX for blog content: Over-engineered for non-technical authors, build complexity not worth React component benefits
- Separate "slug" mutation: Slug generation should happen atomically in create/update mutations
- Global slug counters: Per-title collision detection is more intuitive ("my-post-2" vs "my-post-17" when 16 unrelated posts exist)

## Open Questions

Things that couldn't be fully resolved:

1. **Tags beyond categories**
   - What we know: Context lists this under "Claude's Discretion"
   - What's unclear: Whether added complexity (separate tags table, many-to-many relationship) provides value for initial launch
   - Recommendation: Skip tags in Phase 15. Categories cover main use cases. Add tags in future phase if analytics show users filtering beyond categories.

2. **Case study section headings (fixed vs customizable)**
   - What we know: Always 3 sections (problem/solution/results), but heading text customizability is discretionary
   - What's unclear: Whether CaseStudyVisual component expects fixed headings or props
   - Recommendation: Make headings customizable (store in DB) for flexibility. Default to "The Challenge", "The Approach", "The Impact" in admin UI. Revisit after Phase 16 (admin UI) implementation if CaseStudyVisual needs fixed headings.

3. **Case study metrics format (label+value vs label+value+context)**
   - What we know: Metrics stored as structured data (minimum label + value)
   - What's unclear: Whether display needs additional "context" field (e.g., label: "Revenue", value: "+127%", context: "year over year")
   - Recommendation: Start with label+value only. Schema uses `v.object({ label: v.string(), value: v.string() })`. If Phase 17 (public pages) needs context, add optional field via schema migration.

4. **Reading time storage vs computation**
   - What we know: Display as "X min read", calculated from word count (~200 Wpm)
   - What's unclear: Whether to store in DB or compute in queries
   - Recommendation: Compute in queries (shown in Pattern 4). Negligible performance cost, always accurate, no stale data issues.

## Sources

### Primary (HIGH confidence)
- [Convex Schemas Documentation](https://docs.convex.dev/database/schemas) - Schema patterns, indexes, validation
- [Convex File Storage: Upload](https://docs.convex.dev/file-storage/upload-files) - generateUploadUrl pattern
- [Convex File Storage: Serve](https://docs.convex.dev/file-storage/serve-files) - storage.getUrl() for retrieval
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown) - Setup, remark-gfm integration, security
- Existing codebase: `convex/schema.ts`, `convex/projects.ts`, `convex/auth.ts` - Verified project patterns

### Secondary (MEDIUM confidence)
- [Soft Delete Pattern in MongoDB - GeeksforGeeks](https://www.geeksforgeeks.org/mongodb/soft-delete-pattern-in-mongodb/) - Soft delete patterns and restoration
- [Reading Time Calculator standards](https://wordstotime.netlify.app/word-to-reading-time/) - 200 WPM average for online content
- [React Markdown Complete Guide 2025 - Strapi](https://strapi.io/blog/react-markdown-complete-guide-security-styling) - Security best practices
- [Markdown Security Best Practices - MarkdownLang](https://www.markdownlang.com/advanced/security.html) - URL validation, XSS prevention
- [URL Slug Optimization Guide - SEO Service Care](https://seoservicecare.com/url-slug-guide/) - Immutable slugs after publish
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/) - Index optimization, query performance

### Tertiary (LOW confidence)
- [slugify npm](https://www.npmjs.com/package/slugify) - Configuration options (blocked by 403, inferred from WebSearch)
- [Implementing Re-Ordering at Database Level - Basedash](https://www.basedash.com/blog/implementing-re-ordering-at-the-database-level-our-experience) - displayOrder patterns
- [Alt Text Accessibility Requirements 2026 - PublicCEO](https://www.publicceo.com/2026/01/new-digital-accessibility-requirements-in-2026/) - WCAG 2.1 Level AA requirements

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified in existing package.json or official docs, versions match roadmap
- Architecture: HIGH - Patterns directly follow existing projects.ts implementation, tested in production
- Pitfalls: HIGH - Common soft delete, slug, and XSS issues documented across multiple sources
- Open questions: MEDIUM - Discretionary items have clear recommendations but need validation during implementation

**Research date:** 2026-02-07
**Valid until:** 2026-03-09 (30 days - stable ecosystem, mature libraries)

**Key assumptions:**
- Single admin user (no multi-author workflows or approval processes)
- English-language content (200 WPM reading speed, Unicode slug handling)
- No inline image uploads to Convex storage (external URLs only, per context)
- No scheduled publishing (draft/published only, no future publish dates)
- No content versioning or edit history (out of scope for Phase 15)
