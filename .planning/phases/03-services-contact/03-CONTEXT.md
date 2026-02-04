# Phase 3: Services & Contact - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Conversion-focused pages enabling local business owners to understand the $500 WordPress offer and take action. Includes services page with 3 tiers, Calendly booking integration, contact form with Convex storage and email notification, and about page with Jon's background. Each page has distinct CTAs matching visitor intent.

</domain>

<decisions>
## Implementation Decisions

### Service Tier Presentation
- Side-by-side cards layout, 3 equal cards with $500 tier highlighted
- Pricing: $500 shown explicitly for WordPress tier, other tiers show "Contact"
- $500 tier card uses benefit-focused bullets (outcomes not features)

### Calendly Integration
- Popup widget modal when user clicks booking CTA (keeps user in context)
- Booking CTAs appear on multiple pages: Services, Home, and About
- Single event type vs multiple: Claude's discretion based on conversion patterns
- Post-booking flow: Claude's discretion (Calendly default or custom thank-you)

### Contact Form
- Fields: name, email, project type dropdown, message (4 fields)
- Project type dropdown options: Claude's discretion based on portfolio/services
- Email notification approach: Claude's discretion (Convex action to email service vs webhook)
- Success state: Redirect to dedicated thank-you page after submission

### About Page
- Structured sections format (Background, Approach, Why Me, etc.)
- No photo initially - text only, can add later
- Tone: Mix of professional credentials with conversational writing style
- Dual CTAs: Primary "Book a call" (Calendly), Secondary "View my work" (Projects)

### Claude's Discretion
- Service tier names and structure (suggested: $500 WordPress / Custom Dev / Consulting)
- Calendly event type strategy (single vs multiple)
- Post-booking confirmation flow
- Contact form project type dropdown options
- Email notification implementation (Resend vs webhook)
- Exact deliverables list for service tiers
- About page section headings and content structure

</decisions>

<specifics>
## Specific Ideas

- $500 tier should anchor the page - it's the primary offer for local business owners
- Benefit-focused language over feature lists ("Get online in 5 days" not "5-7 pages")
- Calendly popup keeps user in context rather than redirecting away
- Thank-you pages (both contact and booking) provide clear next steps
- About page builds trust through mix of credibility and approachability

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 03-services-contact*
*Context gathered: 2026-02-03*
