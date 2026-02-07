# Phase 17: Public Blog Pages - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can discover and read published blog posts on the public site. Includes a list page with category filtering and pagination, individual post pages with server-rendered markdown and syntax highlighting, and complete SEO metadata (OG images, Article schema). Admin features (Phase 16) and content integration into other pages (Phase 18) are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Blog list layout
- Horizontal card layout (image left, text right), single column stacked
- Each card shows: cover image, title, excerpt (2-3 lines), category badge, read time, published date
- Hero section at top of /blog page with heading, subtitle, consistent with other pages (services, projects)
- "Coming soon" empty state when no published posts exist, with CTA to book a call or check back

### Reading experience
- Narrow prose-width content area (~65ch / max-w-prose), centered with generous margins
- Full-width hero cover image above the title on post detail page
- Book-a-call CTA at the bottom of every post (no related posts section)

### Category filtering
- Pill/chip buttons in a row (All, Local Business, Technical, Announcement) above the post list
- All categories treated equally, no pinning or special treatment for Announcements
- No post counts on pills, just category names
- Hide categories with zero published posts (only show categories that have content)
- Changing category filter resets pagination to page 1

### Pagination
- Classic numbered page navigation (not load-more or infinite scroll)
- 10 posts per page (not 20, better suited for horizontal card height)
- Full pagination bar: Previous, page numbers, Next, with first/last shortcuts when many pages

### Claude's Discretion
- Code block theme and syntax highlighting appearance (dark vs site-theme adaptive)
- URL behavior for category filtering (query params vs client-only)
- Exact hero section design and subtitle copy
- Empty state illustration/design details
- Pagination bar layout and edge-case handling (ellipsis for many pages, etc.)

</decisions>

<specifics>
## Specific Ideas

- Horizontal card style inspired by Medium's post list (image left, content right)
- Hero section should match the pattern of other public pages on the site
- Empty state should still drive engagement (CTA to book a call)
- Post detail page: cover image -> title/meta -> prose content -> CTA (clean vertical flow)

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 17-public-blog-pages*
*Context gathered: 2026-02-07*
