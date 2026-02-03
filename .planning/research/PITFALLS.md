# Domain Pitfalls

**Domain:** Developer Portfolio + $500 WordPress Service Business
**Researched:** 2026-02-03
**Confidence:** MEDIUM (verified with multiple 2025-2026 sources)

## Critical Pitfalls

Mistakes that cause rewrites, lost revenue, or major client issues.

### Pitfall 1: No Clear CTA or Buried Contact Information
**What goes wrong:** 70% of small business websites lack clear CTAs in their digital marketing. Portfolio sites bury contact information, turn footers into social media link dumps instead of conversion-focused CTAs, and create "button festivals" with too many competing calls to action.

**Why it happens:** Developers design to impress rather than to guide. They focus on aesthetic portfolios instead of conversion-focused landing pages.

**Consequences:**
- Qualified leads bounce because they can't figure out how to book a call
- Lost revenue from visitors who would convert with a clear path
- Extended time to first client because marketing site doesn't convert

**Prevention:**
- Add one primary CTA per page ("Book Your $500 Site Call")
- Include contact/booking CTA in footer on every page
- Match CTA to customer journey stage (awareness vs decision)
- Add urgency: "Currently booking projects for Q2 2026" or "Taking on 2 new clients this quarter"

**Detection:**
- Analytics show high bounce rate on Services page
- Time on Contact page is low with no conversions
- Traffic arrives but no Calendly bookings happen

**Phase to address:** Phase 1 (Core Site) - This is foundational to the entire business model.

---

### Pitfall 2: No Payment Protection (No Upfront Deposit)
**What goes wrong:** Starting work without 50% upfront payment leads to non-payment, scope creep without compensation, and cash flow problems that prevent scaling.

**Why it happens:** New freelancers fear losing clients by requiring deposits. They lack confidence in their value proposition.

**Consequences:**
- Complete projects but never receive final payment
- Out-of-pocket expenses for hosting, plugins, or time
- Can't afford to take on new clients while waiting for payment
- Clients treat fixed-price projects like hourly work (endless revisions)

**Prevention:**
- ALWAYS require 50% upfront before starting work (industry standard for sub-$5K projects)
- Include "50% deposit required prior to scheduling service. Balance due upon completion" in every proposal
- Use payment terms: "50% due upon project start, 50% due before site launch"
- Hold deployment credentials until final payment clears
- Use contracts that explicitly state deposit is non-refundable after work begins

**Detection:**
- Client hesitates when you mention payment
- Client wants to "see work first" before paying
- Client proposes "payment upon launch" with no deposit

**Phase to address:** Phase 2 (WordPress Delivery System) - Must be in place before first client.

---

### Pitfall 3: Scope Creep Without Change Control Process
**What goes wrong:** Fixed-price projects balloon from 5-7 pages to 12+ pages with custom features, turning a $500 profitable project into a $200/hour loss.

**Why it happens:**
- Not documenting deliverables in writing upfront
- Saying yes to "small requests" without tracking accumulated impact
- Clients don't understand that changes cost money
- No formal change control process

**Consequences:**
- 5-day project becomes 15-day project at same price
- Hourly rate drops below minimum wage
- Can't take on new clients because underwater on current project
- Burnout and resentment toward client work

**Prevention:**
- Document every feature, plugin, page, and design element in writing before starting
- Include "scope creep clause" in contract: "Any additional requests beyond agreed scope will incur additional costs or revised timeline"
- Use change request template: "That's outside our original scope. I can add it for $X or we can revisit timeline."
- Track all requests in project management tool (Notion, ClickUp)
- Set expectation during sales: "The $500 package includes exactly 5 pages. Additional pages are $75 each."

**Detection:**
- Client sends "quick requests" via text/email multiple times per week
- Project timeline extends beyond 5 days
- You're building features not in the original proposal
- Client says "while you're in there, can you also..."

**Phase to address:** Phase 2 (WordPress Delivery System) - Document scope template and change control process.

---

### Pitfall 4: Mobile-Last Design in Mobile-First World
**What goes wrong:** Sites look great on desktop but break on mobile, where most traffic actually occurs. Non-responsive layouts, small tap targets, poor readability, and broken mobile experiences tank SEO rankings and conversions.

