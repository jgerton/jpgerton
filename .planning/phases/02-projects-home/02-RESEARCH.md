# Phase 2: Projects & Home - Research

**Researched:** 2026-02-03
**Domain:** Portfolio website with Next.js App Router, Convex backend, and image optimization
**Confidence:** HIGH

## Summary

This phase builds a portfolio showcase for 6 indie projects with home page, projects index, and detail pages. The standard approach uses Next.js 16 App Router with file-based routing, Convex for data storage and image hosting, and Next.js Image component for optimization. The key technical domains are: Convex schema design for projects, Next.js dynamic routing with async params, image optimization patterns, and client-side filtering with URL state management.

The stack already in place (Next.js 16, Convex 1.31.7, Tailwind CSS v4, shadcn/ui) provides everything needed. The primary challenges are: handling async params in Next.js 16+ (breaking change), configuring remotePatterns for Convex-hosted images, and implementing performant filtering without over-fetching.

**Primary recommendation:** Use Convex for both data storage and image hosting (via storage API), implement URL-based filtering with nuqs library for shareability, prioritize hero images with `preload` prop, and follow Next.js 16's async params pattern throughout.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.1.6 | Routing and rendering | File-based routing, built-in Image optimization, Vercel integration |
| Convex | 1.31.7 | Database and file storage | Reactive queries, built-in file hosting with CDN, type-safe schema |
| next/image | (built-in) | Image optimization | Automatic WebP/AVIF conversion, lazy loading, responsive srcset |
| shadcn/ui Card | (installed) | Card component | Already in stack, Tailwind-based, accessible, customizable |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nuqs | 2.x | URL state management | For filter/sort params that should be shareable and bookmarkable |
| lucide-react | 0.563.0 | Icons | Already installed, for filter UI and status badges |
| clsx + tailwind-merge | (installed) | Conditional styling | For hover states and status badge variants |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Convex storage | Cloudinary/Uploadcare | More features but adds external dependency and cost |
| nuqs | useSearchParams | Built-in but less type-safe and more boilerplate |
| File-based routing | Dynamic catch-all | More flexible but loses Next.js static optimization |

**Installation:**
```bash
bun add nuqs
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── page.tsx                    # Home page (hero + 6 projects)
├── projects/
│   ├── page.tsx               # Projects index with filters
│   └── [slug]/
│       └── page.tsx           # Project detail page
convex/
├── schema.ts                  # Add projects table
├── projects.ts                # Queries and mutations
└── lib/
    └── validators.ts          # Shared validation logic (optional)
components/
├── portfolio/
│   ├── project-card.tsx       # Reusable card component
│   ├── project-grid.tsx       # Grid layout with responsive columns
│   ├── project-filters.tsx    # Filter UI with nuqs
│   └── hero-section.tsx       # Home hero with CTA
└── ui/
    └── (shadcn components)
```

### Pattern 1: Convex Schema with File Storage References
**What:** Define projects table with storage IDs for images, arrays for tech stacks, optional URLs
**When to use:** All Convex tables storing user-uploaded or external images
**Example:**
```typescript
// Source: https://docs.convex.dev/database/schemas
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    descriptionLong: v.optional(v.string()),
    screenshotId: v.id("_storage"), // Reference to Convex storage
    status: v.union(
      v.literal("live"),
      v.literal("archived"),
      v.literal("in-progress")
    ),
    techStack: v.array(v.string()),
    techCategories: v.object({
      frontend: v.array(v.string()),
      backend: v.array(v.string()),
      infrastructure: v.array(v.string()),
    }),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    displayOrder: v.number(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"])
    .index("by_order", ["displayOrder"]),
});
```

### Pattern 2: Async Params in Next.js 16 App Router
**What:** Await params prop in page components (breaking change in Next.js 15+)
**When to use:** All dynamic route pages ([slug], [id], etc.)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
// app/projects/[slug]/page.tsx
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params; // MUST await in Next.js 16+
  return <div>Project: {slug}</div>;
}

// Generate static paths for build optimization
export async function generateStaticParams() {
  const projects = await fetchProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
```

### Pattern 3: Convex Image Serving with Next.js Image
**What:** Fetch storage URLs in queries and configure remotePatterns for Next.js Image
**When to use:** Displaying Convex-hosted images with optimization
**Example:**
```typescript
// Source: https://docs.convex.dev/file-storage/serve-files
// convex/projects.ts
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .collect();

    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        screenshotUrl: await ctx.storage.getUrl(project.screenshotId),
      }))
    );
  },
});
```

```typescript
// app/projects/page.tsx
"use client";
import Image from "next/image";
import { useQuery } from "convex/react";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.list);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project) => (
        <Image
          key={project._id}
          src={project.screenshotUrl!}
          alt={project.name}
          width={600}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg"
        />
      ))}
    </div>
  );
}
```

```javascript
// next.config.mjs - Configure Convex CDN
// Source: https://nextjs.org/docs/app/api-reference/components/image
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
        pathname: '/api/storage/**',
      },
    ],
  },
};
```

### Pattern 4: URL-Based Filtering with nuqs
**What:** Store filter/sort state in URL params for shareability
**When to use:** Any filtering or sorting UI that users might want to bookmark or share
**Example:**
```typescript
// Source: https://nuqs.dev/
// components/portfolio/project-filters.tsx
"use client";
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';

