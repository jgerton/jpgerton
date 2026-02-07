# Phase 15: Content Schema + Backend - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Blog posts and case studies get complete Convex backend infrastructure: tables, schema, queries, mutations, indexes, and auth checks. This phase delivers the data layer only. Admin UI (Phase 16), public pages (Phase 17), and content integration (Phase 18) consume this backend.

</domain>

<decisions>
## Implementation Decisions

### Blog content model
- Markdown-only content (GFM via react-markdown + remark-gfm)
- Excerpts are manual-only, admin writes a custom excerpt for every post
- Auto-calculated reading time from word count (~200 wpm), stored or computed, displayed as "3 min read"
- Category enum: Local Business, Technical, Announcement (from roadmap)

### Case study structure
- Project link is optional (not required), allowing case studies for work outside the portfolio
- Always 3 sections (problem/solution/results) per the roadmap
- Metrics stored as structured data (label + value at minimum)

### Content lifecycle
- Two states only: draft and published
- Soft delete: mark as deleted but keep in database, can be restored
- No updatedAt tracking, only publishedAt
- Slugs locked after first publish (cannot be changed once published, prevents broken links)
- Slug auto-generated from title with manual override capability (per roadmap)

### Image handling
- Cover image required for publishing (cannot publish without one)
- Alt text required field on cover images (enforced in schema)
- Client-side validation on uploads: max 5MB, JPEG/PNG/WebP only
- Inline images in blog markdown use external URLs only (no Convex storage for inline images)
- Cover images use Convex storage (generateUploadUrl pattern per roadmap)

### Claude's Discretion
- Tags beyond categories: Claude decides whether to add optional free-form tags based on complexity vs value tradeoff
- Content format extras: Claude decides whether to support embedded media (YouTube, callouts) based on what react-markdown handles cleanly
- Case study section headings: Claude decides whether headings are fixed ("The Challenge", etc.) or admin-customizable, based on CaseStudyVisual component patterns
- Case study metrics format: Claude picks between label+value vs label+value+context based on what displays best
- Case study section images: Claude decides whether to support optional images per section based on effort tradeoff

</decisions>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches. Follow existing Convex patterns from the projects table.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 15-content-schema-backend*
*Context gathered: 2026-02-06*
