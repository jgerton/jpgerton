# Feature Landscape

**Domain:** Developer Portfolio + Freelance Services Site
**Researched:** 2026-02-03
**Confidence:** HIGH (verified with current sources, dual-audience context)

## Executive Summary

jpgerton.com serves two distinct audiences with different conversion goals:

1. **Local business owners** (WordPress clients) - Need simple pricing, testimonials, booking
2. **Hiring managers/custom clients** - Need technical depth, project showcases, capabilities

The feature set must serve both without confusing either. Research shows 72% of tech hiring managers prioritize portfolios over resumes, while local business clients respond to social proof and clear pricing. The winning approach: shared foundation (projects, testimonials, contact) with audience-specific CTAs and content depth.

## Table Stakes

Features users expect. Missing these means visitors leave immediately.

| Feature                    | Why Expected                                                       | Complexity | Dependencies                  | Notes                                                      |
| -------------------------- | ------------------------------------------------------------------ | ---------- | ----------------------------- | ---------------------------------------------------------- |
| **Live Deployed Projects** | Recruiters spend ~5 minutes per candidate, need proof of real work | Medium     | Hosting, images, descriptions | 3-5 polished projects minimum, not everything you've built |
| **Project Descriptions**   | Context matters - what problem did you solve, how, why?            | Low        | None                          | Include goal, scope, challenges, results for each          |
| **Tech Stack Display**     | Both audiences need to know what you work with                     | Low        | None                          | Per-project + overall skills section                       |
| **Contact Form**           | Primary conversion path for custom work                            | Low        | Email service                 | Keep to 3 fields max (25% conversion vs longer forms)      |
| **Mobile Responsive**      | 32.5% conversion increase with mobile-optimized CTAs               | Medium     | Responsive framework          | Test across devices, all CTAs accessible                   |
| **Fast Load Times**        | 7% conversion loss per second after 3s load                        | Medium     | Image optimization, hosting   | Use Lighthouse for testing                                 |
| **Professional Domain**    | yourname.com is fundamental professionalism signal                 | Low        | Domain registrar              | jpgerton.com already decided                               |
| **Testimonials**           | 86% of buyers use ratings to influence decisions                   | Low        | Client permission             | Photos, names, designations increase credibility           |
| **GitHub Integration**     | Demonstrates actual code, standard expectation for developers      | Low        | GitHub API or links           | Link to profile + individual project repos                 |
| **Clear Navigation**       | Single-page or multi, must be intuitive                            | Low        | None                          | Keep it simple, don't bury contact info                    |
| **About/Bio Section**      | Visitors want to know who they're hiring                           | Low        | None                          | Brief, relevant to audience segment                        |
| **Services List**          | Local business clients need to know what you offer                 | Low        | None                          | Specific to $500 WordPress package for that audience       |

## Differentiators

Features that set your site apart. Not expected, but highly valued when present.

