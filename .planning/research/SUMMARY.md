# Project Research Summary

**Project:** jpgerton.com
**Domain:** Developer Portfolio + $500 WordPress Service Business
**Researched:** 2026-02-03
**Confidence:** HIGH

## Executive Summary

jpgerton.com is a dual-purpose platform serving two distinct audiences: local business owners seeking affordable WordPress sites ($500 package) and hiring managers/custom clients looking for technical expertise. The winning approach combines Next.js 14 with Convex backend for the portfolio site, delivering optimal SEO performance through server-first rendering while maintaining admin flexibility through reactive client components. Research shows 72% of tech hiring managers prioritize portfolios over resumes, while local business clients respond to clear pricing and social proof, making audience-specific CTAs and content depth critical to conversion.

The recommended build order prioritizes foundation over features: ship a minimal portfolio with 5-6 projects, services page, and Calendly integration first (Phase 1), then establish WordPress delivery infrastructure with starter template and documented workflows before taking first client (Phase 2), and finally layer admin dashboard and differentiation features (Phase 3+). This sequence avoids the critical pitfall of over-engineering at day zero, while ensuring payment protection and scope control processes are in place before revenue operations begin.

Key risks include scope creep on fixed-price WordPress projects (mitigate with 50% upfront deposit requirement and documented change control process), mobile-first design failures (test on actual devices, target 90+ Lighthouse mobile score), and unclear CTAs that bury conversion paths (use service-specific "Book Your $500 Site Call" instead of generic "Contact Me"). The stack choices emphasize proven stability (Next.js 14, React 18, Tailwind 3) over bleeding-edge adoption, with clear upgrade paths documented when ecosystem maturity warrants migration.

## Key Findings

### Recommended Stack

The research strongly recommends Next.js 14 App Router with Convex backend as the optimal balance of developer experience, performance, and scalability. This combination eliminates traditional API layer complexity while providing end-to-end type safety and real-time reactivity where needed. For WordPress delivery, Local by WP provides the fastest local development setup for solo freelancers, with Elementor Pro + Gutenberg hybrid approach balancing design flexibility against performance for $500 client sites.

**Core technologies:**

- **Next.js 14 + React 18:** App Router provides stable RSC support, excellent DX, Vercel deployment integration. Defer Next.js 15 / React 19 upgrade until features are needed.
- **Convex:** Backend-as-a-Service with real-time reactivity, end-to-end type safety, built-in auth integration. Eliminates need for separate database + ORM + API layer setup.
- **Tailwind CSS 3.4.x:** Industry standard utility-first CSS. Stick with v3 for broader browser compatibility (v4 requires Safari 16.4+, Chrome 111+, Firefox 128+).
- **shadcn/ui:** Radix UI primitives with Tailwind styling. Copy-paste architecture avoids package bloat, 1000+ components available with excellent dark mode support.
- **React Hook Form + Zod:** Current ecosystem standard for form handling. Minimal re-renders, type-safe validation shared between client and server.
- **next-aeo:** Generates llms.txt file for AI discoverability (ChatGPT, Perplexity, Google AI Overviews). Critical for 2026 as Gartner predicts 25% search volume shift to AI by 2026.
- **Local by WP:** Best local WordPress environment for solo developers. Fast setup, native SSL, GUI management. Each site gets isolated container.
- **Elementor Pro + Gutenberg:** Hybrid approach balances speed (Gutenberg for content) with client expectations (Elementor for custom landing pages).

### Expected Features

Research shows distinct feature priorities for the dual-audience model. Local business clients prioritize clear pricing, booking friction reduction, and social proof, while hiring managers need technical depth, live projects, and GitHub integration. The shared foundation requires mobile responsiveness, fast load times (< 3s), and professional domain.

**Must have (table stakes):**

- **Live deployed projects (3-5 minimum):** Recruiters spend ~5 minutes per candidate, need proof of real work with context (problem, approach, results).
- **Contact form (3 fields max):** Primary conversion path. Each additional field reduces completion rate. 25% conversion advantage vs longer forms.
- **Mobile responsive design:** 32.5% conversion increase with mobile-optimized CTAs. Google mobile-first indexing penalizes non-responsive sites.
- **Fast performance (< 3s load):** 7% conversion loss per second after 3s load time. Use Lighthouse for testing, target 90+ scores.
- **Testimonials (3-5 with photos):** 86% of buyers use ratings to influence decisions. Photos, names, designations increase credibility.
- **Clear CTAs per audience:** Service-specific "Book Your $500 WordPress Site" vs "Discuss Custom Project" instead of generic "Learn More".
- **$500 package pricing display:** Pricing transparency builds trust with local business clients. Clear "what you get" details.