export function ProjectFilters() {
  const [techs, setTechs] = useQueryState(
    'tech',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault('date'));

  return (
    <div className="flex gap-4">
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="date">Newest First</option>
        <option value="name">Alphabetical</option>
      </select>

      <div className="flex gap-2">
        {['React', 'Next.js', 'Convex'].map((tech) => (
          <button
            key={tech}
            onClick={() =>
              setTechs(
                techs.includes(tech)
                  ? techs.filter((t) => t !== tech)
                  : [...techs, tech]
              )
            }
            className={techs.includes(tech) ? 'active' : ''}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 5: Responsive Grid with Tailwind
**What:** Use Tailwind's responsive grid classes for adaptive column counts
**When to use:** Portfolio grids, project cards, any grid layout
**Example:**
```typescript
// Source: Tailwind CSS best practices 2026
// components/portfolio/project-grid.tsx
export function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

// Alternative with auto-fit (CSS Grid)
// Use when card width matters more than column count
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
```

### Anti-Patterns to Avoid
- **Fetching images individually in components:** Fetch storage URLs in Convex queries, not component-by-component
- **Using old params sync pattern:** Next.js 16 requires `await params`, synchronous access is deprecated
- **Missing remotePatterns configuration:** Next.js Image will fail silently without proper remotePatterns
- **Client-side filtering large datasets:** Use Convex indexes and `.withIndex()` for filtering, not `.collect().filter()`
- **Hardcoding filter options:** Derive available filters from actual data to avoid stale UI

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom resize/WebP conversion | next/image | Handles formats, lazy loading, srcset, caching automatically |
| URL state management | Manual URLSearchParams parsing | nuqs | Type-safe parsers, React hooks, handles arrays/objects |
| Responsive images | Manual srcset generation | next/image with sizes prop | Generates optimal srcset based on sizes string |
| Slug generation | Custom slugify function | Install `slugify` package | Handles unicode, special chars, collisions properly |
| File uploads to Convex | Direct file handling | storage.generateUploadUrl() | Handles CDN, expiration, security, storage IDs |

**Key insight:** Image optimization is deceptively complex. Next.js Image component handles 10+ edge cases (AVIF support detection, layout shift prevention, lazy loading intersection observer, srcset generation, cache headers, etc.) that would take days to implement correctly.

## Common Pitfalls

### Pitfall 1: Forgetting to Await Params in Next.js 16
**What goes wrong:** TypeScript errors or runtime Promise objects instead of slug values
**Why it happens:** Breaking change in Next.js 15+, old tutorials show synchronous access
**How to avoid:** Always use `const { slug } = await params` in async page components
**Warning signs:**
- TypeScript error: "Property 'slug' does not exist on type 'Promise<{ slug: string }>'"
- Runtime error: "Cannot read property of undefined"
- Seeing `[object Promise]` in rendered output

### Pitfall 2: Missing remotePatterns for Convex Images
**What goes wrong:** Images fail to load, browser shows broken image icons, no console errors
**Why it happens:** Next.js security feature blocks external images without explicit config
**How to avoid:** Add remotePatterns to next.config.mjs before using Convex storage URLs
**Warning signs:**
- Images work in `<img>` tags but not `<Image>` component
- Browser network tab shows 403 errors on `/_next/image?url=...` requests
- Dev server logs "Invalid src prop" warnings

```javascript
// Common mistake patterns to avoid
// ❌ Wrong: Wildcard hostname (security risk)
hostname: '**'

// ❌ Wrong: Missing pathname (too permissive)
hostname: 'example.convex.cloud'

// ✅ Correct: Specific pattern
hostname: '*.convex.cloud',
pathname: '/api/storage/**'
```

### Pitfall 3: Not Using Indexes for Filtering
**What goes wrong:** Slow queries as dataset grows, loading all projects then filtering client-side
**Why it happens:** Convex reactive queries make it easy to over-fetch with `.collect()`
**How to avoid:** Use `.withIndex()` and index conditions for common filters
**Warning signs:**
- Queries slow down as project count increases
- Network tab shows large payloads (all projects) even when filtering
- Convex dashboard shows high read units on projects table

```typescript
// ❌ Wrong: Fetch all, filter client-side
const allProjects = await ctx.db.query("projects").collect();
const featured = allProjects.filter(p => p.featured);

// ✅ Correct: Use index for filtering
const featured = await ctx.db
  .query("projects")
  .withIndex("by_featured", (q) => q.eq("featured", true))
  .collect();
```

### Pitfall 4: Mixing Image Priority/Preload Props
**What goes wrong:** Console warnings about conflicting props, unexpected load behavior
**Why it happens:** Next.js 16 deprecated `priority` in favor of `preload`, mixing them causes conflicts
**How to avoid:** Use only `preload={true}` for above-fold images (hero, LCP elements)
**Warning signs:**
- Console warning: "Image with src '...' has both 'priority' and 'preload' props"
- LCP scores still poor despite using priority

```typescript
// ❌ Deprecated (Next.js 15 and earlier)
<Image priority />

// ✅ Current (Next.js 16+)
<Image preload={true} />

// Don't mix with:
<Image preload loading="lazy" /> // Conflict
<Image preload fetchPriority="low" /> // Conflict
```

### Pitfall 5: Not Handling Missing Data in Dynamic Routes
**What goes wrong:** 404 errors or crashes when project slug doesn't exist
**Why it happens:** User bookmarks invalid URL, project deleted, typo in URL
**How to avoid:** Check for null after query, return notFound() from next/navigation
**Warning signs:**
- Runtime errors: "Cannot read property 'name' of null"
- Blank pages with no error messages
- 500 errors instead of 404s

```typescript
// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound(); // Returns 404 page
  }

  return <div>{project.name}</div>;
}
```

### Pitfall 6: Forgetting Port Field in remotePatterns for Local Dev
**What goes wrong:** Images work in production but break in local development
**Why it happens:** Local Convex URLs include port numbers that remotePatterns must match
**How to avoid:** Include `port` field when developing against local/staging Convex instances
**Warning signs:**
- Images load in production but not dev
- Different behavior between `bun dev` and deployed site

```javascript
// For local Convex development
{
  protocol: 'http',
  hostname: 'localhost',
  port: '3210', // Don't forget the port!
  pathname: '/api/storage/**',
}
```

## Code Examples

Verified patterns from official sources:

### Complete Project Card Component
```typescript
// components/portfolio/project-card.tsx
// Combines shadcn/ui Card with Next.js Image and status badges
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  project: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    screenshotUrl: string;
    status: "live" | "archived" | "in-progress";
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const statusVariant = {
    live: "default" as const,
    archived: "secondary" as const,
    "in-progress": "outline" as const,
  };

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video">
          <Image
            src={project.screenshotUrl}
            alt={`${project.name} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <Badge variant={statusVariant[project.status]}>
              {project.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
```

### Convex Query with Image URLs
```typescript
// convex/projects.ts
// Source: https://docs.convex.dev/file-storage/serve-files
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("desc")
      .collect();

    // Fetch storage URLs for all projects in parallel
    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        screenshotUrl: await ctx.storage.getUrl(project.screenshotId),
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!project) return null;

    return {
      ...project,
      screenshotUrl: await ctx.storage.getUrl(project.screenshotId),
    };
  },
});

export const filterByTech = query({
  args: { techs: v.array(v.string()) },
  handler: async (ctx, args) => {
    // Note: Convex doesn't support array filtering with indexes
    // For tech filtering, fetch all and filter client-side (acceptable for small datasets)
    // Or denormalize with a tech -> projectIds mapping table
    const projects = await ctx.db.query("projects").collect();

    const filtered = projects.filter((project) =>
      args.techs.some((tech) => project.techStack.includes(tech))
    );

    return Promise.all(
      filtered.map(async (project) => ({
        ...project,
        screenshotUrl: await ctx.storage.getUrl(project.screenshotId),
      }))
    );
  },
});
```

### Home Page with Hero and Projects Grid
```typescript
// app/page.tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const projects = useQuery(api.projects.list);

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Professional WordPress Sites from $500
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Fast, mobile-friendly websites for local businesses.
          Custom development also available.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="#contact">Get Your Site</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">View Portfolio</Link>
          </Button>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Recent Projects
          </h2>
          <ProjectGrid projects={projects ?? []} />
        </div>
      </section>
    </main>
  );
}
```

### Projects Page with Filtering
```typescript
// app/projects/page.tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { useMemo } from 'react';

