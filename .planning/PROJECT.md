# jpgerton.com

## What This Is

A personal portfolio and services site for Jon Gerton that serves as both a showcase for indie projects and a marketing hub for $500 WordPress sites targeting local service businesses. Built with Next.js 14 and Convex, it features a professionally crafted design system with warm typography (Lora + Inter), WCAG AA accessibility, conversion-optimized page layouts, and a full admin dashboard with content management (blog, case studies, testimonials). Includes complete SEO/AEO treatment, GA4 analytics, dynamic OG images, documented WordPress delivery system, and business protection safeguards. Production-ready and launched.

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

**Design System (v1.1):**

- Shipped Design token architecture (spacing, shadows, durations, easing) in Tailwind v4 @theme
- Shipped WCAG AA verified color palette with warm blue-gray dark mode and amber accent
- Shipped Lora + Inter typography system with fluid type scale (CSS clamp)
- Shipped Component library with CVA variants (Button 5 levels, Card 4 elevations, Badge categories)
- Shipped 6 portfolio composition components (CTAButton, ProjectCardEnhanced, TestimonialCard, CaseStudyVisual, SocialProofDisplay, HeroWithGradient)
- Shipped CSS-only animation system with scroll-triggered fade-ups and prefers-reduced-motion
- Shipped Unified SiteNav with sticky header, backdrop blur, mobile menu with focus trap
- Shipped Conversion-optimized page layouts with dual CTA pattern and benefit-focused copy
- Shipped WCAG 2.1 AA compliance (landmarks, heading hierarchy, keyboard nav, 44px touch targets)
- Shipped Core Web Vitals: LCP 132ms, CLS 0, INP 24ms

**Content Layer + Launch (v1.2):**

- Shipped Blog system with markdown editor, live preview, category filtering, pagination, syntax highlighting
- Shipped Blog SEO: dynamic OG images, JSON-LD Article schema, sitemap integration
- Shipped Case studies CRUD with project linking, drag-to-reorder, public display on project detail pages
- Shipped Testimonials backend with seed data and dynamic display on home page
- Shipped Default OG image (1200x630) with brand-consistent gradient
- Shipped GA4 custom event tracking (CTA clicks, form submissions, Calendly bookings, blog engagement)
- Shipped Robots.txt and sitemap configuration for search engine indexing
- Shipped Tech debt cleanup (orphaned components removed, hardcoded values extracted)

### Active

No active milestone. Planning next milestone.

### Out of Scope

- Client portal with login - foundation exists in Convex, defer until client volume warrants it
- OAuth login (Google, GitHub) - email/password sufficient for admin
- Real-time chat or support widget - contact form and Calendly cover the need
- E-commerce or payment processing - $500 sites paid via Stripe links outside the site
- Mobile app - web-first, PWA works well
- Offline mode - real-time Convex queries are core to admin UX
- Tag system for blog - categories sufficient for dual-audience content
- Comment system - spam/moderation burden, no clear value for portfolio site
- WYSIWYG editor - markdown-first approach, better DX
- Multi-author support - single-author site

## Context

**Shipped v1.0 + v1.1 + v1.2 with ~12,500 LOC TypeScript/CSS.**
Tech stack: Next.js 14, Convex, Tailwind v4 (CSS-first), shadcn/ui, Docker, GitHub Actions, Vercel.
19 phases, 76 plans shipped across 3 milestones. Site is production-ready and launched.

**Background:**

- Jon has 20+ years full-stack experience across oil & gas, aviation, and data analytics
- Currently focused on indie projects and helping local businesses get online
- 6 projects showcased: AI Marketing Memer, Flame or Fame, Huedle, DevClose.app, Planr, Chewie
- All project codebases on GitHub with live URLs available

**Target market for $500 service:**

- Local service businesses in Anchorage area (landscapers, cleaners, trades)
- Businesses with no website, Facebook-only presence, or broken/outdated sites
- Fixed-scope: 5-7 page site in 5 days

**Known tech debt (from v1.2 audit):**

- Admin UI buttons for unpublish/restore mutations (currently callable via Convex dashboard only)
- Public /case-studies index page (backend ready, no frontend route yet)
- Testimonials admin CRUD (managed via Convex dashboard + seed mutation)
- Testimonials seed mutation requires manual Convex dashboard execution
- Pre-existing lint warnings in useIntersectionObserver (false positive, correct implementation)
- 4 Safari items for eventual real-device visual spot-check

## Constraints

- **Hosting:** Vercel free tier - must stay within limits
- **Database:** Convex free tier - 1M function calls/month ceiling
- **Budget:** $0 for infrastructure until first clients close
- **Local Dev:** Docker-first mandatory - no direct host execution. Ports 3400-3499 reserved

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 App Router | Modern React patterns, great Vercel integration, familiar stack | Good |
| Convex over Supabase | Better DX, reactive queries, generous free tier, TypeScript-first | Good |
| Convex Auth over Clerk | Keeps auth in same ecosystem, simpler integration | Good |
| Full AEO treatment | Differentiator, future-proofing for AI search | Good |
| Both Calendly + form | Calendly for $500 bookings (qualified), form for everything else | Good |
| Admin dashboard vs Convex UI | Long-term maintainability without touching code | Good |
| Dockerized local dev | Consistent environment, port isolation (3400-3499), reproducible setup | Good |
| Git workflow (develop/main) | Develop branch for work, PRs to main for releases, limits Vercel deploys | Good |
| Bun over npm | 10-25x faster installs, fully compatible | Good |
| Tailwind v4 CSS-first | Simpler config, HSL variables, @theme directive | Good |
| dnd-kit for drag-drop | Accessibility-first, smaller bundle than alternatives | Good |
| Kadence as WP standard | Block editor native, no page builder lock-in | Good |
| 11-section contract | Comprehensive protection without lawyer fees | Revisit |
| Lora + Inter font pairing | Warm professional personality, serif display + sans body | Good |
| CSS-only animations | Zero bundle cost, GPU-accelerated, protects Lighthouse 100 | Good |
| CVA composition pattern | Extend shadcn/ui without modifying primitives | Good |
| Warm blue-gray dark mode | Premium aesthetic vs pure black, 220 hue 15% sat | Good |
| Amber accent with dark text | 8.16:1 contrast, consistent with accent/accent-warm pattern | Good |
| Dual CTA pattern | Warm/amber = WordPress, outline/blue = custom inquiry, instant differentiation | Good |
| Benefit-focused CTA copy | "Get Your Business Online" converts better than "Learn More" | Good |
| Callback ref over useRef | Handles conditional rendering (loading -> content) correctly | Good |
| Markdown + rehype-highlight | Server-side rendering, no client JS for blog content, syntax highlighting | Good |
| Custom prose styles | Full control with existing tokens, avoids @tailwindcss/typography dependency | Good |
| Client-side blog filtering | Small post count, instant filtering, simpler than server round-trips | Good |
| Single markdown editor for case studies | One editor with section headings, not separate editors per section | Good |
| Soft delete with restore | Preserves uploaded images, allows undo, prevents data loss | Good |
| Published slug immutability | URL stability for SEO and external links | Good |
| GA4 event tracking on conversions | CTA clicks, form submissions, Calendly bookings, blog engagement | Good |
| Dynamic OG images via next/og | No external service needed, gradient branding consistent with site | Good |
| Lightweight testimonials table | No status/publishedAt, managed via dashboard only for now | Good |

---

*Last updated: 2026-02-07 after v1.2 milestone*
