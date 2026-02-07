# Phase 18: Content Integration - Research

**Researched:** 2026-02-07
**Domain:** Dynamic content integration with Convex queries, conditional rendering patterns, data migration from hardcoded to database
**Confidence:** HIGH

## Summary

Phase 18 replaces all hardcoded placeholder content with dynamic Convex queries. The codebase already has well-established patterns: Convex queries return data with resolved URLs, components accept props matching query shapes, and conditional rendering uses loading states and empty checks. The primary work involves wiring existing queries (`api.blogPosts.listPublished`, `api.caseStudies.getByProject`) to existing components (`BlogPostCard`, `CaseStudyVisual`, `TestimonialCard`), creating a new `testimonials` table, and cleaning up placeholder comments.

Key integration points are well-defined: home page needs a blog section after Featured Projects, project detail pages need case study queries replacing derived data, and testimonials need database backing. The Convex schema and query patterns are already production-ready from phases 15-17. Primary challenges are data transformation (Convex metrics objects to string arrays) and fallback logic when relationships are empty.

**Primary recommendation:** Follow existing client component patterns with `useQuery` hooks, conditional section rendering based on data availability, and TypeScript data mapping for schema mismatches. Create testimonials schema modeled after existing tables (status, soft delete, displayOrder). No new architectural patterns needed.

## Standard Stack

The established libraries/tools already in use for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Convex | Latest | Backend database, queries, mutations | Already integrated, reactive queries with `useQuery` |
| Next.js 16 | 16.x | App Router, Server Components, Client Components | Project framework, handles SSR and client interactivity |
| TypeScript | 5.x | Type safety for data transformations | Prevents runtime errors in query result mapping |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| convex/react | Latest | `useQuery` hook for client components | All client-side dynamic data fetching |
| convex/nextjs | Latest | `fetchQuery` for Server Components | Static generation, metadata, RSC patterns |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Client Components with useQuery | Server Components with fetchQuery | Home page already uses useQuery for projects; consistency over hybrid approach |
| New testimonials table | Keep hardcoded | Technical debt; inconsistent with other content being dynamic |

**Installation:**
No new packages needed. All dependencies already present.

## Architecture Patterns

### Recommended Query Integration Structure

**Client Component Pattern (for home page blog section):**
```typescript
// app/(home)/page.tsx (already "use client")
const blogPosts = useQuery(api.blogPosts.listPublished, {});

// Conditional rendering
{blogPosts && blogPosts.length > 0 && (
  <SectionBackground variant="neutral">
    <h2>Insights & Updates</h2>
    {blogPosts.slice(0, 3).map(post => (
      <BlogPostCard key={post._id} {...post} />
    ))}
  </SectionBackground>
)}
```

**Server Component Pattern (for project detail pages):**
```typescript
// app/projects/[slug]/page.tsx (already Server Component)
const project = await fetchQuery(api.projects.getBySlug, { slug });
const caseStudies = await fetchQuery(api.caseStudies.getByProject, {
  projectId: project._id,
});

const caseStudy = caseStudies[0]; // First case study only

// Fallback logic
if (!caseStudy) {
  // Derive from project fields as current code does
}
```

### Data Transformation Pattern

Convex case study metrics are `{ label: string, value: string }[]` but CaseStudyVisual expects `string[]`:

```typescript
// Transform Convex metrics to component props
const metricsStrings = caseStudy.metrics.map(
  (m) => `${m.label}: ${m.value}`
);

<CaseStudyVisual
  problem={{ heading: caseStudy.problemHeading, content: caseStudy.problemContent }}
  solution={{ heading: caseStudy.solutionHeading, content: caseStudy.solutionContent }}
  results={{
    heading: caseStudy.resultsHeading,
    content: caseStudy.resultsContent,
    metrics: metricsStrings,
  }}
/>
```

### Testimonials Schema Pattern

Model after existing content tables (blogPosts, caseStudies):

```typescript
// convex/schema.ts
testimonials: defineTable({
  quote: v.string(),
  name: v.string(),
  title: v.string(),
  company: v.string(),
  photoId: v.optional(v.id("_storage")),
  displayOrder: v.number(),
  isDeleted: v.boolean(),
  createdAt: v.number(),
})
  .index("by_order", ["displayOrder"])
```

No `status` or `publishedAt` needed - testimonials are simpler than blog/case study publishing workflow. Include soft delete for consistency.

### Conditional Section Rendering Pattern

Established pattern from blog page (lines 92-96, 120-134):

```typescript
// Hide entire section when no data
{(posts === undefined || (posts && posts.length > 0)) && (
  <SectionBackground>
    {/* Section content */}
  </SectionBackground>
)}

// Show during loading (undefined), hide when empty array
```

### Anti-Patterns to Avoid