**Why it happens:** Developers build and test on desktop, treat mobile as an afterthought, and fail to test on actual devices.

**Consequences:**
- Google mobile-first indexing penalizes sites in search rankings
- 50%+ of visitors bounce immediately on mobile
- Client complaints after launch about "site not working"
- Lost revenue from mobile traffic that can't convert

**Prevention:**
- Use mobile-first CSS approach (build mobile, enhance for desktop)
- Test on actual devices, not just browser dev tools
- Use responsive themes/templates with proven mobile track record
- Verify tap targets are minimum 44x44px
- Check Lighthouse mobile score before launch (target 90+)
- Include mobile testing in pre-launch checklist

**Detection:**
- Lighthouse mobile performance score below 80
- Google Search Console shows mobile usability errors
- Bounce rate on mobile traffic significantly higher than desktop
- Form submission rate on mobile is near zero

**Phase to address:** Phase 2 (WordPress Delivery System) - Include in starter template and launch checklist.

---

### Pitfall 5: Over-Engineering the Portfolio Site at Day 0
**What goes wrong:** Spending months building complex blog systems, custom CMS features, or elaborate animations instead of shipping a simple portfolio that gets clients.

**Why it happens:** Developer mindset - "I can build that better myself." Fear of shipping something simple. Perfectionism.

**Consequences:**
- 6 months of development with no revenue
- Delayed market entry means competitors capture available clients
- Feature bloat that doesn't improve conversion
- Maintenance burden for features that don't matter

**Prevention:**
- Validate manually before automating (user quote from AI docs)
- Ship 5 projects + services page + Calendly, then iterate
- Defer blog until you have clients requesting content
- Use Convex queries directly, add complex caching only when needed
- "What's the simplest version that would work?" before building anything

**Detection:**
- You've been building for 2+ months without launching
- Feature list keeps growing
- You're researching edge cases instead of shipping
- No one has seen your site yet

**Phase to address:** Phase 1 (Core Site) - Explicit scope limit prevents this.

---

### Pitfall 6: Including Every Project You've Ever Built
**What goes wrong:** Portfolio shows 20+ projects including tutorials, outdated tech, and unfinished experiments. This dilutes your strengths and makes you look scattered instead of focused.

**Why it happens:** Fear of not having "enough" work to show. Thinking more = better.

**Consequences:**
- Visitors overwhelmed, can't identify your specialty
- Outdated projects make you look behind on current tech
- Tutorial projects signal junior developer
- No clear narrative about what you're good at

**Prevention:**
- Show 6-8 best projects maximum
- Include only projects with live URLs and recent tech
- Remove tutorial projects, clones, or half-finished work
- Each project needs clear role description and tech stack
- Focus on projects relevant to target client (local business WordPress sites)

**Detection:**
- Project list includes "Portfolio site" as a project
- Projects from 3+ years ago with deprecated tech
- Multiple similar tutorial projects (todo apps)
- No working links for several projects

**Phase to address:** Phase 1 (Core Site) - Content strategy document should specify 6 projects max.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or missed opportunities.

### Pitfall 7: JavaScript Rendering Breaks SEO
**What goes wrong:** Next.js sites that rely on client-side rendering for critical content give search engines empty markup. Lazy loading acts as SEO barrier, robots.txt blocks JavaScript resources, and pre-rendering breaks when depending on browser objects like `window`.

**Why it happens:**
- Copying patterns from SPA tutorials without understanding SSR
- Not testing how Googlebot sees the site
- Legacy robots.txt from old projects

**Prevention:**
- Use Next.js App Router with RSC (React Server Components) for content-heavy pages
- Verify robots.txt doesn't block /static or /js folders (Googlebot renders JavaScript now)
- Test with Google Search Console URL Inspection tool
- Avoid `window` or `document` access outside useEffect/client components
- Use next/image for optimized image loading with proper SSR

**Detection:**
- Google Search Console shows indexing issues
- "View Source" shows minimal HTML content
- Lighthouse SEO score flags missing content in initial render

**Phase to address:** Phase 1 (Core Site) - Architecture decision, catch during initial build.

---

### Pitfall 8: Missing or Incorrect Structured Data for AEO
**What goes wrong:** Sites lack JSON-LD schema markup, use generic schema instead of specific types, or implement schema incorrectly. This prevents AI search engines from understanding and citing your content.

