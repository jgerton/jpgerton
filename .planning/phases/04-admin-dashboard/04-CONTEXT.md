# Phase 4: Admin Dashboard - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Content management interface for Jon to manage project portfolio and contact form submissions without code deployments. Includes authentication, project CRUD with image uploads and reordering, and contact submission triage workflow.

</domain>

<decisions>
## Implementation Decisions

### Authentication flow
- 7-day session duration before requiring re-login
- Claude's discretion: login method (email/password vs magic link), route visibility, rate limiting/lockout policy

### Dashboard layout
- Top tabs navigation (horizontal tabs at top - Projects, Contacts, Settings)
- Distinct admin look - different palette from public site, clearly "backstage"
- Dark mode toggle available (same mechanism as public site)
- Claude's discretion: dashboard home landing view design

### Project management UX
- Full page form for create/edit (navigate to dedicated page with all fields)
- Image uploads support both drag-and-drop zone AND click-to-browse
- Drag and drop rows for reordering projects in the list
- Confirm dialog before deleting a project (prevents accidents)

### Contact submission handling
- Four-state workflow: Unread -> Read -> Responded -> Archived
- Inbox-style list organization (unread at top, read below)
- Bulk actions with checkboxes to select multiple and archive at once
- Claude's discretion: detail viewing experience (inline expand vs panel vs page)

### Claude's Discretion
- Login method implementation (email/password or magic link)
- Admin route path (/admin or obscured)
- Rate limiting/lockout policy for failed logins
- Dashboard home layout and quick stats design
- Contact detail viewing pattern

</decisions>

<specifics>
## Specific Ideas

- Admin should feel clearly separate from public site - "backstage" aesthetic
- Contact workflow mirrors email inbox mental model - unread stuff needs attention

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 04-admin-dashboard*
*Context gathered: 2026-02-03*
