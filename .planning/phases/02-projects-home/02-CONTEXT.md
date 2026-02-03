# Phase 2: Projects & Home - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Display Jon's portfolio of 6 indie projects with a compelling home page that serves two audiences: local business owners seeking $500 WordPress sites and custom development clients. Creating projects, admin editing, and content management are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Home hero & layout
- Stacked sections: Hero with WordPress CTA at top, portfolio section below
- Both audiences addressed but in sequence, not side-by-side
- All 6 projects displayed on home page (not a curated subset)
- Brief about section: Claude's discretion based on conversion best practices

### Project cards
- Display: Screenshot + title + one-line description (no tech tags on cards)
- Status badges: Show project status (live, archived, in-progress) on cards
- Hover behavior: Claude's discretion
- Grid layout: Claude's discretion based on content density

### Project detail pages
- Hero layout: Claude's discretion
- Tech stack: Grouped list organized by category (Frontend, Backend, Infrastructure)
- Screenshots: Single hero screenshot per project (no gallery)
- Links: Live site URL + GitHub repo (both when available)

### Filtering & navigation
- Separate /projects page exists alongside home page
- Tech stack filters on /projects page
- Filter UI: Claude's discretion
- Sortable: Yes, visitors can sort projects (by date, name, etc.)

### Claude's Discretion
- Home page about section inclusion
- Card hover interaction pattern
- Desktop grid column count
- Project detail hero layout
- Tech filter UI implementation (pills vs dropdown)
- Exact spacing, typography, and visual polish

</decisions>

<specifics>
## Specific Ideas

No specific requirements - open to standard approaches for portfolio sites.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 02-projects-home*
*Context gathered: 2026-02-03*