**Why it happens:**
- SEO treated as afterthought
- Unfamiliarity with schema.org vocabulary
- Copying incomplete schema examples

**Consequences:**
- Content not cited in AI search results (ChatGPT, Perplexity, Gemini)
- Missing rich snippets in Google search
- Competitors with proper markup get featured instead
- Lost visibility in "answer engine" queries

**Prevention:**
- Use schema.org types: LocalBusiness, Service, FAQPage, Person
- Include JSON-LD in every page (not just homepage)
- Add FAQ schema for services page with common questions
- Validate with Google Rich Results Test before launch
- Include publication dates for AEO freshness signals

**Detection:**
- Google Rich Results Test shows no structured data
- Site doesn't appear in featured snippets for relevant queries
- Schema validation tools show errors
- AI search tools don't cite your content when asked about your niche

**Phase to address:** Phase 1 (Core Site) - AEO is explicitly part of requirements.

---

### Pitfall 9: No Client Handoff Documentation
**What goes wrong:** After launching WordPress site, client doesn't know how to update content, can't access admin, doesn't understand what they're responsible for maintaining. This leads to support requests that eat into profit margins.

**Why it happens:**
- Rushing to launch without training
- Assuming "WordPress is easy, they'll figure it out"
- No documented handoff process

**Consequences:**
- Weekly support requests for basic tasks (adding blog posts, changing hours)
- Client frustration and bad reviews
- Unpaid support work reduces hourly rate on fixed project
- Client makes breaking changes requiring paid fixes

**Prevention:**
- Create handoff documentation template (how to update, where credentials are, support resources)
- Schedule 30-minute training call before final payment (record it)
- Provide written guide with screenshots for common tasks
- Set support boundaries: "First 2 weeks covered, then $75/hour for changes"
- Include "what not to touch" section (theme files, plugins)

**Detection:**
- Client emails you asking how to add a page
- Client requests that should take them 5 minutes
- Hosting provider contacts client about issues you could have prevented
- Client accidentally breaks site within first month

**Phase to address:** Phase 2 (WordPress Delivery System) - Handoff checklist is explicitly required.

---

### Pitfall 10: No WordPress Starter Template
**What goes wrong:** Starting from scratch for every $500 site means rebuilding same foundation (theme selection, plugin setup, basic pages) repeatedly. This kills profitability on fixed-price work.

**Why it happens:**
- "Each client is unique" mindset
- Not recognizing patterns across similar projects
- Reinventing the wheel each time

**Consequences:**
- 5-day project could be 2-day project with template
- Inconsistent quality across projects
- Higher chance of missing critical setup steps
- Can't scale beyond 2-3 clients per month

**Prevention:**
- Build WordPress starter template with pre-configured theme and essential plugins
- Include baseline pages (Home, About, Services, Contact)
- Pre-configure SEO plugin, contact form, caching
- Document what's customizable vs fixed in template
- Version control template for improvements

**Detection:**
- Each project starts with "Okay, which theme should I use?"
- You're Googling "best contact form plugin" for the 5th time
- Project days 1-2 always feel the same
- Forgetting steps that should be standard

**Phase to address:** Phase 2 (WordPress Delivery System) - Starter template is explicitly required.

---

### Pitfall 11: Keyword Stuffing Instead of Entity-Based Content for AEO
**What goes wrong:** Cramming "Anchorage landscaping" 50 times into page copy or using AI-generated fluff content. This hurts AEO because AI engines see through keyword stuffing instantly.

**Why it happens:**
- Old SEO tactics from 2015
- Misunderstanding how AI search works
- Using AI writing tools without editing

**Consequences:**
- Content reads unnaturally, hurts user experience
- AI search engines skip over thin content
- Clients see unprofessional copy, question your expertise
- Content doesn't get cited by answer engines

**Prevention:**
- Focus on entity-based optimization (what you do, who you serve, where you operate)
- Write descriptive, clear content instead of keyword-focused
- Structure content with headers, bullet points, short paragraphs
- Get to the point quickly (first 160 characters matter)
- Always include dates on published content (AEO freshness signal)
- Use actual examples and specific details over generic descriptions