**Should have (competitive):**

- **Dual-audience smart routing:** Avoid confusion by guiding visitors to relevant content. "Need a WordPress site?" vs "Custom development?" CTAs.
- **Calendly integration:** Eliminates scheduling friction, 121% more conversions than generic CTAs. UTM tracking for conversion attribution.
- **Admin dashboard (content management):** Update projects, testimonials, services without code deployment. Already decided for this project.
- **Case study format:** Deeper storytelling beyond project cards. Include metrics, before/after, client quotes.
- **Before/after showcases:** Visual proof of transformation for local business clients. Powerful for WordPress package marketing.
- **Dark/light mode toggle:** Modern UX expectation for developer portfolios. Use next-themes with shadcn/ui patterns.

**Defer (v2+):**

- **Blog/articles:** Medium conversion benefit, high maintenance burden. Defer until 5+ clients request content marketing.
- **Video demos/walkthroughs:** High engagement but significant production effort. Not launch-critical.
- **Live chat:** Immediate engagement but high maintenance. Start with async contact form and Calendly.
- **Email newsletter:** Low-commitment CTA for not-yet-ready visitors. Marketing channel, not launch requirement.

### Architecture Approach

Modern Next.js 14 + Convex applications follow strict separation of concerns where backend logic lives in `convex/` folder and frontend code lives in `app/`. The architecture emphasizes server-first rendering with client components for reactive features, unified through provider-based pattern maintaining persistent WebSocket connection for real-time data synchronization. For this portfolio site with admin dashboard, public pages render as Server Components for optimal SEO and performance, while admin dashboard uses Client Components for reactive CRUD operations, with shared data layer in Convex providing type-safe queries and mutations.

**Major components:**

1. **Next.js Frontend Layer:** Public pages (Server Components) for marketing/portfolio content, Admin pages (Client Components) for CRUD interface, ConvexClientProvider establishing WebSocket connection, middleware.ts protecting admin routes.
2. **Convex Backend Layer:** schema.ts defining data model (projects, contactSubmissions, users tables), queries/ folder for read operations with indexed queries, mutations/ folder for write operations with validation, auth.ts for authentication configuration.
3. **Data Flow Patterns:** Public pages use preloadQuery for server-side rendering with optimal SEO, Admin dashboard uses useQuery hooks for reactive subscriptions via WebSocket, Contact forms use useMutation for validated writes with automatic retry.

**Key patterns to follow:**

- **Provider wrapping:** Wrap app with ConvexClientProvider once in layout, available throughout component tree.
- **Index-based queries:** Use `.withIndex()` instead of `.filter()` for orders of magnitude better performance.
- **Optimistic updates:** Update UI immediately for CRUD operations, sync with backend, automatic rollback on errors.
- **Server/client boundary respect:** Use Server Components for static content, add `"use client"` only where interactivity needed.

### Critical Pitfalls

Research identified 18 distinct pitfalls across three severity levels. The most critical directly impact revenue and client satisfaction, while moderate pitfalls create technical debt or delays. Top 5 by severity and phase timing:

1. **No clear CTA or buried contact information:** 70% of small business websites lack clear CTAs. Portfolio sites bury contact info, turn footers into social media dumps instead of conversion-focused CTAs. Add one primary CTA per page matching customer journey stage, include urgency ("Currently booking projects for Q2 2026"). Address in Phase 1 (Core Site).

2. **No payment protection (no upfront deposit):** Starting work without 50% upfront payment leads to non-payment, scope creep without compensation, cash flow problems preventing scaling. ALWAYS require 50% upfront before starting (industry standard for sub-$5K projects), hold deployment credentials until final payment clears. Address in Phase 2 (WordPress Delivery) before first client.

3. **Scope creep without change control process:** Fixed-price projects balloon from 5 pages to 12+ pages with custom features, turning $500 profitable project into hourly loss. Document every deliverable in writing upfront, include "scope creep clause" in contract, use change request template for additions. Address in Phase 2 (WordPress Delivery).

4. **Mobile-last design in mobile-first world:** Sites look great on desktop but break on mobile where most traffic occurs. Google mobile-first indexing penalizes sites, 50%+ visitors bounce on bad mobile experience. Use mobile-first CSS approach, test on actual devices not just browser dev tools, target 90+ Lighthouse mobile score. Address in Phase 1 (Core Site) and Phase 2 (WordPress template).

