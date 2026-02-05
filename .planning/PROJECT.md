# jpgerton.com

## What This Is

A personal portfolio and services site for Jon Gerton that serves as both a showcase for indie projects and a marketing hub for $500 WordPress sites targeting local service businesses. Built with Next.js 14 and Convex, it includes a full admin dashboard for content management, complete SEO/AEO treatment for discoverability, and a documented WordPress delivery system with business protection safeguards.

## Core Value

**Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.**

Everything else (admin dashboard, delivery docs, business protection) supports this conversion flow.

## Requirements

### Validated

**Public Site (v1.0):**

- Shipped Home page with hero, 6-project showcase, and services CTA
- Shipped Projects page with filterable grid, tech stack tags, and detail pages
- Shipped Services page with $500 WordPress tier, pricing, and Calendly booking
- Shipped Contact page with Calendly embed and contact form (stored in Convex)
- Shipped About page with background, experience, philosophy, and dual CTAs
- Shipped SEO basics (meta tags, Open Graph, semantic HTML, sitemap)
- Shipped Full AEO treatment (JSON-LD schema, FAQ sections, speakable markup, llms.txt)

**Admin Dashboard (v1.0):**

- Shipped Convex Auth with email/password login and 7-day sessions
- Shipped Projects CRUD with drag-to-reorder and featured flag
- Shipped Contact inbox with four-state workflow and bulk archive
- Shipped Dashboard home with quick stats and recent contacts

**WordPress Delivery System (v1.0):**

- Shipped Starter template docs (Kadence + 7 plugins)
- Shipped Content workflow (intake, Claude-assisted drafting, approval)
- Shipped Staging setup guide with Duplicator migration
- Shipped Handoff checklist and client training guide

**Business Protection (v1.0):**

- Shipped Client agreement template (11-section signable contract)
- Shipped Client qualification checklist (6 must-haves, red flag scoring)
- Shipped Hosting requirements document (PHP 7.4+, 256MB memory minimum)
- Shipped Project termination protocol with prorated refund approach

**Analytics & Performance (v1.0):**

- Shipped Vercel Analytics, GA4 integration, UTM tracking for Calendly
- Shipped Lighthouse scores 100/96/100, sub-3s page load
- Shipped Image optimization via Next.js Image component
- Shipped Mobile responsive design

### Active

(No active requirements - define with next milestone via `/gsd:new-milestone`)

### Out of Scope

- Blog/content publishing system - add later once site proves its value
- Client portal with login - foundation exists in Convex, defer until client volume warrants it
- OAuth login (Google, GitHub) - email/password sufficient for admin
- Real-time chat or support widget - contact form and Calendly cover the need
- E-commerce or payment processing - $500 sites paid via Stripe links outside the site
- Mobile app - web-first, PWA works well
- Offline mode - real-time Convex queries are core to admin UX

## Context

**Shipped v1.0 with ~6,000 LOC TypeScript + ~6,200 lines documentation.**
Tech stack: Next.js 14, Convex, Tailwind v4, shadcn/ui, Docker, GitHub Actions, Vercel.

**Background:**

- Jon has 20+ years full-stack experience across oil & gas, aviation, and data analytics
- Currently focused on indie projects and helping local businesses get online
- 6 projects showcased: AI Marketing Memer, Flame or Fame, Huedle, DevClose.app, Planr, Chewie
- All project codebases on GitHub with live URLs available

**Target market for $500 service:**

- Local service businesses in Anchorage area (landscapers, cleaners, trades)
- Businesses with no website, Facebook-only presence, or broken/outdated sites
- Fixed-scope: 5-7 page site in 5 days

**Pre-launch items (13 tech debt from audit):**

- Create OG image (1200x630 JPEG)
- Set NEXT_PUBLIC_GA_ID in Vercel
- Remove noindex meta tag
- Move CALENDLY_URL to env variable
- Fill contract placeholders (phone, state)

## Constraints

- **Hosting:** Vercel free tier - must stay within limits
- **Database:** Convex free tier - 1M function calls/month ceiling
- **Budget:** $0 for infrastructure until first clients close
- **Local Dev:** Docker-first mandatory - no direct host execution. Ports 3400-3499 reserved

## Key Decisions

| Decision                     | Rationale                                                                | Outcome    |
| ---------------------------- | ------------------------------------------------------------------------ | ---------- |
| Next.js 14 App Router        | Modern React patterns, great Vercel integration, familiar stack          | Good       |
| Convex over Supabase         | Better DX, reactive queries, generous free tier, TypeScript-first        | Good       |
| Convex Auth over Clerk       | Keeps auth in same ecosystem, simpler integration                        | Good       |
| Full AEO treatment           | Differentiator, future-proofing for AI search                            | Good       |
| Both Calendly + form         | Calendly for $500 bookings (qualified), form for everything else         | Good       |
| Admin dashboard vs Convex UI | Long-term maintainability without touching code                          | Good       |
| Dockerized local dev         | Consistent environment, port isolation (3400-3499), reproducible setup   | Good       |
| Git workflow (develop/main)  | Develop branch for work, PRs to main for releases, limits Vercel deploys | Good       |
| Bun over npm                 | 10-25x faster installs, fully compatible                                 | Good       |
| Tailwind v4 CSS-first        | Simpler config, HSL variables, @theme directive                          | Good       |
| dnd-kit for drag-drop        | Accessibility-first, smaller bundle than alternatives                    | Good       |
| Kadence as WP standard       | Block editor native, no page builder lock-in                             | Good       |
| 11-section contract          | Comprehensive protection without lawyer fees                             | Revisit    |

---

*Last updated: 2026-02-04 after v1.0 milestone*
