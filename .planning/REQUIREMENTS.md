# Requirements: jpgerton.com

**Defined:** 2025-02-03
**Core Value:** Local business owners who need a website can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: Dockerized local development environment (mandatory - no direct host execution)
- [ ] **INFRA-02**: Port mapping in 3400-3499 range (3400 for Next.js, 3401 for Convex)
- [ ] **INFRA-11**: Docker volume mounts for live code updates (bind mount codebase, not copy into container)
- [ ] **INFRA-12**: Docker Compose for orchestrating Next.js and Convex services
- [ ] **INFRA-03**: Next.js 14 App Router project structure
- [ ] **INFRA-04**: Convex database and backend integration
- [ ] **INFRA-05**: Tailwind CSS + shadcn/ui component library
- [ ] **INFRA-06**: Vercel deployment configuration (main branch only)
- [ ] **INFRA-07**: Dark/light mode toggle with system preference detection
- [ ] **INFRA-08**: Git branching strategy (develop branch for work, main for production releases)
- [ ] **INFRA-09**: GitHub Actions workflow for PR validation (lint, type-check, build)
- [ ] **INFRA-10**: Branch protection rules (require PR and passing checks before merge to main)

### Public Pages

- [ ] **PAGE-01**: Home page with hero section, project showcase (6 projects), and services CTA
- [ ] **PAGE-02**: Projects page with filterable grid of 6 projects (AI Marketing Memer, Flame or Fame, Huedle, DevClose.app, Planr, Chewie)
- [ ] **PAGE-03**: Individual project detail pages with screenshots, descriptions, tech stacks, and links
- [ ] **PAGE-04**: Services page with 3 tiers ($500 WordPress, Custom Web Apps, Team Growth Accelerator)
- [ ] **PAGE-05**: Contact page with Calendly embed for $500 bookings and contact form for other inquiries
- [ ] **PAGE-06**: About page with background, experience, and philosophy

### Projects Data

- [ ] **PROJ-01**: Project data model in Convex (name, description, screenshots, tech stack, links, featured flag)
- [ ] **PROJ-02**: Each project displays: name, one-line description, screenshot/preview, tech stack tags, live URL, GitHub repo link
- [ ] **PROJ-03**: Projects sortable/reorderable via admin dashboard

### Services Content

- [ ] **SERV-01**: $500 WordPress Sites tier with deliverables (5-7 pages, mobile responsive, contact form, Google Maps, basic SEO)
- [ ] **SERV-02**: Custom Web Apps tier with inquiry-based CTA
- [ ] **SERV-03**: Team Growth Accelerator tier with workshop description and CTA
- [ ] **SERV-04**: Clear pricing display for $500 tier
- [ ] **SERV-05**: Calendly booking button specifically for $500 service

### Contact & Conversion

- [ ] **CONT-01**: Calendly embed for $500 WordPress site bookings
- [ ] **CONT-02**: Contact form with 3 fields max (name, email, message) for custom inquiries
- [ ] **CONT-03**: Form submissions stored in Convex database
- [ ] **CONT-04**: Email notification on form submission (via Resend or similar)
- [ ] **CONT-05**: Dual CTA strategy - distinct paths for WordPress clients vs custom work

### SEO & AEO

- [ ] **SEO-01**: Proper title and meta description per page
- [ ] **SEO-02**: Open Graph tags for social sharing
- [ ] **SEO-03**: Semantic HTML structure (h1, h2, proper landmarks)
- [ ] **SEO-04**: JSON-LD schema markup (LocalBusiness, Service, Person)
- [ ] **SEO-05**: FAQ sections with schema markup on Services page
- [ ] **SEO-06**: Speakable markup for AI assistant discoverability
- [ ] **SEO-07**: llms.txt generation via next-aeo for ChatGPT/Perplexity/Google AI Overviews
- [ ] **SEO-08**: Dynamic sitemap generation

### Admin Dashboard

- [ ] **ADMIN-01**: Protected admin routes (/admin/\*)
- [ ] **ADMIN-02**: Convex Auth with email/password login
- [ ] **ADMIN-03**: Dashboard home showing recent contact submissions and quick stats
- [ ] **ADMIN-04**: Projects CRUD (create, read, update, delete)
- [ ] **ADMIN-05**: Project reordering/featuring capability
- [ ] **ADMIN-06**: Contact submissions list with read/archive functionality

### Analytics

- [ ] **ANLYT-01**: Vercel Analytics integration
- [ ] **ANLYT-02**: Google Analytics 4 setup
- [ ] **ANLYT-03**: UTM parameter tracking for Calendly conversions

### Performance

- [ ] **PERF-01**: Lighthouse performance score > 90
- [ ] **PERF-02**: Page load time < 3 seconds
- [ ] **PERF-03**: Image optimization via Next.js Image component
- [ ] **PERF-04**: Mobile responsive design (tested on iOS and Android)

### WordPress Delivery System

