# Phase 18: Content Integration - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all hardcoded placeholder content with dynamic Convex queries across existing pages. Project detail pages display linked case studies, the home page shows latest blog posts, and a new testimonials table replaces hardcoded quotes. All fake/placeholder data and misleading comments removed from codebase.

</domain>

<decisions>
## Implementation Decisions

### Blog section on home page
- Position: after Featured Projects, before Social Proof/Testimonials section
- Heading: "Insights & Updates" with "Read More" CTA linking to /blog
- Card style: Claude's discretion (see below)
- Empty state: hide the entire section when no published blog posts exist (conditional render)
- Show 3 latest published posts via `api.blogPosts.listPublished`

### Case study display logic
- When a project has no linked case study: show a minimal fallback derived from project fields (description, tech stack) styled as "Project Highlights" or similar
- When a project has multiple linked case studies: show only the first (most recent) one
- Metrics mapping: concatenate Convex label/value objects into strings (e.g., "Load Time: 1.2s") for CaseStudyVisual's string array prop
- Section heading: Claude's discretion (fixed "Case Study" vs case study title from Convex)

### Placeholder cleanup scope
- Remove all hardcoded case study placeholder data from project detail pages
- Remove misleading "placeholder" and "TODO" comments that reference future data layers
- Testimonials: create a new Convex `testimonials` table, migrate existing 2 hardcoded testimonials, query dynamically on home page
- Testimonials admin: NO admin CRUD UI - manage via Convex dashboard if needed. Schema + seed + dynamic display only
- Services and social proof metrics: Claude's discretion on whether to keep inline or centralize to site-config.ts

### Initial content seeding
- Blog posts: entered manually via admin UI (not seed script). 3 posts, all Local Business category targeting the $500 website offer audience
- Case studies: linked to the top 3 featured projects (the ones displayed on home page grid)
- Testimonials: migrate the existing 2 hardcoded testimonials into the new Convex table as-is (same quotes, names, companies)
- Seeding is a manual step after code changes are deployed, not automated

### Claude's Discretion
- Blog card style on home page (full BlogPostCard with images vs compact cards - pick what fits page composition)
- Case study section heading approach (fixed label vs dynamic title)
- Whether to move services/metrics data to site-config.ts or keep inline
- Exact styling and spacing of the new blog section to match existing page flow
- Testimonials schema fields and query design

</decisions>

<specifics>
## Specific Ideas

- Blog section heading text is "Insights & Updates" (not "Latest from the Blog")
- Blog CTA text is "Read More" (not "View All Posts")
- Empty blog section hides completely - no "coming soon" messages
- Case study fallback for projects without linked studies should use project description and tech stack (similar to current behavior but acknowledged as intentional, not placeholder)
- Testimonials table is lightweight: schema + queries + seed data, no admin forms

</specifics>

<deferred>
## Deferred Ideas

- Full testimonials admin CRUD (create/edit/delete/reorder UI) - future phase if needed
- Social proof metrics as dynamic Convex data - not needed for launch

</deferred>

---

*Phase: 18-content-integration*
*Context gathered: 2026-02-07*