**Detection:**
- Copy includes phrases like "the best Anchorage landscaping services for landscaping in Anchorage"
- Walls of text with no structure
- AI detection tools flag content as generated
- Content doesn't answer questions clearly

**Phase to address:** Phase 2 (WordPress Delivery System) - Content workflow documentation should address this.

---

### Pitfall 12: Blocking AI Crawlers in robots.txt
**What goes wrong:** robots.txt blocks JavaScript folders, AI crawlers (GPTBot, PerplexityBot), or uses legacy rules from pre-AI search era. This prevents AEO benefits while offering no security advantage.

**Consequences:**
- Site invisible to AI search engines
- Content not cited in ChatGPT, Perplexity, Gemini results
- Competitors without blocks get all AI-driven traffic
- Missing opportunity for zero-click visibility

**Prevention:**
- Allow Googlebot, GPTBot, PerplexityBot, and other AI crawlers
- Don't block /static or /js folders (required for modern rendering)
- Review robots.txt before launch
- Test with Google Search Console to verify crawlability
- Only block actual private content (admin, user accounts)

**Detection:**
- robots.txt shows "Disallow: /static" or "Disallow: /js"
- User-agent blocks include GPTBot or Perplexity
- AI search tools don't return your site for relevant queries
- Google Search Console shows crawl errors

**Phase to address:** Phase 1 (Core Site) - Verify during initial SEO setup.

---

### Pitfall 13: Portfolio Itself as a "Project"
**What goes wrong:** Including "Personal Portfolio Website" as one of your showcase projects signals junior developer and dilutes actual client work.

**Why it happens:**
- Need to fill space when project count is low
- Thinking it demonstrates technical skills
- Seeing other junior developers do it

**Consequences:**
- Looks inexperienced to potential clients
- Wastes precious portfolio slot on self-referential work
- Doesn't demonstrate client value delivery
- Creates recursive "portfolio of portfolios" problem

**Prevention:**
- Never include portfolio as a project
- If you lack projects, build 2-3 spec projects for fake businesses
- Show freelance work, side projects, or open source contributions
- Wait to launch until you have 6 non-portfolio projects

**Detection:**
- Project list includes "Built with Next.js and Convex to showcase my work"
- Portfolio is your most recent or featured project

**Phase to address:** Phase 1 (Core Site) - Content strategy phase.

---

## Minor Pitfalls

Mistakes that cause annoyance or small issues but are fixable.

### Pitfall 14: Outdated Portfolio Content
**What goes wrong:** Portfolio shows projects from 2+ years ago with deprecated tech stacks. Live links are broken. Screenshots show old designs.

**Why it happens:** "Set it and forget it" mentality after launch. No maintenance schedule.

**Prevention:**
- Quarterly portfolio review to verify links still work
- Replace projects older than 2 years with recent work
- Update tech stack descriptions to current versions
- Re-screenshot projects if visual design changed
- Mark WIP projects clearly or exclude them

**Detection:**
- Project descriptions mention "React 16" when React 19 is current
- Clicking live demo links returns 404
- Screenshots show designs from different era

**Phase to address:** Ongoing maintenance - Set calendar reminder for quarterly review.

---

### Pitfall 15: Poor Lighthouse Performance Scores
**What goes wrong:** Site scores below 80 on Lighthouse for Performance, SEO, or Accessibility. This hurts rankings, user experience, and professional credibility.

**Why it happens:**
- Unoptimized images (not using next/image)
- Blocking render with unoptimized fonts
- Too much client-side JavaScript
- Not testing before launch

**Prevention:**
- Use next/image for all images (automatic optimization)
- Lazy load images below fold
- Use Next.js font optimization for Google Fonts
- Target Lighthouse scores: 90+ Performance, 95+ SEO, 90+ Accessibility
- Run Lighthouse in CI before deployment

**Detection:**
- Lighthouse scores below 80 in any category
- PageSpeed Insights shows "slow" rating
- Images load sequentially instead of progressively
- Fonts cause layout shift (CLS issues)

**Phase to address:** Phase 1 (Core Site) - Test during build, catch before launch.

---

