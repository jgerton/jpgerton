# Phase 16: Admin Content Management - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete CRUD admin interfaces for blog posts and case studies with markdown editing, live preview, drag-to-reorder, and image upload. Also extracts hardcoded Calendly URL to environment variable. Does NOT include public-facing blog pages (Phase 17) or content integration into existing pages (Phase 18).

</domain>

<decisions>
## Implementation Decisions

### Editor layout & preview
- Tabbed Edit/Preview mode, not side-by-side split
- Form fields (title, slug, category, excerpt) stacked above the markdown editor in a vertical flow
- Slug generated server-side on first save, not auto-generated as you type (editable after generation)
- Case studies use a single markdown editor with section dividers (headings), not separate editors per section

### Content list views
- Compact table-style rows: title, category badge, status badge, date, action buttons
- Filter tabs at the top: All / Draft / Published
- Case studies list shows linked project name per row (or "Unlinked" for standalone studies)
- Drag-to-reorder ordering approach: Claude's Discretion (global vs per-status)

### Image upload flow
- Click-to-upload with file picker and preview thumbnail (not drag-and-drop)
- Cover image is always optional, even for published posts (fallback styling needed)
- Old image kept in storage until post is saved with new image (not deleted on upload)
- Alt text is a required field when a cover image is present (validation error if blank)

### Admin navigation
- Tab order: Projects > Blog > Case Studies > Contacts
- Count badges on Blog and Case Studies tabs (e.g., "Blog (12)")
- New/Edit blog post and case study open as full-page editors (/admin/blog/new, /admin/blog/[id]/edit, etc.)
- Default admin landing stays on Projects tab (no change)

### Claude's Discretion
- Drag-to-reorder: global ordering vs per-status ordering (pick based on existing projects pattern)
- Exact tab badge styling and count source (total vs filtered)
- Case study section divider approach in single editor
- Delete confirmation dialog copy and behavior
- Markdown editor toolbar configuration

</decisions>

<specifics>
## Specific Ideas

- Follow existing admin patterns (Projects tab) for consistency in layout and interaction
- Blog list should feel scannable, dense info per row like a CMS dashboard
- Editor page should be dedicated (full-page route), giving maximum space for writing
- Case study editor is simpler than blog: single content area with customizable section headings

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 16-admin-content-management*
*Context gathered: 2026-02-07*
