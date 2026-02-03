# jpgerton.com - Project Brief

> Generated from Claude Desktop App conversation on 2025-02-03

## Overview

Personal portfolio and services site for Jon Gerton. Serves two purposes:

1. Showcase indie projects and dev work
2. Market services (primarily $500 WordPress sites for local businesses)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (free tier)
- **Contact:** Formspree (free tier) or Calendly embed
- **Domain:** jpgerton.com (purchased)

## Site Structure

```
jpgerton.com/
├── / (home)
├── /projects
├── /services
├── /about
└── /contact
```

## Pages

### Home (`/`)

- Hero section: "Full-stack dev. I build tools and ship sites." (or similar)
- Brief intro (1-2 sentences)
- Featured projects grid (3-4 cards linking to /projects)
- Services snapshot with CTA to /services
- Simple footer with social links

### Projects (`/projects`)

Portfolio of indie projects. Each project card should include:

- Name
- One-line description
- Screenshot/preview
- Tech stack tags
- Link to live site or repo

**Projects to feature:**

| Project            | Description                                          | Status      |
| ------------------ | ---------------------------------------------------- | ----------- |
| AI Marketing Memer | AI-powered meme generator for marketing              | Live        |
| Flame or Fame      | [Add description]                                    | Live        |
| Huedle             | [Add description]                                    | Live        |
| DevClose.app       | Daily developer journaling with GitHub-style streaks | Live        |
| Planr              | Kanban-style project management                      | Coming soon |

### Services (`/services`)

Three service tiers/offerings:

**1. $500 WordPress Sites**

- Target: Local service businesses (landscapers, cleaners, trades, etc.)
- Deliverable: 5-7 page professional site in 5 days
- Includes: Mobile responsive, contact form, Google Maps, basic SEO
- CTA: Book a call (Calendly)

**2. Custom Web Apps**

- Target: Businesses needing custom tooling
- Pricing: Inquiry-based
- CTA: Contact form

**3. Team Growth Accelerator (optional)**

- Target: Dev teams wanting to level up
- Workshop-based consulting
- CTA: Learn more / Contact

### About (`/about`)

- 20+ years full-stack experience
- Industries: oil & gas, aviation, data analytics
- Current focus: indie projects, AI tooling, helping local businesses get online
- Philosophy: simplicity, pattern recognition, anti-gatekeeping
- Keep it short, human, no resume dump

### Contact (`/contact`)

- Calendly embed for booking calls
- Or: Simple form (name, email, message) via Formspree
- Email fallback
- Social links (GitHub, LinkedIn, X/Twitter if applicable)

## Design Direction

- **Vibe:** Clean, minimal, fast. Professional but not corporate.
- **Colors:** Neutral base (white/gray/black), one accent color
- **Typography:** System fonts or single clean sans-serif (Inter, etc.)
- **No:** Flashy animations, gradients, stock photos, emoji overload
- **Yes:** Whitespace, clear hierarchy, fast load times

## Component Priorities

Build in this order:

1. Layout (nav, footer, page wrapper)
2. Home page (hero, project cards, services CTA)
3. Projects page (project grid/list)
4. Services page (service cards with CTAs)
5. Contact page (form or Calendly)
6. About page (last, lowest priority)

## shadcn/ui Components to Use

- `Button`
- `Card`
- `Badge` (for tech stack tags)
- `Input`, `Textarea`, `Label` (for contact form)
- `NavigationMenu` or simple custom nav
- `Separator`

## SEO Basics

- Proper `<title>` and `<meta description>` per page
- Open Graph tags for social sharing
- Semantic HTML (h1, h2, etc.)
- Fast load times (Vercel + Next.js handles most of this)

## Deployment

1. Push to GitHub repo
2. Connect repo to Vercel
3. Point jpgerton.com DNS to Vercel
4. Enable HTTPS (automatic)

## Reference Files

- `wordpress-business-plan.md` - Full details on the $500 WordPress site service, target market, outreach strategy, pricing, and automation plans

## Next Steps for Claude Code CLI

1. Initialize Next.js 14 project with App Router
2. Install Tailwind CSS
3. Install and configure shadcn/ui
4. Create folder structure for pages
5. Build layout component (nav + footer)
6. Build home page
7. Iterate from there

---

## Notes

- This is a personal brand site, not a SaaS product
- Keep scope tight - ship fast, iterate later
- The $500 WordPress service is the near-term revenue play
- Projects showcase technical range and attract other opportunities