### Pitfall 16: Generic "Contact Me" Instead of Service-Specific CTA
**What goes wrong:** Services page has generic "Get in touch" button instead of "Book Your $500 Website Call." Misses opportunity to pre-qualify leads and set expectations.

**Why it happens:**
- Copying generic portfolio templates
- Not thinking from client perspective
- Generic forms seem more flexible

**Consequences:**
- Unqualified leads fill contact form
- Time wasted on discovery calls with people not ready to buy
- Conversion rate lower than it could be
- No clear path from "I need a site" to "Book a call"

**Prevention:**
- Use service-specific CTAs: "Book Your $500 Site Call" (not "Contact Me")
- Calendly link pre-qualifies with intake questions
- Services page clearly states price ($500) before CTA
- CTA button text matches service offering
- Include urgency or scarcity (limited slots, booking for Q2)

**Detection:**
- Contact form gets questions outside your service area
- Discovery calls often end with "this isn't a fit"
- People ask "how much?" when price is clearly stated
- Button says generic "Contact" instead of specific offer

**Phase to address:** Phase 1 (Core Site) - Copy and CTA strategy.

---

### Pitfall 17: No WordPress Content Workflow Documentation
**What goes wrong:** Each WordPress project requires gathering content (text, images, hours, services) from client but there's no repeatable process. This leads to delays, missing content, and unclear deliverables.

**Why it happens:**
- Treating each project as unique
- Not documenting what worked before
- No intake form for required content

**Consequences:**
- Projects delayed waiting for client to provide copy
- You write all content yourself (unpaid work)
- Client unhappy with your copywriting
- Launch delayed by content bottlenecks

**Prevention:**
- Create content intake form (services offered, business hours, about text, 3-5 photos)
- Document Claude-assisted drafting workflow for helping clients
- Set expectation: "I need your content by Day 2 to meet 5-day timeline"
- Provide content template with examples
- Include content deadline in project timeline

**Detection:**
- Project on Day 4, still waiting for About page text
- You're writing client's service descriptions yourself
- Client sends content in 5 different emails over 2 weeks
- Every project has content delays

**Phase to address:** Phase 2 (WordPress Delivery System) - Content workflow documentation is required.

---

### Pitfall 18: Treating Blog as Required for Launch
**What goes wrong:** Delaying portfolio launch because "I should have blog posts first" or building complex blog features before validating site converts clients.

**Why it happens:**
- Seeing other portfolios with blogs
- Thinking content marketing is required day 1
- Perfectionism and launch anxiety

**Consequences:**
- Delayed launch means delayed revenue
- Building blog features no one will read
- Time better spent on client work
- Maintenance burden for unused feature

**Prevention:**
- Ship without blog, add later if clients request content
- Focus launch on projects + services + booking flow
- Validate conversion before adding content features
- Blog can be added in Phase 3 after first clients close

**Detection:**
- You're building blog features instead of finishing services page
- "I'll launch when I have 5 blog posts written"
- Blog is in MVP scope without clear purpose
- Research on "best blogging platform" before portfolio is done

**Phase to address:** Phase 1 (Core Site) - Blog explicitly out of scope in PROJECT.md.

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| Phase 1: Core Portfolio Site | Over-engineering (Pitfall 5) | Strict scope limit: 5 projects, services page, Calendly. No blog. Ship in 2 weeks. |
| Phase 1: Core Portfolio Site | No clear CTA (Pitfall 1) | Review every page for primary CTA. Test booking flow before launch. |
| Phase 1: Core Portfolio Site | JavaScript rendering breaks SEO (Pitfall 7) | Use App Router with RSC. Test with Google Search Console before launch. |
| Phase 2: WordPress Delivery | No payment protection (Pitfall 2) | Document 50% upfront requirement in all templates/contracts before first client. |
| Phase 2: WordPress Delivery | Scope creep (Pitfall 3) | Create scope documentation template and change request process. |
| Phase 2: WordPress Delivery | No starter template (Pitfall 10) | Build template before first client. Don't skip this to "save time." |
| Phase 2: WordPress Delivery | Missing handoff docs (Pitfall 9) | Create handoff checklist and training process before first launch. |
| Phase 3: Future Features | Feature bloat before validation | Don't build client portal until 5+ clients request it. |

---

## Sources