- **Don't mix Server Component and Client Component data fetching in same component.** Pick one approach per page/component.
- **Don't use optional chaining on useQuery results without checking undefined.** Pattern: `posts?.length` fails when `posts === undefined` (loading state). Use: `posts && posts.length > 0`.
- **Don't forget soft delete filters.** All queries must filter `isDeleted: false` (testimonials will need this).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Testimonials CRUD UI | Custom admin forms | Convex dashboard bulk edit | User decision: NO admin UI for testimonials, manual management only |
| Data seeding scripts | Custom migration scripts | Convex dashboard import or `convex/init.ts` mutation | Convex supports CSV/JSON import, type-safe seed mutations |
| Array-to-string mapping | Custom concatenation loops | `array.map(obj => \`\${obj.key}: \${obj.value}\``)` | Built-in JavaScript, type-safe with TypeScript inference |
| Empty state logic | Complex multi-state checks | `data && data.length > 0` pattern from blog page | Already established in codebase (blog page lines 92-96) |

**Key insight:** The codebase already solved these patterns in phases 15-17. Replicate existing approaches rather than inventing new ones.

## Common Pitfalls

### Pitfall 1: useQuery Undefined vs Empty Array Confusion
**What goes wrong:** Component renders empty state when data is loading because `posts?.length === 0` is true for `undefined`.
**Why it happens:** JavaScript optional chaining returns `undefined?.length` as `undefined`, which is falsy.
**How to avoid:** Always check `data === undefined` separately from `data.length === 0`. Pattern from blog page:
```typescript
if (data === undefined) {
  return <LoadingSkeleton />;
}
if (data.length === 0) {
  return <EmptyState />;
}
```
**Warning signs:** Flickering empty states, content appearing after delay.

### Pitfall 2: Metrics Data Shape Mismatch
**What goes wrong:** CaseStudyVisual expects `string[]` but Convex returns `{ label: string, value: string }[]`. TypeScript error: "Type 'object[]' not assignable to 'string[]'".
**Why it happens:** Schema defines metrics as structured objects, but component was built for placeholder string arrays.
**How to avoid:** Transform at integration point:
```typescript
const metricsStrings = caseStudy.metrics.map(m => `${m.label}: ${m.value}`);
```
**Warning signs:** TypeScript errors on CaseStudyVisual props, runtime crashes on metrics rendering.

### Pitfall 3: Empty Case Study Relationships
**What goes wrong:** Project detail page crashes or shows no case study section when `projectId` has no linked case studies.
**Why it happens:** `api.caseStudies.getByProject` returns empty array, code assumes array[0] exists.
**How to avoid:** User decision specifies fallback logic - derive from project fields when no case study exists. Check array length before accessing first element.
```typescript
const caseStudies = await fetchQuery(api.caseStudies.getByProject, { projectId });
const caseStudy = caseStudies[0];

if (!caseStudy) {
  // Use current derived data approach (already in code)
  const fallbackData = { ... };
}
```
**Warning signs:** Null reference errors on project pages, missing case study sections.

### Pitfall 4: Forgotten Placeholder Comment Cleanup
**What goes wrong:** Code review reveals "placeholder" and "TODO" comments contradicting the now-dynamic implementation.
**Why it happens:** Easy to forget comment cleanup when focused on code changes.
**How to avoid:** Systematic grep search as final plan task:
```bash
grep -r "placeholder\|TODO\|Future enhancement.*case study" app/ components/
```
Remove or update all matches. User decision specifies removing "misleading comments."
**Warning signs:** PR comments pointing out stale TODOs, confusion in future maintenance.

### Pitfall 5: Blog Section Position and Empty State
**What goes wrong:** Blog section appears in wrong location or shows "no posts" message when user wants it hidden.
**Why it happens:** User decision specifies: position "after Featured Projects, before Social Proof" AND "hide entire section when no posts."
**How to avoid:** Follow exact placement from user context:
```typescript
{/* Section 3: Featured Projects */}
<ProjectSection />

{/* Section 3.5: Blog (conditional) */}
{blogPosts && blogPosts.length > 0 && (
  <BlogSection />
)}

{/* Section 4: Social Proof & Testimonials */}
<SocialProofSection />
```
**Warning signs:** Visual layout doesn't match user description, empty blog section visible.

## Code Examples

Verified patterns from existing codebase:

### Client Component Query Pattern
Source: `app/blog/page.tsx` (lines 14-16)
```typescript
function BlogListContent() {
  const allPosts = useQuery(api.blogPosts.listPublished, {});

  // Loading state
  if (allPosts === undefined) {
    return <LoadingSkeleton />;
  }

  // Empty state
  if (allPosts.length === 0) {
    return <EmptyMessage />;
  }

  // Render data
  return allPosts.map(post => <Card key={post._id} {...post} />);
}
```

### Server Component Query Pattern
Source: `app/projects/[slug]/page.tsx` (lines 63-67)
```typescript
export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project) {
    notFound();
  }

  // Use project data in JSX
}
```

### Metrics Transformation Pattern
TypeScript array mapping with template literals:
```typescript
// Source: Convex query result
const caseStudy = {
  metrics: [
    { label: "Load Time", value: "1.2s" },
    { label: "Lighthouse Score", value: "98/100" },
  ]
};

