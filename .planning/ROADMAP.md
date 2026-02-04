# Roadmap: jpgerton.com

## Overview

This roadmap transforms Jon Gerton's portfolio vision into a dual-purpose platform serving local business owners seeking $500 WordPress sites and custom development clients. The journey starts with infrastructure foundation and public-facing content, layers on admin capabilities for content management, optimizes for discoverability through SEO/AEO, and culminates with WordPress delivery documentation enabling revenue operations. Each phase delivers verifiable user outcomes that build toward the core value: local business owners can see Jon's work, understand the $500 offer, and book a call in under 2 minutes.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure** - Foundation setup (Next.js, Convex, Docker, Tailwind, dark mode)
- [x] **Phase 2: Projects & Home** - Public portfolio content showcasing 6 indie projects
- [x] **Phase 3: Services & Contact** - Conversion-focused pages with Calendly and contact form
- [x] **Phase 4: Admin Dashboard** - Content management interface with authentication
- [x] **Phase 5: SEO, AEO & Performance** - Discoverability and optimization layer
- [ ] **Phase 6: WordPress Delivery System** - Revenue operations documentation and templates

## Phase Details

### Phase 1: Infrastructure

**Goal**: Developer can run the application locally and deploy to production with proper Git workflow and styling capabilities.
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08, INFRA-09, INFRA-10, INFRA-11, INFRA-12
**Success Criteria** (what must be TRUE):

1. `docker compose up` starts the entire dev environment on ports 3400-3499
2. Code changes on host filesystem reflect immediately in running containers (volume mounts)
3. No direct `bun dev` or `npx convex dev` on host - all execution through Docker
4. Next.js app renders with Tailwind styles and shadcn/ui components working
5. Convex backend connects successfully with type-safe queries executable from frontend
6. User can toggle between dark and light mode with preference persisting across sessions
7. Application deploys to Vercel only when merged to main branch (not on develop commits)
8. GitHub repo has develop branch as default working branch, main branch protected
9. GitHub Actions runs lint, type-check, and build on every PR
10. PRs require passing checks before merge to main is allowed
    **Plans**: 5 plans in 5 waves

Plans:

- [x] 01-01-PLAN.md - Initialize Next.js 14 with Git branching (main/develop)
- [x] 01-02-PLAN.md - Create Dockerized development environment with hot reload
- [x] 01-03-PLAN.md - Integrate Convex backend with type-safe queries
- [x] 01-04-PLAN.md - Configure Tailwind, shadcn/ui, and dark mode toggle
- [x] 01-05-PLAN.md - Setup GitHub Actions CI and Vercel deployment

### Phase 2: Projects & Home

**Goal**: Visitor can view Jon's portfolio of 6 indie projects with descriptions, tech stacks, and links.
**Depends on**: Phase 1
**Requirements**: PROJ-01, PAGE-01, PAGE-02, PAGE-03, PROJ-02, PROJ-03
**Success Criteria** (what must be TRUE):

1. Visitor lands on home page and sees hero section with clear value proposition
2. Home page displays 6 featured projects with screenshots and one-line descriptions
3. Visitor can navigate to dedicated projects page showing filterable grid of all 6 projects
4. Clicking a project card navigates to detail page with full description, tech stack tags, live URL, and GitHub repo link
5. Project data model in Convex supports future reordering and featured flag functionality
   **Plans**: 4 plans in 3 waves

Plans:

- [x] 02-01-PLAN.md - Convex schema, project queries, and Next.js image config
- [x] 02-02-PLAN.md - Install nuqs and create portfolio components (ProjectCard, ProjectGrid, HeroSection, ProjectFilters)
- [x] 02-03-PLAN.md - Assemble home page, projects index, and project detail pages
- [x] 02-04-PLAN.md - Seed 6 projects and visual verification

### Phase 3: Services & Contact

**Goal**: Local business owner can understand the $500 WordPress offer and book a discovery call.
**Depends on**: Phase 2
**Requirements**: PAGE-04, SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, PAGE-05, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, PAGE-06
**Success Criteria** (what must be TRUE):

1. Visitor navigates to services page and sees 3 distinct service tiers with clear pricing for $500 WordPress package
2. $500 tier displays deliverables list (5-7 pages, mobile responsive, contact form, Google Maps, basic SEO)
3. Visitor clicks "Book Your $500 Site Call" button and accesses Calendly booking interface
4. Visitor submits contact form with name, email, message and receives confirmation
5. Form submission stores in Convex database and triggers email notification
6. Visitor can read about Jon's background and philosophy on dedicated about page
7. Each page presents distinct CTAs matching visitor intent (WordPress booking vs custom inquiry)
   **Plans**: 7 plans in 4 waves

Plans:

- [x] 03-01-PLAN.md - Foundation: packages, schema, Zod validation, pricing components
- [x] 03-02-PLAN.md - Backend: Convex contact mutations and Resend email action
- [x] 03-03-PLAN.md - Components: Calendly button and contact form
- [x] 03-04-PLAN.md - Services page with pricing tiers and Calendly booking
- [x] 03-05-PLAN.md - Contact page with form and thank-you page
- [x] 03-06-PLAN.md - About page with structured content and CTAs
- [x] 03-07-PLAN.md - Visual and functional verification