- [ ] **WPDEL-01**: Starter template documentation (theme + plugins list)
- [ ] **WPDEL-02**: Content workflow documentation (intake -> Claude-assisted drafting -> approval)
- [ ] **WPDEL-03**: Local staging setup instructions (Local by WP)
- [ ] **WPDEL-04**: Handoff checklist (deployment, DNS, credentials transfer)
- [ ] **WPDEL-05**: Payment protection documentation (50% upfront, no launch before final payment)
- [ ] **WPDEL-06**: Scope control template (what's included, change request process)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content & Social Proof

- **TEST-01**: Testimonials section with client photos, names, and quotes
- **TEST-02**: Before/after WordPress site showcases
- **TEST-03**: Google Reviews integration
- **CASE-01**: Case study format for deeper project storytelling

### Content Marketing

- **BLOG-01**: Blog/articles section
- **NEWS-01**: Email newsletter signup

### Enhanced Features

- **VIDEO-01**: Video demos/walkthroughs for projects
- **CHAT-01**: Live chat integration
- **PORTAL-01**: Client portal for project status tracking

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                       | Reason                                                |
| ----------------------------- | ----------------------------------------------------- |
| Every project ever built      | Quality over quantity - curated 6 projects sufficient |
| OAuth login (Google, GitHub)  | Email/password sufficient for admin-only auth         |
| E-commerce/payment processing | $500 sites paid via Stripe links outside the site     |
| Mobile app                    | Web-first approach                                    |
| Custom booking system         | Calendly is proven, tracked, maintained               |
| Social media feed embedding   | Performance hit, maintenance burden                   |
| Auto-playing videos           | Accessibility issue, annoying UX                      |
| Real-time chat for MVP        | Contact form + Calendly cover the need                |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| INFRA-01    | Phase 1 | Pending |
| INFRA-02    | Phase 1 | Pending |
| INFRA-03    | Phase 1 | Pending |
| INFRA-04    | Phase 1 | Pending |
| INFRA-05    | Phase 1 | Pending |
| INFRA-06    | Phase 1 | Pending |
| INFRA-07    | Phase 1 | Pending |
| INFRA-08    | Phase 1 | Pending |
| INFRA-09    | Phase 1 | Pending |
| INFRA-10    | Phase 1 | Pending |
| INFRA-11    | Phase 1 | Pending |
| INFRA-12    | Phase 1 | Pending |
| PROJ-01     | Phase 2 | Pending |
| PAGE-01     | Phase 2 | Pending |
| PAGE-02     | Phase 2 | Pending |
| PAGE-03     | Phase 2 | Pending |
| PROJ-02     | Phase 2 | Pending |
| PROJ-03     | Phase 2 | Pending |
| PAGE-04     | Phase 3 | Pending |
| SERV-01     | Phase 3 | Pending |
| SERV-02     | Phase 3 | Pending |
| SERV-03     | Phase 3 | Pending |
| SERV-04     | Phase 3 | Pending |
| SERV-05     | Phase 3 | Pending |
| PAGE-05     | Phase 3 | Pending |
| CONT-01     | Phase 3 | Pending |
| CONT-02     | Phase 3 | Pending |
| CONT-03     | Phase 3 | Pending |
| CONT-04     | Phase 3 | Pending |
| CONT-05     | Phase 3 | Pending |
| PAGE-06     | Phase 3 | Pending |
| ADMIN-01    | Phase 4 | Pending |
| ADMIN-02    | Phase 4 | Pending |
| ADMIN-03    | Phase 4 | Pending |
| ADMIN-04    | Phase 4 | Pending |
| ADMIN-05    | Phase 4 | Pending |
| ADMIN-06    | Phase 4 | Pending |
| SEO-01      | Phase 5 | Pending |
| SEO-02      | Phase 5 | Pending |
| SEO-03      | Phase 5 | Pending |
| SEO-04      | Phase 5 | Pending |
| SEO-05      | Phase 5 | Pending |
| SEO-06      | Phase 5 | Pending |
| SEO-07      | Phase 5 | Pending |
| SEO-08      | Phase 5 | Pending |
| ANLYT-01    | Phase 5 | Pending |
| ANLYT-02    | Phase 5 | Pending |
| ANLYT-03    | Phase 5 | Pending |
| PERF-01     | Phase 5 | Pending |
| PERF-02     | Phase 5 | Pending |
| PERF-03     | Phase 5 | Pending |
| PERF-04     | Phase 5 | Pending |
| WPDEL-01    | Phase 6 | Pending |
| WPDEL-02    | Phase 6 | Pending |
| WPDEL-03    | Phase 6 | Pending |
| WPDEL-04    | Phase 6 | Pending |
| WPDEL-05    | Phase 6 | Pending |
| WPDEL-06    | Phase 6 | Pending |

**Coverage:**

- v1 requirements: 53 total
- Mapped to phases: 53
- Unmapped: 0

---

_Requirements defined: 2025-02-03_
_Last updated: 2025-02-03 after initial definition_