// Transform to component format
const metricsForDisplay = caseStudy.metrics.map(
  (metric) => `${metric.label}: ${metric.value}`
);
// Result: ["Load Time: 1.2s", "Lighthouse Score: 98/100"]
```

### Conditional Section Rendering Pattern
Source: `app/(home)/page.tsx` (lines 124-155)
```typescript
{/* Hide entire section when no data (loading OR empty) */}
{(projects === undefined || (projects && projects.length > 0)) && (
  <SectionBackground variant="neutral">
    <h2>Recent Work</h2>
    <ProjectGrid
      projects={(projects ?? []).slice(0, 3)}
      loading={projects === undefined}
    />
  </SectionBackground>
)}
```

### Testimonials Query Pattern
New query to create (modeled after `blogPosts.listPublished`):
```typescript
// convex/testimonials.ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Filter non-deleted, resolve photos
    const filtered = testimonials.filter(t => !t.isDeleted);

    const testimonialsWithUrls = await Promise.all(
      filtered.map(async (testimonial) => {
        const photoUrl = testimonial.photoId
          ? await ctx.storage.getUrl(testimonial.photoId)
          : null;

        return {
          ...testimonial,
          photoUrl,
        };
      })
    );

    return testimonialsWithUrls;
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded placeholder arrays in components | Dynamic Convex queries with useQuery/fetchQuery | Phases 15-17 (Feb 2026) | All content now admin-manageable, no code deploys for content changes |
| Component comments saying "replace later" | Integrated queries as primary data source | Phase 18 | Eliminates technical debt, clarifies intent |
| Derived case study data from project fields | Optional Convex relationship with fallback | Phase 18 | Real narratives when available, graceful degradation when not |
| Server Components everywhere | Client Components for reactive data | Phase 13 onwards | Consistent with project patterns, supports real-time updates |

**Deprecated/outdated:**
- Hardcoded testimonials array (lines 44-59 in `app/(home)/page.tsx`): Replace with Convex query
- Derived case study data (lines 75-93 in `app/projects/[slug]/page.tsx`): Use as fallback only
- Comment "Future enhancement: add dedicated case study fields" (line 76): Already done in Phase 15

## Open Questions

Things that couldn't be fully resolved:

1. **Blog card style on home page (full vs compact)**
   - What we know: `BlogPostCard` is horizontal layout with image (established in Phase 17)
   - What's unclear: User marked as "Claude's discretion" - full card or simplified variant?
   - Recommendation: Use existing `BlogPostCard` component for consistency. It's already responsive (aspect-video on mobile, fixed width on desktop). Fits well in grid or stack layout.

2. **Case study section heading approach**
   - What we know: User marked as "Claude's discretion" - fixed "Case Study" vs dynamic title
   - What's unclear: Should heading use `caseStudy.title` or generic label?
   - Recommendation: Use fixed heading "Case Study" for consistency across project pages. Case study title appears within the CaseStudyVisual component already (optional `title` prop).

3. **Services/metrics data centralization**
   - What we know: User marked as "Claude's discretion" - move to site-config.ts or keep inline?
   - What's unclear: Is there value in centralizing data that never changes?
   - Recommendation: Keep inline. They're page-specific, don't repeat elsewhere, and moving adds indirection without benefit. Follow "no premature abstraction" principle.

## Sources

### Primary (HIGH confidence)
- Codebase files (schema.ts, blogPosts.ts, caseStudies.ts, existing page components) - Direct inspection
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/) - Query patterns, filtering strategy
- [Convex Schema Migrations](https://stack.convex.dev/intro-to-migrations) - Adding tables, optional fields
- [Convex Lightweight Migrations](https://stack.convex.dev/lightweight-zero-downtime-migrations) - Optional field patterns

### Secondary (MEDIUM confidence)
- [Next.js Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - Component patterns
- [Convex Relationship Structures](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas) - Optional ID relationships
- [Convex Data Types](https://docs.convex.dev/database/types) - v.optional() usage
- [React Conditional Rendering](https://snyk.io/blog/conditional-rendering-react-next-js/) - Best practices

### Tertiary (LOW confidence)
- [TypeScript Array Mapping](https://www.spguides.com/map-an-array-of-objects-to-another-array-of-objects-in-typescript/) - Object-to-string patterns (verified with codebase inspection)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already integrated and proven in phases 15-17
- Architecture: HIGH - Existing patterns from blog/case study implementation directly apply
- Pitfalls: HIGH - Specific errors identified from schema/component type mismatches and user decisions

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable patterns, no fast-moving dependencies)