5. **Over-engineering portfolio at day 0:** Spending months building complex blog systems or elaborate animations instead of shipping simple portfolio that gets clients. Ship 5 projects + services page + Calendly first, validate conversion before adding features. Address in Phase 1 (Core Site) with explicit scope limits.

**Additional critical pitfalls:**

- **Including every project you've ever built:** Dilutes strengths, signals scattered focus. Show 6-8 best projects maximum with live URLs and recent tech.
- **JavaScript rendering breaks SEO:** Use Next.js App Router with RSC for content pages, verify robots.txt doesn't block /static or /js folders, test with Google Search Console.
- **Missing structured data for AEO:** Use schema.org types (LocalBusiness, Service, FAQPage, Person) with JSON-LD on every page, validate with Google Rich Results Test.
- **No WordPress starter template:** Starting from scratch kills profitability. Build template with pre-configured theme, essential plugins, baseline pages before first client.
- **Keyword stuffing vs entity-based content:** Old SEO tactics hurt AEO. Focus on entity-based optimization (what, who, where), structure with headers, get to point quickly.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation (Core Portfolio Site)

**Rationale:** Ship viewable portfolio site before building delivery infrastructure. Public site can launch before admin, validates architecture, generates leads while building client systems. Everything depends on data layer and provider setup.

**Delivers:**

- Next.js 14 + Convex setup with schema (projects, contactSubmissions tables)
- 5-6 best projects (live deployed, described, tech stacks visible)
- Services page with clear $500 WordPress package details
- Contact form (3 fields) and Calendly integration
- Mobile responsive design tested on actual devices
- Fast performance (Lighthouse 90+ scores)
- AEO treatment (JSON-LD schema, next-aeo for llms.txt)

**Addresses features:**

- Table stakes: Live projects, contact form, mobile responsive, fast performance
- Differentiators: Dual-audience CTAs, pricing transparency, dark mode toggle

**Avoids pitfalls:**

- Over-engineering (strict scope limit: no blog, no complex animations)
- No clear CTA (service-specific "Book Your $500 Site Call" on every page)
- Mobile-last design (mobile-first CSS, device testing)
- JavaScript SEO breaks (App Router RSC, verify crawlability)
- Portfolio as a project (content strategy excludes self-referential work)

**Research flag:** Standard patterns for Next.js + Convex portfolio sites. Skip research-phase, follow official docs.

---

### Phase 2: WordPress Delivery System

**Rationale:** Establish WordPress infrastructure with payment protection and scope control BEFORE taking first client. Authentication blocks admin features but doesn't block public launch, so can develop in parallel with Phase 1. Must document processes before revenue operations begin to avoid scope creep and payment disasters.

**Delivers:**

- Local by WP environment setup with WP-CLI
- WordPress starter template (pre-configured theme, essential plugins, baseline pages)
- Elementor Pro + Gutenberg workflow documentation
- Payment terms template (50% upfront requirement, non-refundable deposit clause)
- Scope documentation template (deliverables checklist, change request process)
- Content intake form (services, hours, about text, photos with deadlines)
- Client handoff checklist (training call, documentation, support boundaries)
- Pre-launch testing checklist (mobile, performance, links verification)
- Convex Auth setup for admin access
- Next.js middleware protecting /admin/\* routes

**Addresses features:**

- Table stakes: Services list (WordPress package specifics)
- Differentiators: Service packages (tiered options)

**Avoids pitfalls:**

- No payment protection (50% upfront template created before first client)
- Scope creep (documented deliverables + change control process)
- No starter template (pre-built foundation reduces 5-day project to 2 days)
- Missing handoff docs (checklist + training call + support boundaries)
- No content workflow (intake form with deadlines prevents delays)

**Research flag:** Standard WordPress freelance patterns. May need research-phase for specific hosting/deployment automation if scaling beyond manual process.

---

### Phase 3: Admin Dashboard & Differentiation

**Rationale:** Admin requires auth and data layer established in earlier phases. Delivers full content management functionality, enabling updates without code deployments. Differentiation features layer on top of validated foundation after first clients close.

**Delivers:**

- Admin dashboard home (recent activity, quick stats)
- Projects CRUD (list view with useQuery, create/edit forms, delete confirmation, drag-to-reorder)
- Contact submissions manager (list with filters, status updates, search)
- Testimonials CRUD (for adding client feedback post-project)
- GitHub integration (automatic repo links on project cards)
- UTM tracking setup (know which campaigns drive bookings)
- Analytics configuration (Google Analytics 4, conversion tracking)

