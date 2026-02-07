# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.
**Current focus:** v1.2 Content Layer + Launch (SHIPPED)

## Current Position

Phase: 19 - Launch Prep Tech Debt
Plan: 03 of 03 complete
Status: Phase complete
Last activity: 2026-02-07 - Completed 19-03-PLAN.md

Progress: [████████████████████████████████] 100% (15 of 15 plans complete in v1.2)

## Milestones

- v1.0 MVP - SHIPPED 2026-02-04 (7 phases, 39 plans)
- v1.1 Design Polish - SHIPPED 2026-02-06 (7 phases, 22 plans)
- v1.2 Content Layer + Launch - SHIPPED 2026-02-07 (5 phases, 15 plans)

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
| 17 | 01 | Client-side filtering and pagination | Simpler for initial launch; posts list small; enables instant filtering without server round-trips |
| 17 | 01 | Custom prose styles instead of plugin | Full control using existing design tokens; avoids @tailwindcss/typography dependency |
| 17 | 01 | github-dark syntax theme for all modes | Good contrast in both light and dark modes; familiar GitHub aesthetic |
| 17 | 01 | Category filter shows only categories with posts | Cleaner UI; avoids confusion from empty category results |
| 17 | 02 | Server Component for BlogPostContent | react-markdown is RSC-compatible; no client-side state needed |
| 17 | 02 | Dynamic OG images via ImageResponse | No external service needed; generates at build/runtime; uses gradient branding |
| 17 | 02 | Inline styles only for OG images | ImageResponse limitation - no Tailwind, no CSS variables, only flexbox subset |
| 17 | 02 | Blog nav link between Projects and Services | Logical flow - portfolio first, then blog, then services/conversion |
| 18 | 01 | Testimonials table is lightweight | No status/publishedAt fields (simpler than blog/case studies) - managed via isDeleted only |
| 18 | 01 | Seed mutation is idempotent | Checks for existing data first to prevent duplicate inserts on multiple runs |
| 18 | 02 | Display only first case study when multiple exist | Show most recent by displayOrder to keep project detail pages focused |
| 18 | 02 | Metrics transformation pattern | Transform {label, value} objects to "Label: Value" strings for CaseStudyVisual component |
| 18 | 02 | Section heading based on data source | "Case Study" for real linked data, "Project Highlights" for fallback - transparency for users |
| 18 | 02 | Fallback data intentionally similar | Maintains consistency for projects without case studies using project.descriptionLong and techStack |
| 18 | 03 | Blog section heading: "Insights & Updates" | User decision locked in plan instructions |
| 18 | 03 | Blog section CTA: "Read More" to /blog | User decision locked in plan instructions |
| 18 | 03 | Blog section hidden when no posts | Prevents layout shift; blog section is new content users won't expect during load |
| 18 | 03 | Testimonials show during loading | Consistent with projects pattern - prevents flash of empty state, maintains layout stability |
| 18 | 03 | Single column grid for blog cards | BlogPostCard is horizontal layout; stacking vertically in single column looks better than multi-column |
| 19 | 01 | Default OG image uses same blue gradient branding as blog posts | Consistent visual identity across all social sharing previews |
| 19 | 01 | OG image content locked | Jon Gerton, Custom Websites for $500, jpgerton.com - matches site positioning |
| 19 | 01 | Only /admin/ disallowed in robots.txt | Removed /api/, /login restrictions - all public routes crawlable for SEO |
| 19 | 02 | Track CTA clicks with optional trackingName prop | Allows opt-in tracking without breaking existing usage |
| 19 | 02 | Fire Calendly tracking on wrapper div click | PopupButton is third-party, wrapping is cleanest approach |
| 19 | 02 | Track form submit only after successful submission | Avoids counting failed submissions as conversions |
| 19 | 02 | Use intersection observer with 50% threshold for read completion | User must scroll to visible portion of sentinel to count as read |
| 19 | 02 | Make CTAButton a client component | Required for onClick handler, asChild pattern still works with Link |
| 19 | 03 | No other orphans found in components/ | All components except HeroSection actively used; cleanup successful |

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
Stopped at: Phase 19 complete (v1.2 milestone complete)
Resume file: None
Next action: Audit milestone v1.2 then complete milestone

## Deployment Info

- **GitHub:** https://github.com/jgerton/jpgerton
- **Vercel Production:** https://wp-designer.vercel.app
- **Convex:** https://amicable-pony-588.convex.cloud
- **Local Dev:** http://localhost:3400 (via docker compose up)
