# Phase 19: Launch Prep + Tech Debt - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Site is production-ready with complete SEO/AEO configuration, analytics, default OG image, and technical debt from v1.1 audit resolved. This phase closes out v1.2 and prepares the site for public launch.

</domain>

<decisions>
## Implementation Decisions

### Default OG image
- Minimal logo + tagline style, clean and understated
- Tagline text: "Custom Websites for $500"
- Include URL (jpgerton.com) as subtle footer element
- Name/branding + tagline + URL on clean background

### Analytics & tracking
- GA4 with custom events: CTA clicks ("Book a Call" button, contact form submissions) + blog engagement (scroll depth, category filter usage, read-through rate)
- No cookie consent banner needed (US local business audience, anonymized IPs)
- GA4 script loads conditionally only when NEXT_PUBLIC_GA_ID env var is set (no tracking in dev/preview)
- Also add Vercel Analytics (free on hobby plan, gives Web Vitals data)

### Sitemap & SEO
- Robots.txt: disallow /admin only, allow all other paths
- Sitemap: include reference to sitemap location

### Tech debt
- Delete orphaned HeroSection component (known item)
- Light scan for other obvious orphans from v1.0/v1.1 (not a deep audit)
- No known issues from Phases 15-18 to address

### Claude's Discretion
- OG image format (static PNG vs dynamic ImageResponse) - pick what fits the existing blog OG pattern
- Sitemap route inclusion - audit existing routes and include everything with meaningful content
- Sitemap generation strategy (static vs dynamic with revalidation) - balance freshness with free tier
- Google Search Console submission - recommend based on launch readiness
- Lighthouse audit approach - given v1.1 already has excellent Core Web Vitals (LCP 132ms, CLS 0, INP 24ms), decide whether to audit+fix or verify only
- Launch checklist scope - determine what verification is needed based on roadmap success criteria

</decisions>

<specifics>
## Specific Ideas

- OG image should feel professional and understated, not flashy
- Price point ($500) is the key differentiator and should be prominent
- Analytics should not add any user-visible friction (no banners, no consent flows)
- Vercel Analytics complements GA4 with Web Vitals monitoring at no cost

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 19-launch-prep-tech-debt*
*Context gathered: 2026-02-07*