export default function ProjectsPage() {
  const allProjects = useQuery(api.projects.list);
  const [selectedTechs] = useQueryState(
    'tech',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [sortBy] = useQueryState('sort', parseAsString.withDefault('date'));

  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    let filtered = allProjects;

    // Filter by tech
    if (selectedTechs.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTechs.some((tech) => project.techStack.includes(tech))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Default: newest first
      return b.createdAt - a.createdAt;
    });

    return sorted;
  }, [allProjects, selectedTechs, sortBy]);

  return (
    <main className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">All Projects</h1>
        <ProjectFilters />
        <ProjectGrid projects={filteredProjects} />
      </div>
    </main>
  );
}
```

### Project Detail Page with Async Params
```typescript
// app/projects/[slug]/page.tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next.js 16 requires await

  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project) {
    notFound();
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={project.screenshotUrl!}
            alt={`${project.name} screenshot`}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            preload={true} // Above-fold image
            className="object-cover"
          />
        </div>

        {/* Project Info */}
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <Badge>{project.status}</Badge>
        </div>

        <p className="text-lg text-muted-foreground mb-8">
          {project.descriptionLong ?? project.description}
        </p>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>

          <div className="space-y-4">
            {Object.entries(project.techCategories).map(([category, techs]) => (
              <div key={category}>
                <h3 className="font-semibold capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.liveUrl && (
            <Button asChild>
              <Link href={project.liveUrl} target="_blank">
                View Live Site
              </Link>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline">
              <Link href={project.githubUrl} target="_blank">
                View Source
              </Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

// Generate static pages at build time
export async function generateStaticParams() {
  const projects = await fetchQuery(api.projects.list);

  return projects.map((project) => ({
    slug: project.slug,
  }));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Synchronous params | Async params (await) | Next.js 15 (Oct 2024) | Breaking change, must update all dynamic routes |
| priority prop | preload prop | Next.js 16 (Jan 2025) | priority deprecated, use preload for LCP images |
| domains config | remotePatterns | Next.js 14 (2023) | domains deprecated, remotePatterns more secure |
| Client-side filtering | URL params with nuqs | Current trend 2026 | Shareable state, better UX |
| Custom image CDN | Convex storage | Convex 1.x (2024) | Built-in CDN, simpler setup for small projects |

**Deprecated/outdated:**
- **images.domains:** Deprecated in Next.js 14, use remotePatterns for security
- **Synchronous params access:** Works in Next.js 15 but deprecated, removed in 16+
- **priority prop:** Deprecated in Next.js 16, use preload instead

## Open Questions

Things that couldn't be fully resolved:

1. **Tech stack filtering at database level**
   - What we know: Convex doesn't support array intersection queries with indexes
   - What's unclear: Best pattern for filtering by tech tags without loading all projects
   - Recommendation: For 6 projects, client-side filtering is acceptable. For 100+, consider denormalized tech->projects mapping table or use Convex's full-text search (when available)

2. **Convex storage URL caching**
   - What we know: storage.getUrl() generates URLs, queries return them to client
   - What's unclear: URL expiration time, whether they're permanently cacheable
   - Recommendation: Fetch URLs in queries as shown in examples, let Convex handle caching. URLs appear to be long-lived CDN URLs based on community usage.

3. **Image optimization for very large screenshots**
   - What we know: Next.js Image optimizes on-demand, caches results
   - What's unclear: Whether to pre-resize in Convex or let Next.js handle it
   - Recommendation: Store original high-res images in Convex, let Next.js Image handle optimization. Monitor build times with generateStaticParams.

## Sources

### Primary (HIGH confidence)
- Next.js Dynamic Routes: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- Next.js Image Component: https://nextjs.org/docs/app/api-reference/components/image
- Convex Schemas: https://docs.convex.dev/database/schemas
- Convex Best Practices: https://docs.convex.dev/understanding/best-practices/
- Convex File Storage Upload: https://docs.convex.dev/file-storage/upload-files
- Convex File Storage Serve: https://docs.convex.dev/file-storage/serve-files
- nuqs Documentation: https://nuqs.dev/

### Secondary (MEDIUM confidence)
- TheLinuxCode Next.js 16 Guide: https://thelinuxcode.com/nextjs-dynamic-route-segments-in-the-app-router-2026-guide/
- Strapi Next.js Image Guide: https://strapi.io/blog/nextjs-image-optimization-developers-guide
- LogRocket URL State Management: https://blog.logrocket.com/url-state-usesearchparams/
- shadcn Card Examples: https://www.shadcnblocks.com/components/card
- Portfolio Design Trends 2026: https://colorlib.com/wp/portfolio-design-trends/

### Tertiary (LOW confidence)
- Medium portfolio filtering examples (multiple authors, unverified implementations)
- WebSearch results on grid layouts (general patterns, not Next.js specific)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official docs, versions confirmed in package.json
- Architecture: HIGH - Patterns verified with Next.js 16 and Convex official documentation
- Pitfalls: HIGH - Common issues documented in official GitHub issues and migration guides
- Image optimization: HIGH - Next.js Image component well-documented
- Filtering patterns: MEDIUM - nuqs is third-party library, verified but not official Next.js

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days - stack is stable, Next.js 16 just released)
