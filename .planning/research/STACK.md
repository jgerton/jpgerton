# Technology Stack

**Project:** wp-designer (jpgerton.com)
**Researched:** 2026-02-03
**Overall Confidence:** HIGH

## Executive Summary

This stack leverages Next.js 14 App Router with Convex for the portfolio site, shadcn/ui for component architecture, and LocalWP for WordPress local development. The combination provides a modern developer experience while enabling efficient delivery of $500 WordPress sites to local businesses. Research focused on 2026 best practices with verified sources from official documentation and current ecosystem usage.

---

## Core Portfolio Stack (Next.js + Convex)

### Framework & Runtime

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 14.2.x (consider 15.x) | App framework with SSR/SSG | App Router provides stable RSC support, excellent DX, Vercel deployment integration. v15 offers React 19 support but v14 remains production-stable. |
| React | 18.3.x (or 19.x with Next 15) | UI library | React 18 is stable with Next.js 14. React 19 is production-ready but requires Next.js 15 for official support. |
| TypeScript | 5.1.3+ | Type safety | Required version for async Server Components. Provides end-to-end type safety with Convex. |
| Node.js | 20+ LTS | Runtime environment | Required for Tailwind v4 upgrade tool, standard for modern Next.js development. |

**Confidence:** HIGH - Official Next.js docs, verified compatibility
**Sources:**
- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Production Status](https://dev.to/manojspace/react-18-vs-react-19-key-differences-and-migration-tips-18op)
- [Next.js TypeScript Config](https://nextjs.org/docs/app/api-reference/config/typescript)

---

### Database & Backend

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Convex | Latest | Backend-as-a-Service (database + auth + serverless functions) | Real-time reactivity, end-to-end type safety, built-in auth integration, eliminates need for separate API layer. Official Next.js 14 App Router support. |
| Convex Auth (Clerk) | Latest | Authentication | ConvexProviderWithClerk provides seamless integration. Clerk is the most common approach in 2026, handles user management with minimal code. |

**Confidence:** HIGH - Official Convex documentation
**Rationale:** Convex replaces traditional database + ORM + API setup with single unified backend. Real-time subscriptions work seamlessly with React Server Components pattern. Clerk integration is battle-tested with dedicated provider components.

**Sources:**
- [Convex Next.js App Router Integration](https://docs.convex.dev/client/nextjs/app-router/)
- [Convex Authentication Best Practices](https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs)
- [Clerk + Convex Integration Guide](https://clerk.com/docs/guides/development/integrations/databases/convex)

---

### UI & Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 3.4.x (monitor v4) | Utility-first CSS | Industry standard, excellent DX. v4 offers 5x faster builds but requires modern browser targets (Safari 16.4+). Stick with v3 for broader compatibility. |
| shadcn/ui | Latest | Component library | Radix UI primitives + Tailwind styling. Copy-paste architecture means no package dependency bloat. 1000+ components available, excellent dark mode support via next-themes. |
| next-themes | Latest | Theme management | Powers shadcn/ui dark mode. Supports system preference detection, prevents hydration issues with suppressHydrationWarning pattern. |
| Framer Motion | 11.x+ | Animations | Standard for React animations. Note: App Router has AnimatePresence exit animation challenges. Use template.tsx pattern for page transitions, avoid complex exit animations. |
| Lucide React | Latest | Icon library | Modern icon set, tree-shakeable, used by shadcn/ui ecosystem. |

**Confidence:** HIGH - Official documentation and verified ecosystem patterns
**Tailwind v4 Note:** While v4 is officially released with 100x faster incremental builds, it requires Safari 16.4+, Chrome 111+, Firefox 128+. For maximum compatibility, use Tailwind 3.4.x. Migration tool available when ready.

**Sources:**
- [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode)
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Framer Motion App Router Issues](https://github.com/vercel/next.js/issues/49279)
- [shadcn/ui Portfolio Templates](https://allshadcn.com/templates/category/portfolio-templates/)

---

### Form Handling & Validation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Hook Form | 7.x+ | Form state management | Minimal re-renders, excellent DX, industry standard for complex forms. Integrates seamlessly with Zod via @hookform/resolvers. |
| Zod | 3.x+ | Schema validation | TypeScript-first validation. Client + server validation with same schema. Type inference for form data. |
| @hookform/resolvers | Latest | RHF + Zod integration | Official adapter for using Zod schemas with React Hook Form. |

**Confidence:** HIGH - Current ecosystem standard (verified 2026)
**Pattern:** Use with Next.js Server Actions for type-safe client-to-server validation. Single Zod schema validates both client-side (instant feedback) and server-side (security).

**Sources:**
- [React Hook Form + Zod Guide 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)
- [Type-Safe Forms in Next.js 15](https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form)

---

### SEO & Discoverability

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-sitemap | Latest | Dynamic sitemap generation | Server-side sitemap APIs (getServerSideSitemap, getServerSideSitemapIndex) for CMS-driven content. More flexible than native sitemap.ts for complex scenarios. |
| next-aeo | Latest | Answer Engine Optimization | Generates llms.txt file for AI discoverability (ChatGPT, Perplexity, Google AI Overviews). Zero config, runs post-build. Critical for 2026 SEO as Gartner predicts 25% search volume shift to AI by 2026. |

**Confidence:** HIGH - Emerging standard for 2026 (next-aeo), established pattern (next-sitemap)
**AEO Context:** 400+ million people use OpenAI products weekly. Portfolio sites must optimize for answer engines to remain discoverable. next-aeo automates llms.txt generation with no heavy config.

**Native Alternative:** Next.js 14+ includes native sitemap.xml and metadata API. Use next-sitemap only if you need advanced server-side generation from external CMS.

**Sources:**
- [next-aeo Introduction](https://www.tryprofound.com/blog/next-aeo)
- [AEO Trends 2026](https://blog.hubspot.com/marketing/answer-engine-optimization-trends)
- [next-sitemap GitHub](https://github.com/iamvishnusankar/next-sitemap)
- [Next.js Native Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

---

### Hosting & Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | N/A | Hosting platform | Zero-config Next.js deployment, edge network, preview deployments, environment variable management. Seamless integration with Convex and Next.js. |

**Environment Variables:**
- Use NEXT_PUBLIC_ prefix for client-exposed variables (required for Convex client connection)
- 64KB total limit per deployment (5KB for Edge Functions)
- Separate environments: Development, Preview, Production
- Pull env vars locally with vercel env pull (creates .env.local)

**Confidence:** HIGH - Official Vercel documentation
**Sources:**
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Managing Next.js Environment Variables](https://www.wisp.blog/blog/managing-nextjs-environment-variables-from-development-to-production-vercel)

---

## WordPress Delivery Stack

### Local Development

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Local by WP | Latest | Local WordPress environment | Best for solo developers and quick client projects. Fast setup, native SSL, GUI management. Each site gets isolated container with independent PHP versions. Recommended over Docker for this use case. |
| WP-CLI | Latest | Command-line WordPress management | Essential for professional workflows: database export/import, search-replace URLs (critical for dev→staging→production), cache flushing, automated maintenance. Required for modern deployment automation. |

**Why Local by WP over Docker:**
- **Use Local by WP when:** You're a solo freelancer, need quick project turnaround, hate command-line setup, want GUI database/PHP management
- **Use Docker when:** Large team coordination, CI/CD pipelines, complex custom stacks, need exact production parity

**Confidence:** HIGH - Current ecosystem recommendations (2026)
**Sources:**
- [WordPress Local Development Guide 2026](https://awp.agency/en/blog/how-to-make-wordpress-local-in-2026-definitive-guide-and-comparison-of-environments/)
- [LocalWP vs Docker Comparison](https://instawp.com/is-local-development-relevant-in-2024/)
- [8 Best Local WordPress Environments](https://jetpack.com/resources/local-wordpress-development-environment/)

---

### Page Builder

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Elementor Pro | Latest | Visual page builder | Best balance of design freedom, performance, and pricing for $500 client sites. Faster turnaround than Gutenberg alone, mature ecosystem, works alongside Gutenberg. |
| Gutenberg (Core) | N/A | Block editor (fallback) | Free, built into WordPress core, fastest performance, best for lightweight sites. Use for blog posts, Elementor for landing pages/custom layouts. Hybrid approach is common in 2026. |

**Confidence:** HIGH - Verified ecosystem preference for freelance workflows
**Recommendation:** Hybrid approach - Gutenberg for content, Elementor Pro for custom landing pages and high-design sections. This balances speed (Gutenberg is faster) with client expectations (Elementor's visual editing).

**Sources:**
- [Best Page Builders for WordPress 2026](https://belovdigital.agency/blog/the-best-page-builders-for-wordpress-in-2026/)
- [Elementor vs Gutenberg Guide](https://www.iflair.com/gutenberg-vs-elementor-2025-which-wordpress-page-builder-should-you-use/)

---

### Deployment & Workflow

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Git | Latest | Version control | Fundamental to modern WordPress development. Code moves up (dev→staging→prod), content moves down (prod→staging→dev). Track theme/plugin changes, not database. |
| GitHub / GitLab | N/A | Repository hosting | For version control and optional CI/CD automation (GitHub Actions, GitLab CI) if you scale beyond manual deployments. |
| WP Migrate | Plugin | Database sync tool | Handles URL search-replace during environment migrations. Alternative: use WP-CLI search-replace commands. |

**Workflow Pattern:**
1. **Local (Local by WP):** Develop themes/plugins, commit to Git
2. **Staging:** Test with production-like data, manual deployment
3. **Production:** Deploy code via Git (or SFTP initially), use WP-CLI for database operations

**Anti-Pattern:** DO NOT use WordPress Multisite for client sites. Single point of failure, complex migrations, performance issues. Use separate WordPress installs + management tools (WP Umbrella, ManageWP) instead.

**Confidence:** HIGH - Industry best practices verified across multiple sources
**Sources:**
- [WordPress Git Deployment Workflow](https://pantheon.io/learning-center/wordpress/staging-to-production)
- [WordPress Deployment Best Practices](https://wpengine.com/support/development-workflow-best-practices/)
- [WordPress Multisite vs Single Site](https://instawp.com/wordpress-multisite-vs-single-site/)

---

### Hosting (for Clients)

| Technology | Purpose | Why |
|------------|---------|-----|
| Hostinger | Budget WordPress hosting ($1.79-4/mo) | Best budget choice for small business clients. Performance score 8.4/10, LiteSpeed servers, easy dashboard. Excellent value for $500 site deliveries. |
| Bluehost | Beginner-friendly hosting ($2.99/mo) | WordPress.org recommended, excellent support, free domain first year. Best for clients who need hand-holding. |
| IONOS | Cheapest first year ($1/mo) | Lowest barrier to entry, good for price-sensitive local businesses. |

**Confidence:** HIGH - Verified 2026 pricing and reviews
**Client Strategy:** Offer Hostinger as default recommendation (best value), Bluehost for non-technical clients, IONOS for extreme budget constraints. All include free SSL, email, one-click WordPress install.

**Sources:**
- [7 Best Cheap WordPress Hosting 2026](https://elementor.com/blog/best-cheap-wordpress-hosting/)
- [Budget WordPress Hosting Tested](https://themeisle.com/blog/cheap-wordpress-hosting/)

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx / tailwind-merge | Latest | Conditional class names | Merge Tailwind classes with conflict resolution. Use cn() utility from shadcn/ui. |
| date-fns | Latest | Date manipulation | Lightweight alternative to moment.js. For blog post dates, project timelines. |
| sharp | Latest | Image optimization | Next.js uses Sharp for Image component. Pre-installed with Next.js. |
| @vercel/analytics | Latest | Web analytics | Privacy-friendly analytics from Vercel. Optional, use if tracking portfolio performance. |
| @vercel/speed-insights | Latest | Performance monitoring | Real User Monitoring (RUM) for Core Web Vitals. Optional, useful for portfolio optimization. |

**Confidence:** MEDIUM-HIGH - Standard ecosystem choices, verify specific versions at install time

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Database | Convex | Supabase, PlanetScale, Firebase | Convex provides better real-time reactivity and simpler auth integration for this use case. Supabase viable alternative if you need PostgreSQL specifically. |
| Auth | Clerk (via Convex) | NextAuth.js, Auth0 | Clerk has dedicated Convex provider (ConvexProviderWithClerk). NextAuth viable for custom flows. |
| CMS (Portfolio) | None (Convex DB) | Sanity, Contentful, Prismic | For 6 indie projects, direct DB management is simpler. Add headless CMS only if non-technical content editors needed. Sanity is most flexible if CMS required. |
| Animations | Framer Motion | GSAP, React Spring | Framer Motion is React-native, declarative API. GSAP more powerful but imperative. Note App Router exit animation limitations. |
| Forms | React Hook Form + Zod | Formik, TanStack Form | RHF + Zod is 2026 standard, better performance, excellent TypeScript support. |
| Tailwind Version | v3.4.x | v4.0.x | v4 requires Safari 16.4+. Use v3 for broader compatibility unless targeting modern browsers only. |
| WordPress Local Dev | Local by WP | Docker, XAMPP, MAMP | Local by WP best for solo freelancers. Docker better for teams/CI-CD. XAMPP/MAMP outdated. |
| WordPress Multisite | NO (separate installs) | WordPress Multisite | Multisite single point of failure, complex client migrations, shared resources cause performance issues. Use separate installs + management tool. |
| Page Builder | Elementor Pro + Gutenberg | Oxygen, Bricks, Divi | Elementor best balance of features/price for $500 sites. Gutenberg for lightweight content. Oxygen/Bricks faster but steeper learning curve. |

**Confidence:** HIGH - Ecosystem analysis from multiple sources

---

## Installation

### Portfolio Site (Next.js + Convex)

```bash
# Create Next.js project
bunx create-next-app@latest wp-designer --typescript --tailwind --app

# Install Convex
cd wp-designer
bun add convex
bunx convex dev

# Install UI dependencies
bunx shadcn@latest init
bun add framer-motion next-themes lucide-react

# Install form handling
bun add react-hook-form zod @hookform/resolvers

# Install SEO tools
bun add next-sitemap
bunx next-aeo@latest  # Run after build

# Install utilities
bun add clsx tailwind-merge date-fns

# Optional: Analytics
bun add @vercel/analytics @vercel/speed-insights

# Auth (if using Clerk)
bun add @clerk/nextjs
```

### WordPress Development

```bash
# Download Local by WP
# https://localwp.com/

# Install WP-CLI globally (if not included)
# https://wp-cli.org/

# After Local site creation, access via CLI:
wp plugin list
wp db export backup.sql
wp search-replace 'old-domain.local' 'new-domain.com'
```

---

## Configuration Files

### convex.json
```json
{
  "functions": "convex/",
  "authInfo": [
    {
      "applicationID": "convex",
      "domain": "https://your-clerk-domain.clerk.accounts.dev"
    }
  ]
}
```

### next.config.ts
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['your-convex-deployment.convex.cloud'],
  },
}

export default nextConfig
```

### tailwind.config.ts (Tailwind v3)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // shadcn/ui theme variables
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### .env.local (Portfolio)
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk (if using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
```

---

## Architecture Patterns

### Convex + Next.js App Router Integration

**Client Component Wrapper Pattern:**
```typescript
// app/ConvexClientProvider.tsx
'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
```

**Usage in layout.tsx:**
```typescript
// app/layout.tsx
import { ConvexClientProvider } from './ConvexClientProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
```

**Server-Side Rendering with preloadQuery:**
```typescript
// app/projects/page.tsx
import { preloadQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export default async function ProjectsPage() {
  const preloaded = await preloadQuery(api.projects.list)

  return <ProjectsList preloaded={preloaded} />
}
```

---

### Form Handling Pattern

```typescript
// app/contact/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    // Submit to Convex mutation or Server Action
    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* ... */}
    </form>
  )
}
```

---

### Dark Mode Pattern (shadcn/ui)

```typescript
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

```typescript
// components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </button>
  )
}
```

---

### SEO Metadata Pattern

```typescript
// app/projects/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await fetchProject(params.slug)

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image }],
    },
  }
}
```

---

## What NOT to Use

**Avoid These:**
- **WordPress Multisite for client work** - Single point of failure, migration nightmare (40+ hours per site), shared resource performance issues
- **Docker for solo WordPress development** - Overkill complexity vs Local by WP for this use case
- **Moment.js** - Deprecated, use date-fns or native Intl API
- **Create React App** - Deprecated, use Next.js or Vite
- **Pages Router (Next.js)** - Use App Router for new projects
- **Tailwind v4** - Wait until Safari 16.4+ adoption increases (unless targeting modern-only browsers)
- **Complex AnimatePresence exit animations in App Router** - Known compatibility issues, use template.tsx pattern instead

**Confidence:** HIGH - Verified anti-patterns from ecosystem

---

## Version Verification Strategy

This research was conducted on 2026-02-03. Given Claude's training data limitations:

**HIGH Confidence (Verified with official docs):**
- Next.js, Convex, Tailwind, shadcn/ui core APIs
- React Hook Form + Zod integration patterns
- Vercel deployment configuration

**MEDIUM Confidence (WebSearch + multiple sources agree):**
- Specific version numbers (verify at install time)
- AEO tools and emerging patterns (next-aeo, llms.txt)
- WordPress hosting pricing (subject to change)

**Recommended Verification:**
```bash
# Check latest stable versions before install
bun pm ls --global
bunx npm-check-updates
```

**Update Schedule:**
- Review stack choices every 6 months
- Monitor Next.js major releases (currently 15.x available, 14.x stable)
- Watch Tailwind v4 browser compatibility metrics
- Track AEO ecosystem evolution (llms.txt standard emerging)

---

## Sources & Further Reading

**Core Framework:**
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Convex Next.js Integration](https://docs.convex.dev/client/nextjs/app-router/)
- [Convex + Clerk Best Practices](https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs)

**UI & Styling:**
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Portfolio Templates](https://allshadcn.com/templates/category/portfolio-templates/)

**Forms & Validation:**
- [React Hook Form + Zod Guide 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)
- [Type-Safe Forms in Next.js 15](https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form)

**SEO & AEO:**
- [next-aeo Tool](https://www.tryprofound.com/blog/next-aeo)
- [AEO Trends 2026](https://blog.hubspot.com/marketing/answer-engine-optimization-trends)
- [Next.js SEO Best Practices 2026](https://medium.com/@alokkumar41558/next-js-seo-best-practices-guide-027325bf9339)

**WordPress:**
- [WordPress Local Development 2026](https://awp.agency/en/blog/how-to-make-wordpress-local-in-2026-definitive-guide-and-comparison-of-environments/)
- [Best Page Builders 2026](https://belovdigital.agency/blog/the-best-page-builders-for-wordpress-in-2026/)
- [WordPress Git Deployment](https://pantheon.io/learning-center/wordpress/staging-to-production)
- [Budget WordPress Hosting 2026](https://elementor.com/blog/best-cheap-wordpress-hosting/)

**Ecosystem Analysis:**
- [React 19 Production Status](https://dev.to/manojspace/react-18-vs-react-19-key-differences-and-migration-tips-18op)
- [Framer Motion App Router Challenges](https://github.com/vercel/next.js/issues/49279)
- [WordPress Multisite vs Single](https://instawp.com/wordpress-multisite-vs-single-site/)

---

## Final Recommendations

**For Portfolio Site (jpgerton.com):**
1. **Start with Next.js 14 + React 18** for maximum stability
2. **Use Convex** for backend - eliminates API complexity
3. **shadcn/ui + Tailwind 3** for components - defer v4 until Safari adoption improves
4. **Implement next-aeo** post-build for AI discoverability
5. **Add Clerk via Convex** when ready for auth (can defer initially)

**For WordPress Client Sites:**
1. **Local by WP** for local development - fastest setup
2. **Elementor Pro + Gutenberg hybrid** - balance speed and design freedom
3. **Separate WordPress installs** per client - avoid Multisite trap
4. **Hostinger hosting** as default recommendation - best value for $500 sites
5. **Git + WP-CLI** for deployment automation as you scale

**Migration Path:**
- Start simple (Convex DB, no CMS needed for 6 projects)
- Add Clerk auth when you need user features
- Consider Sanity headless CMS only if non-technical editors join
- Monitor Tailwind v4 adoption, migrate when Safari 16.4+ reaches 90%+
- Upgrade to Next.js 15 + React 19 when you need new features (not required immediately)

**Confidence Assessment:**
- Stack choices: HIGH (verified with official docs)
- Version numbers: MEDIUM-HIGH (subject to change, verify at install)
- WordPress recommendations: HIGH (2026 ecosystem verified)
- AEO patterns: MEDIUM (emerging standard, rapidly evolving)

This stack balances modern best practices with production stability, optimized for solo developer velocity and client deliverability.