**Portfolio Website Mistakes:**
- [5 Mistakes Developers Make in Their Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [How to Avoid Common Web Developer Portfolio Mistakes](https://www.linkedin.com/advice/0/what-most-important-things-avoid-your-web-developer-lk51e)
- [7 Deadly Sins of Developer Portfolios](https://pesto.tech/resources/7-deadly-sins-of-developer-portfolios-and-how-to-avoid-them)
- [Developer Portfolio Do's & Don'ts](https://blog.kieranroberts.dev/developer-portfolio-dos-and-donts)

**Freelance WordPress Business:**
- [Managing Scope Creep for WordPress Projects](https://elicus.com/managing-scope-creep/)
- [How to Tame Scope Creep in WordPress Development](https://deliciousbrains.com/how-to-tame-scope-creep-in-wordpress-development/)
- [How to Avoid Scope Creep in Freelance Projects](https://www.hellobonsai.com/blog/how-to-avoid-scope-creep)

**WordPress Service Delivery:**
- [Why Most WordPress and Shopify Stores Fail in 2026](https://rejverahman.medium.com/why-most-wordpress-and-shopify-stores-fail-and-what-actually-works-in-2026-c8c851acfba6)
- [WordPress Website Services: How Much Should You Charge (2026)](https://wpastra.com/guides-and-tutorials/pricing-your-wordpress-services/)

**Next.js SEO & Performance:**
- [JavaScript SEO In 2026: 7 Mistakes Killing Your Rankings](https://zumeirah.com/javascript-seo-in-2026/)
- [The Complete Guide to SEO Optimization in Next.js 15](https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7)
- [Typical Next.js SEO Pitfalls to Avoid in 2024](https://focusreactive.com/typical-next-js-seo-pitfalls-to-avoid-in-2024/)
- [SEO Meets Performance: Optimizing Next.js Without Losing Rankings](https://www.wisp.blog/blog/seo-meets-performance-optimizing-nextjs-without-losing-rankings)

**AEO Implementation:**
- [What is AEO (Answer Engine Optimization)? Complete 2026 Guide](https://digg.com/ai-growth-marketing/jGhncOK/what-is-aeo-answer-engine-optimization)
- [Answer Engine Optimization: Complete Guide for 2026](https://www.codelevate.com/blog/answer-engine-optimization-aeo-the-comprehensive-guide-for-2026)
- [AEO Emerging Trends: How Answer Engine Optimization is Reshaping Search in 2026](https://www.revvgrowth.com/aeo/emerging-trends-in-aeo)
- [Answer Engine Optimization: Practical Framework for 2026](https://monday.com/blog/marketing/answer-engine-optimization/)

**CTA & Conversion:**
- [How to Design Portfolio Homepages That Land You Job in 2026](https://uxplaybook.org/articles/6-ux-portfolio-homepage-mistakes-2026)
- [7 Common Pitfalls of Call to Action Design](https://vwo.com/blog/common-call-to-action-mistakes/)
- [CTA Best Practices: Crafting Calls-to-Action That Actually Convert](https://www.leanlabs.com/blog/cta-best-practices)

**Payment Terms:**
- [How to Ask Clients for an Upfront Payment the Right Way](https://youcanbook.me/blog/how-to-ask-for-an-upfront-payment-from-a-client)
- [Web Design Payment Schedules: A Guide to Deposits and Milestones](https://contra.com/p/NAAvZWNm-web-design-payment-schedules-a-guide-to-deposits-and-milestones)
- [What Is Upfront Payment? Key Insights for Freelancers](https://solowise.com/blog/what-is-upfront-payment)

**Client Onboarding:**
- [Why Most WordPress Agencies Lose Money on Client Onboarding](https://wp-umbrella.com/blog/why-most-wordpress-agencies-lose-money-on-client-onboarding/)
- [Client Handoff SOP For WordPress Projects](https://usmanjatoi.com/websites/launch-checklists/client-handoff-sop-for-wordpress-projects/)
- [How to Create a Client Onboarding Process](https://wpmudev.com/blog/wordpress-client-onboarding/)
- [A Simple Framework for Executing Successful Client Onboarding](https://mainwp.com/framework-client-onboarding/)

**Convex + Next.js:**
- [Authentication Best Practices: Convex, Clerk and Next.js](https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs)