| Feature                                  | Value Proposition                                                       | Complexity | Dependencies                      | Notes                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------- | ---------- | --------------------------------- | ---------------------------------------------------------- |
| **Dual-Audience Smart Routing**          | Avoid confusion - guide visitors to relevant content based on intent    | Medium     | Admin dashboard, content flags    | "Need a WordPress site?" vs "Custom development?" CTAs     |
| **Calendly Integration**                 | Eliminates scheduling friction, 121% more conversions than generic CTAs | Low        | Calendly account, UTM tracking    | Embedded for $500 WordPress clients specifically           |
| **Admin Dashboard (Content Management)** | Update projects, testimonials, services without code deployment         | High       | Convex integration, auth          | Already decided for this project                           |
| **Case Study Format**                    | Deeper storytelling beyond project cards                                | Medium     | Time to write, images             | Metrics, before/after, client quotes                       |
| **Video Demos/Walkthroughs**             | Show personality, explain complex projects                              | Medium     | Video hosting, recording          | Optional but high engagement                               |
| **Pricing Transparency**                 | $500 WordPress package clearly stated builds trust                      | Low        | None                              | Local business clients expect this (freelance avg $1k-$5k) |
| **Dark/Light Mode Toggle**               | Modern UX expectation for dev portfolios                                | Low        | CSS variables, localStorage       | Common in 2026 portfolios                                  |
| **Interactive Elements**                 | Custom animations, 3D components demonstrate skills                     | High       | Animation libraries, perf testing | Don't sacrifice page speed (7%/sec loss)                   |
| **Blog/Articles**                        | Demonstrates expertise, SEO benefits                                    | Medium     | CMS, writing time                 | Defer to post-MVP unless critical                          |
| **Service Packages**                     | Tiered options (low/medium/high commitment) increase conversions        | Low        | Pricing research                  | $500 WP site (low), custom quote (high)                    |
| **Google Reviews Display**               | 86% of local business buyers trust Google reviews                       | Low        | Google My Business API            | Specific to local business audience                        |
| **Email Newsletter Signup**              | Low-commitment CTA for not-yet-ready visitors                           | Low        | Email service integration         | Medium conversion option                                   |
| **UTM Tracking & Analytics**             | Know which campaigns/sources bring bookings                             | Low        | Google Analytics, UTM parameters  | Track Calendly conversions                                 |
| **Before/After Showcases**               | Visual proof of transformation for local business clients               | Low        | Client permission, screenshots    | Powerful for WordPress package marketing                   |
| **Live Chat**                            | Immediate engagement, but high maintenance                              | Medium     | Chat service subscription         | Consider async contact form first                          |

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature                           | Why Avoid                                                | What to Do Instead                                                  |
| -------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| **Every Project You've Ever Built**    | Dilutes portfolio, overwhelms visitors                   | Curate 3-5 best, most relevant projects (quality over quantity)     |
| **Outdated Projects**                  | Signals you're not current with technology               | Review annually, remove projects older than 2-3 years               |
| **Overly Complex Navigation**          | Frustrates users, they leave                             | Single-page or simple multi-page, make contact obvious              |
| **Excessive Animations/Sound Effects** | Distracts from work, frustrates users, hurts performance | Subtle interactions only, no auto-playing media                     |
| **Template-Only Design**               | "Bootstrap only" signals you can't write custom code     | Show custom code abilities, use frameworks as foundation not crutch |
| **Broken Links**                       | Immediate credibility killer                             | Test all project links before launch, regular audits                |
| **Generic "Learn More" CTAs**          | 42% lower click-through than specific CTAs               | "Book Your $500 WordPress Site" vs "Learn More"                     |
| **Long Contact Forms**                 | Each field reduces completion rate                       | 3 fields maximum (name, email, message)                             |
| **Unclear Target Audience**            | Generic portfolios appeal to no one                      | Dual-audience routing, specific CTAs per segment                    |
| **Missing Context on Projects**        | "What I built" without "why" or "how"                    | Include problem, approach, results for each                         |
| **Social Media Feed Embedding**        | Distracting, performance hit, maintenance burden         | Link to profiles, don't embed live feeds                            |
| **PDF Resume Download**                | Necessary evil, but don't make it primary CTA            | Offer it, but emphasize live projects and contact form              |
| **Auto-Playing Videos**                | Annoying, accessibility issue, performance cost          | Click-to-play only                                                  |
| **"Under Construction" Sections**      | Unprofessional, incomplete feeling                       | Launch complete sections only, add features later                   |
| **Complex Blog/CMS from Start**        | Scope creep, delays launch                               | Defer blog to post-MVP unless writing is core service               |
| **Custom Booking System**              | Reinventing wheel, maintenance burden                    | Use Calendly or similar (proven, tracked, integrated)               |

## Feature Dependencies

```
FOUNDATION (Launch blockers):
├── Live Projects (3-5 minimum)
│   ├── Deployed & working
│   ├── Descriptions with context
│   └── Tech stack listed
├── Contact Form (3 fields max)
├── Mobile Responsive Design
└── Fast Performance (< 3s load)

CONVERSION LAYER (Post-foundation):
├── Testimonials (3-5 minimum)
│   └── Photos + names + roles
├── Calendly Integration
│   └── UTM tracking configured
├── Clear CTAs
│   ├── "Book $500 WordPress Site"
│   └── "Discuss Custom Project"
└── Pricing Display ($500 package)

DIFFERENTIATION (Post-MVP):
├── Admin Dashboard (already planned)
│   └── Requires: Convex + auth + UI
├── Dual-Audience Routing
│   └── Requires: Admin dashboard
├── Case Studies
│   └── Requires: Client permission + time
├── Google Reviews
│   └── Requires: Google My Business account
└── Analytics & Tracking
    └── Requires: GA4 + UTM setup

DEFERRED (Nice to have):
├── Blog/Articles
├── Video Demos
├── Dark Mode
├── Newsletter
└── Live Chat
```

## Audience-Specific Feature Mapping

### Local Business Owners ($500 WordPress Clients)

**High Priority:**

- Clear $500 pricing display
- Calendly booking CTA (prominent)
- Testimonials from local businesses
- Before/after WordPress site showcases
- Google Reviews integration
- Simple contact form (backup to Calendly)
- "What you get" package details

**Low Priority:**

- Technical depth on projects
- GitHub links
- Resume/PDF download
- Blog/articles

### Hiring Managers / Custom Project Clients

**High Priority:**

- Live deployed projects (3-5)
- Technical descriptions (stack, challenges, solutions)
- GitHub integration
- Case studies with metrics
- Skills/tech stack showcase
- Contact form for custom inquiries
- Resume/LinkedIn links

**Low Priority:**

- $500 WordPress pricing (may confuse or undersell)
- Calendly for immediate booking (custom work needs scoping)
- Package details

**Shared Features:**

- Professional design
- Fast performance
- Mobile responsive
- Testimonials
- About/bio
- Clear navigation