### Phase 4: Admin Dashboard

**Goal**: Jon can manage project content and contact submissions without code deployments.
**Depends on**: Phase 3
**Requirements**: ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06
**Success Criteria** (what must be TRUE):

1. Jon logs into /admin route with email/password and accesses protected dashboard
2. Dashboard home displays recent contact form submissions with quick stats
3. Jon can create new project entry with all fields (name, description, screenshots, tech stack, links)
4. Jon can edit existing project details and changes appear on public site immediately
5. Jon can delete project and it disappears from public pages
6. Jon can reorder projects via drag-and-drop and featured projects appear first on home page
7. Jon can view contact submissions list, mark as read, and archive processed inquiries
   **Plans**: 7 plans in 5 waves

Plans:

- [x] 04-01-PLAN.md - Convex Auth setup with Password provider and login page
- [x] 04-02-PLAN.md - Middleware for route protection and admin mutations
- [x] 04-03-PLAN.md - Admin layout with tabs navigation and backstage styling
- [x] 04-04-PLAN.md - Image upload zone and sortable list components (dnd-kit, react-dropzone)
- [x] 04-05-PLAN.md - Dashboard home with stats and contacts page with inbox workflow
- [x] 04-06-PLAN.md - Projects CRUD pages (list, create, edit) with drag-to-reorder
- [x] 04-07-PLAN.md - Visual and functional verification

### Phase 5: SEO, AEO & Performance

**Goal**: Search engines and AI assistants can discover, index, and recommend the portfolio site with optimal performance.
**Depends on**: Phase 4
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, ANLYT-01, ANLYT-02, ANLYT-03, PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):

1. Every page has proper title tag, meta description, and Open Graph tags for social sharing
2. Google Search Console shows all pages indexed with semantic HTML structure (h1, h2, landmarks)
3. JSON-LD schema markup (LocalBusiness, Service, Person) validates in Google Rich Results Test
4. Services page includes FAQ section with speakable markup for AI assistant discoverability
5. llms.txt file generates via next-aeo for ChatGPT/Perplexity/Google AI Overviews discovery
6. Dynamic sitemap.xml exists and includes all public pages
7. Google Analytics 4 tracks page views and Calendly conversions with UTM parameters
8. Lighthouse audit shows performance score > 90 on mobile and desktop
9. Page load completes in under 3 seconds on standard connection
10. All images load via Next.js Image component with automatic optimization
11. Site displays correctly on iOS and Android devices without layout breaks
    **Plans**: 6 plans in 4 waves

Plans:

- [x] 05-01-PLAN.md - Install SEO packages and configure root metadata with Open Graph
- [x] 05-02-PLAN.md - Create JSON-LD schema components (LocalBusiness, Person, Service, FAQ)
- [x] 05-03-PLAN.md - Add per-page metadata and audit semantic HTML structure
- [x] 05-04-PLAN.md - Create sitemap.ts, robots.ts, and FAQ section with speakable markup
- [x] 05-05-PLAN.md - Integrate Vercel Analytics, GA4, and UTM tracking for Calendly
- [x] 05-06-PLAN.md - Configure llms.txt generation and final verification checkpoint

### Phase 6: WordPress Delivery System

**Goal**: Jon can deliver $500 WordPress sites profitably with documented processes protecting scope and payment.
**Depends on**: Phase 5
**Requirements**: WPDEL-01, WPDEL-02, WPDEL-03, WPDEL-04, WPDEL-05, WPDEL-06
**Success Criteria** (what must be TRUE):

1. Starter template documentation lists pre-configured theme and essential plugins for 5-day delivery
2. Content workflow documentation guides intake process from client meeting through Claude-assisted drafting to approval
3. Local staging setup instructions enable spinning up new client site in under 30 minutes
4. Handoff checklist covers deployment steps, DNS configuration, and credentials transfer process
5. Payment protection documentation enforces 50% upfront requirement and final payment before launch
6. Scope control template documents included deliverables and change request process to prevent scope creep
   **Plans**: 6 plans in 2 waves

Plans:

- [ ] 06-01-PLAN.md - Starter template guide with Kadence theme and plugin stack
- [ ] 06-02-PLAN.md - Content workflow documentation and client questionnaire
- [ ] 06-03-PLAN.md - Staging setup guide and migration process with Duplicator
- [ ] 06-04-PLAN.md - Scope control template and payment protection documentation
- [ ] 06-05-PLAN.md - Handoff checklist and client training guide template
- [ ] 06-06-PLAN.md - Documentation verification checkpoint

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase                        | Plans Complete | Status      | Completed  |
| ---------------------------- | -------------- | ----------- | ---------- |
| 1. Infrastructure            | 5/5            | Complete    | 2026-02-03 |
| 2. Projects & Home           | 4/4            | Complete    | 2026-02-03 |
| 3. Services & Contact        | 7/7            | Complete    | 2026-02-03 |
| 4. Admin Dashboard           | 7/7            | Complete    | 2026-02-04 |
| 5. SEO, AEO & Performance    | 6/6            | Complete    | 2026-02-04 |
| 6. WordPress Delivery System | 0/6            | Planned     | -          |
