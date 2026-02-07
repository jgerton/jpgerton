# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.
**Current focus:** v1.2 Content Layer + Launch

## Current Position

Phase: 16 - Admin Content Management
Plan: 03 of 03 complete (Phase complete)
Status: Phase complete
Last activity: 2026-02-07 - Completed 16-03-PLAN.md

Progress: [████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 15% (5 of 33 plans complete in v1.2)

## Milestones

- v1.0 MVP - SHIPPED 2026-02-04 (7 phases, 39 plans)
- v1.1 Design Polish - SHIPPED 2026-02-06 (7 phases, 22 plans)
- v1.2 Content Layer + Launch - IN PROGRESS (5 phases, 5 of 33 plans complete)

## Accumulated Context

### Key Decisions

| Phase | Plan | Decision | Rationale |
|-------|------|----------|-----------|
| 15 | 01 | Optional cover images for drafts | coverImageId/Alt optional in schema; publish mutation validates presence |
| 15 | 01 | Category-based blog organization | Three fixed categories sufficient for launch (Local Business, Technical, Announcement) |
| 15 | 01 | Customizable case study section headings | Section headings stored as strings, not fixed values; defaults set in admin UI |
| 15 | 01 | Optional projectId link for case studies | Allows case studies for client work outside portfolio projects table |
| 15 | 01 | Compound status+publishedAt index | Enables efficient "published by date" queries without application-level filtering |
| 15 | 02 | Reading time calculated in queries | Computed from word count (200 wpm) not stored; keeps fresh as content changes |
| 15 | 02 | Slug collision includes deleted items | Prevents SEO confusion from slug reuse on deleted content |
| 15 | 02 | Published slug immutability | URL stability for published content (SEO, external links) - enforced in update mutations |
| 15 | 02 | Publish validation before state change | Cover image, alt text, minimums checked; descriptive errors thrown before patch |
| 15 | 02 | Soft delete preserves storage files | Allows restore without losing uploaded images (cover images intact) |
| 16 | 01 | Markdown editor code-splitting | Use next/dynamic with ssr: false for @uiw/react-md-editor to prevent hydration errors |
| 16 | 01 | Click-to-upload only (no drag-drop) | Simpler UX; set noDrag: true in useDropzone config |
| 16 | 01 | Backward-compatible ImageUploadZone | Optional generateUploadUrlFn prop with fallback to api.projects.generateUploadUrl |
| 16 | 01 | Remove 'as const' from siteConfig | Enable dynamic env variable usage for calendly.discoveryCallUrl |
| 16 | 02 | Row-level ConfirmDialog pattern | Delete confirmation in SortableBlogRow, simpler than page-level state management |
| 16 | 02 | Filter tabs operate on client-side filtered view | Status filtering in component, reorder mutation receives only visible items |
| 16 | 02 | Slug field disabled on create, editable on edit for drafts | Server auto-generates slug on create; edit page disables if published for URL stability |
| 16 | 02 | Conditional alt text validation via zod refine() | Alt text required when coverImageId present, enforced at schema level |
| 16 | 03 | Single markdown editor with section dividers | User decision: ONE editor with headings, not separate editors per section |
| 16 | 03 | Index-based section parsing | Find heading indices, extract content between - more robust than regex or text matching |
| 16 | 03 | Heading sync on blur event | Track previous heading values, replace in markdown when input loses focus |

### Research Flags

- No phases need additional research (all patterns validated in SUMMARY.md)

### Todos

- None

### Blockers

- None

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Fix mobile nav dialog leaking on desktop viewport | 2026-02-06 | ac4a77e | [001-fix-mobile-nav-dialog-leak-on-desktop](./quick/001-fix-mobile-nav-dialog-leak-on-desktop/) |

## Session Continuity

Last session: 2026-02-07
Stopped at: Completed 16-03-PLAN.md (case study admin CRUD interface - Phase 16 complete)
Resume file: None
Next action: /gsd:phase 17 (Public Content Pages)

## Deployment Info

- **GitHub:** https://github.com/jgerton/jpgerton
- **Vercel Production:** https://wp-designer.vercel.app
- **Convex:** https://amicable-pony-588.convex.cloud
- **Local Dev:** http://localhost:3400 (via docker compose up)