## MVP Recommendation

For MVP (launch-ready), prioritize:

### Phase 1: Foundation (Weeks 1-2)

1. **3 Best Projects** - Deployed, described, with tech stacks
2. **Contact Form** - 3 fields, email integration
3. **Mobile Responsive** - Test across devices
4. **Fast Performance** - Image optimization, Lighthouse score > 90

### Phase 2: Conversion (Weeks 3-4)

5. **3-5 Testimonials** - With photos, names, roles
6. **Dual CTAs** - "Book $500 Site" + "Custom Work" routing
7. **$500 Package Details** - What's included, clear pricing
8. **Calendly Embed** - For WordPress client bookings only

### Phase 3: Differentiation (Weeks 5-6)

9. **Admin Dashboard** - For updating projects/testimonials
10. **GitHub Integration** - Links to repos
11. **UTM Tracking** - Know what's converting

### Defer to Post-MVP:

- **Blog/Articles** - Time-consuming, not launch-critical
- **Video Demos** - Nice to have, production effort
- **Google Reviews** - Need existing GMB presence
- **Case Studies** - Deeper than project cards, can evolve from launch projects
- **Dark Mode** - Polish, not conversion driver
- **Newsletter** - Marketing channel, not launch requirement
- **Before/After Showcases** - Need client permission, can add iteratively

## Complexity Analysis

| Complexity | Features                                                                                                                                                                                                    | Est. Effort     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **Low**    | Contact form, testimonials, pricing display, nav, about, services list, GitHub links, CTAs, dark mode toggle, newsletter signup, email list, UTM params                                                     | 1-3 days total  |
| **Medium** | Project showcases, mobile responsive, performance optimization, Calendly integration, case studies, video hosting, dual-audience routing, admin dashboard UI, analytics setup, Google reviews, before/after | 1-2 weeks total |
| **High**   | Admin dashboard (full), interactive elements, live chat, custom animations                                                                                                                                  | 2-4 weeks total |

## Quality Gates

Before launching each feature:

- [ ] **Mobile tested** - Works on iOS and Android
- [ ] **Performance tested** - Lighthouse score maintained
- [ ] **Links verified** - All CTAs, projects, GitHub links work
- [ ] **Analytics configured** - Can track conversions
- [ ] **Cross-browser tested** - Chrome, Safari, Firefox minimum
- [ ] **Accessibility checked** - Keyboard nav, screen reader friendly
- [ ] **Content proofread** - No typos, clear language per audience

## Sources

### Table Stakes Research

- [Colorlib: 22 Best Developer Portfolios (Examples) 2026](https://colorlib.com/wp/developer-portfolios/)
- [Elementor: Best Web Developer Portfolio Examples from Top Developers in 2026](https://elementor.com/blog/best-web-developer-portfolio-examples/)
- [Nucamp: Top 10 Full Stack Portfolio Projects for 2026](https://www.nucamp.co/top-10-full-stack-portfolio-projects-for-2026-that-actually-get-you-hired)
- [ApplyBuddy: How to Build a Strong Tech Portfolio in 2026](https://applybuddy.co.uk/how-to-build-a-strong-tech-portfolio-in-2026/)

### Conversion Optimization

- [Sixth City Marketing: 30+ Call-to-Action Statistics for 2026](https://www.sixthcitymarketing.com/call-to-action-stats/)
- [Good Fellas: Small Business Website Must-Haves: 2026 Conversion Checklist](https://www.goodfellastech.com/blog/small-business-website-must-haves-2026-conversion-checklist)
- [WebFX: 5 Examples of Websites That Convert in 2026](https://www.webfx.com/blog/web-design/examples-of-websites-that-convert/)

### Freelance Services

- [Rapyd Cloud: Unlock Your WordPress Freelancing Potential](https://rapyd.cloud/blog/wordpress-freelance-success-guide/)
- [Pressable: WordPress Freelancing: The Ultimate Guide](https://pressable.com/blog/a-complete-guide-to-starting-your-wordpress-freelance-business/)
- [Prismic: How much should you charge for a website in 2026?](https://prismic.io/blog/how-much-should-you-charge-for-a-website)

### Anti-Features & Mistakes

- [Dev Portfolio Templates: 5 Mistakes Developers Make](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [LinkedIn: How to Avoid Common Web Developer Portfolio Mistakes](https://www.linkedin.com/advice/0/what-most-important-things-avoid-your-web-developer-lk51e)
- [DEV Community: What I learned after reviewing over 40 developer portfolios](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7)

### Technical Implementation

- [WeWeb: Admin Dashboard: Ultimate Guide, Templates & Examples (2026)](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples)
- [Webflow: Integrate Calendly with Webflow](https://webflow.com/integrations/calendly)
- [Able CDP: Calendly Conversion Tracking And Attribution](https://www.ablecdp.com/integration-setup/calendly)
