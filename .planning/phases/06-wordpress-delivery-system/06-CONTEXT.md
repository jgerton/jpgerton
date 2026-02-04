# Phase 6: WordPress Delivery System - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Documentation and templates enabling Jon to deliver $500 WordPress sites profitably with scope and payment protection. This phase produces operational documentation, not code - starter template docs, content workflow guides, scope control templates, and handoff checklists.

</domain>

<decisions>
## Implementation Decisions

### Starter Template Stack

**Base Theme:**
- Kadence as default theme (block editor native, strong free tier, modern stack)
- Flexibility to use Astra or GeneratePress when project needs dictate
- Rationale: Kadence built for Gutenberg/FSE future, free version handles 90% of needs

**Editor Approach:**
- Block editor only with Kadence Blocks - no page builders
- Optimized for Jon's build speed and minimal maintenance, not client self-editing
- 9/10 clients want "done for them" sites, won't edit themselves

**Plugin Stack (7-8 plugins total):**
Essential:
- Kadence Blocks (page building)
- Wordfence (security)
- UpdraftPlus (backups)
- Rank Math (SEO)
- WPForms Lite or Kadence Forms (contact forms)

"Nice Touch" extras:
- WP Mail SMTP (ensures form submissions arrive)
- Site Kit by Google (gives clients analytics dashboard)
- Starter Templates (Kadence library for fast base layouts)

**Page Structure:**
- 5-page standard: Home, About, Services, Contact, Privacy Policy
- Expandable to 7 pages if client provides testimonials/FAQ content
- "Fame Wall" testimonial display similar to portfolio project cards

### Content Workflow

**Content Intake:**
- Hybrid approach: Short questionnaire + discovery call to fill gaps
- Questionnaire collects basics upfront, call handles nuance

**Claude-Assisted Drafting:**
- Flexible to handle all scenarios:
  - Full page copy from questionnaire/call notes
  - Headlines + CTAs only (client provides body)
  - Polish existing content client provides
- Adapt based on what each client brings

**Revision Rounds:**
- 2 rounds included in $500 (industry standard)
- Additional revisions: $75/round or $50/hour
- Clear definition: "revision" = tweaks to existing deliverables, not new scope

**Content Delays:**
- Timeline pauses if client doesn't provide content on time
- No penalty but they lose their spot in queue

### Scope & Payment Protection

**Payment Structure:**
- 50% upfront, 50% before launch (industry standard)

**Change Requests:**
- Change order process for out-of-scope requests
- Never say "no" - say "yes, and here's what it costs"
- Written approval required before starting additional work

**What's Included in $500:**
- 5-7 pages + contact form + mobile responsive
- Basic SEO setup (titles, descriptions, sitemap)
- Google Maps embed + click-to-call
- 30-day bug fix warranty (not open-ended support)

**Bug Fix Warranty Definition:**
- Covers: Functionality that worked at launch but stopped working
- Does NOT cover: Content changes, new features, design revisions, requests outside original scope
- Contract language should clearly distinguish bugs from new work

### Handoff Process

**Staging Environment:**
- Build on staging.jongerton.com (Jon's controlled environment)
- Client gets preview link during development
- Migration to client hosting at launch using Duplicator or All-in-One WP Migration
- Must remember: noindex staging, password protect

**Training/Documentation:**
- Written PDF guide (template, customize 20% per client)
- 5-10 minute Loom video walkthrough of their specific site
- Loom recorded with their site on screen, say their business name - feels premium
- No live training calls at $500 tier

**Written Guide Contents:**
- Login credentials (WordPress, hosting, domain)
- How to edit text/images (with screenshots)
- How to add a blog post
- Who to contact for support
- What NOT to touch

**DNS Configuration:**
- Jon handles DNS, SSL verification, go-live
- Cleaner handoff, avoids client confusion

**Credentials Transfer:**
- One-time secret link (onetimesecret.com or similar)
- Zero friction for non-tech clients
- Link expires after viewing, they save to their notes

### Claude's Discretion

- Migration plugin choice (Duplicator vs All-in-One WP Migration)
- Specific Kadence starter template selection per project
- Written guide template format (PDF vs Notion vs Google Doc)
- Staging site organization (subdomain naming, cleanup schedule)

</decisions>

<specifics>
## Specific Ideas

- "Fame Wall" testimonial display modeled after the portfolio project cards from jpgerton.com
- Site Kit by Google as "nice touch" - clients can check visitor stats, feels like they got extra value
- WP Mail SMTP prevents "I never got the lead" disasters - huge value, low effort
- Loom walkthrough with client's business name and their actual site on screen - takes 10 minutes but feels like $2000 service
- One-time secret links feel professional ("secure link that expires") while being zero friction

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 06-wordpress-delivery-system*
*Context gathered: 2026-02-04*