**Addresses features:**

- Differentiators: Admin dashboard (content management), GitHub integration, UTM tracking

**Avoids pitfalls:**

- Client components for static content (admin only, public pages stay Server Components)
- Outdated portfolio content (admin enables quarterly updates without deployments)

**Research flag:** Standard Convex CRUD patterns. Skip research-phase, follow Convex best practices docs and official examples.

---

### Phase 4: Advanced Features (Post-MVP)

**Rationale:** Only build after validating conversion with 5+ clients. These are competitive differentiators, not launch requirements. Blog/content features deferred until clients specifically request content marketing.

**Delivers:**

- Case studies (deeper format than project cards, with metrics and client quotes)
- Before/after showcases (visual transformation proof for WordPress clients)
- Google Reviews integration (display for local business social proof)
- Blog/articles system (if clients request content marketing)
- Video demos (if budget allows production)
- Email newsletter (low-commitment CTA for nurture campaigns)

**Addresses features:**

- Differentiators: Case studies, before/after showcases, Google Reviews, blog/articles

**Avoids pitfalls:**

- Treating blog as required for launch (deferred until validated need)
- Feature bloat before validation (build only after 5+ clients request)

**Research flag:** Likely needs research-phase for Google My Business API integration (moderate complexity, specific to local business use case). Blog/newsletter tools well-documented, skip research.

---

### Phase Ordering Rationale

**Dependency-driven sequence:**

