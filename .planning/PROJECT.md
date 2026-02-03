# jpgerton.com

## What This Is

A personal portfolio and services site for Jon Gerton that serves as both a showcase for indie projects and a marketing hub for $500 WordPress sites targeting local service businesses. Built with Next.js and Convex, it includes a full admin dashboard for content management and lays the foundation for a future client portal.

## Core Value

**Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.**

Everything else (admin dashboard, future features) supports this conversion flow.

## Requirements

### Validated

(None yet - ship to validate)

### Active

**Public Site:**
- [ ] Home page with hero, project showcase, and services CTA
- [ ] Projects page displaying 6 indie projects with screenshots, descriptions, tech stacks, and links
- [ ] Services page with $500 WordPress offer details, what's included, and Calendly booking
- [ ] Contact page with both Calendly embed and Formspree-style form (stored in Convex)
- [ ] About page with background, experience, and philosophy
- [ ] SEO basics (meta tags, Open Graph, semantic HTML)
- [ ] Full AEO treatment (JSON-LD schema, FAQ sections, speakable markup)

**Admin Dashboard:**
- [ ] Convex Auth for admin authentication
- [ ] CRUD for projects (add, edit, delete, reorder)
- [ ] View and manage contact form submissions
- [ ] Dashboard home showing recent activity

**WordPress Delivery System:**
- [ ] Starter template with pre-configured theme and plugins
- [ ] Content workflow documentation (intake -> Claude-assisted drafting -> approval)
- [ ] Local staging setup instructions
- [ ] Handoff and deployment checklist

### Out of Scope

- Blog/content publishing system - add later once site proves its value
- Client portal with login - foundation exists in Convex, defer feature until client volume warrants it
- OAuth login (Google, GitHub) - email/password sufficient for admin
- Real-time chat or support widget - contact form and Calendly cover the need
- E-commerce or payment processing - $500 sites paid via Stripe links outside the site
- Mobile app - web-first

## Context

**Background:**
- Jon has 20+ years full-stack experience across oil & gas, aviation, and data analytics
- Currently focused on indie projects and helping local businesses get online
- Has 6 projects to showcase: AI Marketing Memer, Flame or Fame, Huedle, DevClose.app, Planr (WIP), Chewie (local AI voice assistant)
- All project codebases on GitHub with live URLs available

**Target market for $500 service:**
- Local service businesses in Anchorage area (landscapers, cleaners, trades)
- Businesses with no website, Facebook-only presence, or broken/outdated sites
- Fixed-scope: 5-7 page site in 5 days

**Why Convex over Supabase:**
- Better DX with reactive queries and TypeScript integration
- Generous free tier (1M function calls/month)
- Built-in auth that fits the use case
- Foundation for future features (client portal, real-time updates)

**AEO (Answer Engine Optimization) priority:**
- Becoming increasingly important for visibility in AI-assisted search
- Differentiator in the local WordPress market
- Includes schema.org markup, FAQ sections, conversational content structure

## Constraints

- **Hosting:** Vercel free tier - must stay within limits
- **Database:** Convex free tier - 1M function calls/month ceiling
- **Budget:** $0 for infrastructure until first clients close
- **Timeline:** Portfolio site needed before outreach can begin
- **Content:** Project screenshots/descriptions will be gathered during build from GitHub and live sites
- **Local Dev:** Docker-first mandatory - no direct host execution. Bind mounts for live code updates. Ports 3400-3499 reserved (other apps use different ranges on workstation)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 App Router | Modern React patterns, great Vercel integration, familiar stack | - Pending |
| Convex over Supabase | Better DX, reactive queries, generous free tier, TypeScript-first | - Pending |
| Convex Auth over Clerk | Keeps auth in same ecosystem, simpler integration | - Pending |
| Full AEO treatment | Differentiator, future-proofing for AI search | - Pending |
| Both Calendly + form | Calendly for $500 bookings (qualified), form for everything else | - Pending |
| Admin dashboard vs Convex UI | Long-term maintainability without touching code | - Pending |
| Dockerized local dev | Consistent environment, port isolation (3400-3499), reproducible setup | - Pending |
| Git workflow (develop/main) | Develop branch for work, PRs to main for releases, limits Vercel deploys | - Pending |

---
*Last updated: 2025-02-03 after research*