- Phase 1 establishes data layer (Convex schema) and provider setup that everything else depends on
- Phase 2 requires auth from Phase 1 but develops in parallel (doesn't block public launch)
- Phase 3 requires both schema (Phase 1) and auth (Phase 2) to function
- Phase 4 requires validated business model (5+ clients) before investment

**Risk mitigation priority:**

- Phase 1 addresses revenue-critical pitfalls (no clear CTA, mobile-last, over-engineering)
- Phase 2 addresses financial pitfalls (no payment protection, scope creep) before first client engagement
- Phase 3 enables operational efficiency after foundation is solid
- Phase 4 deferred until conversion validated, avoiding premature optimization

**Architecture-informed grouping:**

- Phase 1 groups Server Component patterns (public pages) + minimal Client Components (contact form)
- Phase 2 separates WordPress concerns from Next.js concerns (different technology stacks)
- Phase 3 groups Client Component patterns (admin dashboard) using reactive Convex hooks
- Phase 4 groups content/marketing features separate from core business operations

**Speed to revenue:**

- Phase 1 ships in 2 weeks, enables lead generation immediately
- Phase 2 completes before first client engagement (1-2 weeks parallel with Phase 1)
- First revenue possible within 3-4 weeks of project start
- Phases 3-4 enhance operations but don't block revenue

### Research Flags

**Phases needing deeper research during planning:**

- **Phase 4 (Google My Business API):** Moderate complexity for reviews integration, specific authentication flows, rate limiting considerations. Recommend `/gsd:research-phase` when prioritized.

**Phases with standard patterns (skip research-phase):**

- **Phase 1 (Next.js + Convex portfolio):** Well-documented in official docs, established patterns, multiple examples available. Follow Convex Next.js App Router integration guide.
- **Phase 2 (WordPress delivery):** Mature ecosystem, standard freelance workflows documented across multiple sources. Local by WP and Elementor Pro have extensive documentation.
- **Phase 3 (Admin dashboard):** Convex CRUD patterns are core use case with official examples. Standard React Hook Form patterns well-documented.

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                                                                                      |
| ------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH        | Verified with official Next.js, Convex, Tailwind documentation. Version numbers verified with ecosystem sources dated 2025-2026.                           |
| Features     | HIGH        | Validated with 2026 research on portfolio conversion, freelance WordPress business models, dual-audience patterns. Clear consensus across sources.         |
| Architecture | HIGH        | Official Convex + Next.js App Router patterns documented with code examples. Server/client component boundaries well-established.                          |
| Pitfalls     | MEDIUM-HIGH | Verified with multiple 2025-2026 sources on portfolio mistakes, WordPress freelance pitfalls, Next.js SEO issues. Some inference on phase-specific timing. |

**Overall confidence:** HIGH

Research conducted with current 2026 sources, verified across official documentation and ecosystem consensus. Version-specific recommendations (Tailwind 3 vs 4, Next.js 14 vs 15) based on browser compatibility data and stability assessments. AEO patterns represent emerging standard with medium confidence (rapidly evolving ecosystem but clear direction).

### Gaps to Address

**1. Exact first client timeline:** Research provides workflows and checklists but doesn't specify how long typical WordPress project takes with template. Recommend tracking first 2-3 client projects to establish baseline delivery timeline and refine 5-day estimate.

**2. Calendly conversion tracking setup:** Research confirms Calendly provides 121% conversion boost and supports UTM tracking, but specific implementation steps for event tracking and CRM integration not detailed. Validate during Phase 1 implementation with Calendly documentation.

**3. Hosting provider selection for clients:** Research recommends Hostinger, Bluehost, IONOS with 2026 pricing, but doesn't specify migration workflows or deployment automation approaches. Recommend manual SFTP deployment for first 3 clients, then evaluate WP-CLI or Git-based automation based on pain points.

**4. Admin authentication approach:** Stack research confirms Clerk via Convex is recommended, but Architecture and Features research doesn't specify whether multiple admin users or role-based access control needed initially. Recommend single admin (you) for MVP, defer RBAC until team expansion.

**5. Image hosting strategy:** Stack mentions considering Cloudinary/S3 at 10K visitors/month but doesn't specify what to use initially. Recommend Next.js public/ folder for portfolio images (< 50 images), Convex file storage for admin uploads, defer CDN until performance metrics indicate need.

**6. Email service for contact form:** Stack doesn't specify email provider. Recommend Resend (simple API, generous free tier, TypeScript SDK) or native contact form submissions to Convex with email notifications via Convex scheduled functions.

## Sources

### Primary (HIGH confidence)

- **Next.js Documentation:** Framework architecture, App Router patterns, SEO metadata, deployment configuration
- **Convex Developer Hub:** Next.js integration, React client patterns, authentication with Next.js, schema best practices, query optimization
- **shadcn/ui Documentation:** Component patterns, dark mode setup, Tailwind integration
- **Tailwind CSS v4 Release Notes:** Browser compatibility requirements, v3 vs v4 decision factors
- **React Hook Form + Zod Guide 2026:** Current ecosystem standard verification, integration patterns
- **Vercel Environment Variables Docs:** Configuration, limits, deployment best practices

### Secondary (MEDIUM-HIGH confidence)

- **WordPress Local Development Guide 2026 (AWP Agency):** Local by WP vs Docker comparison, solo freelancer workflows
- **Best Page Builders for WordPress 2026 (Belov Digital):** Elementor Pro vs Gutenberg hybrid approach
- **Cheap WordPress Hosting 2026 (Elementor, ThemeIsle):** Hostinger/Bluehost/IONOS pricing and performance verification
- **Developer Portfolio Examples 2026 (Colorlib, Elementor, Nucamp):** Table stakes features, project quantity recommendations
- **CTA Statistics for 2026 (Sixth City Marketing):** Conversion data, mobile optimization impact
- **Small Business Website Conversion Checklist 2026 (Good Fellas):** Performance thresholds, form field optimization
- **5 Mistakes Developers Make in Portfolio Websites (Dev Portfolio Templates):** Anti-patterns verification
- **Managing Scope Creep WordPress Projects (Elicus, Delicious Brains):** Change control processes, documentation templates
- **WordPress Payment Schedules Guide (Contra, Solowise):** Upfront deposit standards, contract clauses
- **JavaScript SEO In 2026 (Zumeirah, Focus Reactive):** Next.js SSR verification, common pitfalls
- **AEO Complete Guide 2026 (Code Elevate, RevvGrowth):** Entity-based optimization, structured data requirements

### Tertiary (MEDIUM confidence, validate during implementation)

- **next-aeo Introduction (TryProfound):** Emerging tool, limited production data but clear use case
- **AEO Trends 2026 (HubSpot):** Gartner prediction of 25% search volume shift to AI by 2026
- **Relationship Structures in Convex (Stack.convex.dev):** Community patterns, schema design considerations
- **WordPress Multisite vs Single Site (InstaWP):** Anti-pattern documentation, migration horror stories

---

_Research completed: 2026-02-03_

_Ready for roadmap: YES_

**Next step:** Proceed to requirements definition and detailed roadmap creation. All four research dimensions (stack, features, architecture, pitfalls) completed with high confidence. Phase structure provides clear starting point for roadmap with explicit research flags for advanced features.
