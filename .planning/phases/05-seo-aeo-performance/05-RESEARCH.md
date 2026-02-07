# Phase 5: SEO, AEO & Performance - Research

**Researched:** 2026-02-04
**Domain:** Next.js 14 App Router SEO, Answer Engine Optimization (AEO), and Performance Optimization
**Confidence:** HIGH

## Summary

Phase 5 implements comprehensive SEO, AEO (Answer Engine Optimization), and performance optimizations for a Next.js 14 App Router portfolio site. The research reveals that modern SEO in 2026 extends beyond traditional search engines to include AI-powered answer engines (ChatGPT, Perplexity, Google AI Overviews), requiring both traditional metadata optimization and new AEO strategies like llms.txt files.

Next.js 14 App Router provides first-class support for SEO through its Metadata API, automatic sitemap generation, and built-in performance optimizations. The existing project already uses Inter font with next/font/google and the Image component foundation, providing a strong starting point.

Key findings show that achieving Lighthouse scores >90 requires careful attention to Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1), proper use of Next.js Image component with sizes prop for responsive images, and strategic loading priorities for above-the-fold content. Analytics integration involves both Vercel Analytics (built-in) and Google Analytics 4 via @next/third-parties.

**Primary recommendation:** Use Next.js App Router's built-in Metadata API for all SEO features, leverage next-aeo for automatic llms.txt generation post-build, implement schema-dts for type-safe JSON-LD markup, and prioritize Core Web Vitals optimization through proper image sizing and font loading strategies.

## Standard Stack

The established libraries/tools for Next.js 14 SEO, AEO & Performance optimization:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6+ | Framework with built-in SEO | App Router Metadata API, automatic image/font optimization |
| next/font/google | Built-in | Google Fonts optimization | Eliminates FOUT/FOIT, 200-500ms FCP improvement, automatic subsetting |
| next/image | Built-in | Automatic image optimization | WebP/AVIF conversion, lazy loading, prevents CLS |
| schema-dts | Latest | TypeScript types for Schema.org | Google-maintained, 325k+ weekly downloads, type-safe JSON-LD |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-aeo | Latest | Automatic llms.txt generation | Post-build to create AI-friendly site summaries |
| @next/third-parties | Latest | Optimized third-party scripts | Google Analytics 4 integration with automatic optimization |
| @vercel/analytics | Latest | Web Vitals tracking | Vercel deployment for automatic performance monitoring |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| schema-dts | Manual JSON-LD | Lose type safety, more prone to validation errors |
| @next/third-parties/google | Direct gtag.js | Miss automatic script optimization, worse performance |
| Metadata API | next-seo package | Outdated for App Router, doesn't support new features |
| next-aeo | Manual llms.txt | Miss automatic content extraction, outdated quickly |

**Installation:**
```bash
bun add schema-dts next-aeo @next/third-parties @vercel/analytics
bun add -D @types/node
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── layout.tsx                 # Root metadata, fonts, analytics
├── sitemap.ts                 # Dynamic sitemap generation
├── robots.ts                  # robots.txt configuration
├── _components/
│   ├── web-vitals.tsx        # Web Vitals measurement
│   └── schema/               # Reusable schema components
│       ├── local-business.tsx
│       ├── service.tsx
│       └── person.tsx
├── (routes)/
│   └── [page]/
│       └── page.tsx          # generateMetadata per page
└── api/
    └── og/                   # Open Graph image generation (optional)
```

### Pattern 1: Metadata Hierarchy with generateMetadata

**What:** Dynamic metadata generation per route that extends parent metadata
**When to use:** Every public page needs unique title, description, and Open Graph tags

**Example:**
```typescript
// app/services/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      images: [{
        url: service.image,
        width: 1200,
        height: 630,
        alt: service.title,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.description,
      images: [service.image],
    },
  }
}
```

**Source:** [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### Pattern 2: Type-Safe JSON-LD Schema Markup

**What:** Schema.org structured data with TypeScript validation
**When to use:** Every page type needs structured data (LocalBusiness, Service, Person, FAQPage)

**Example:**
```typescript
// app/_components/schema/local-business.tsx
import { WithContext, LocalBusiness } from 'schema-dts'

export function LocalBusinessSchema() {
  const jsonLd: WithContext<LocalBusiness> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Jon Gerton Web Design',
    description: 'Professional WordPress websites starting at $500',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Your City',
      addressRegion: 'ST',
      addressCountry: 'US',
    },
    telephone: '+1-555-555-5555',
    url: 'https://jongerton.com',
    priceRange: '$$',
    openingHours: 'Mo-Fr 09:00-17:00',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

**Security Note:** Always sanitize with `.replace(/</g, '\\u003c')` to prevent XSS injection

**Source:** [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)

### Pattern 3: FAQ Schema with Speakable Markup

**What:** FAQ sections with speakable markup for AI assistant discoverability
**When to use:** Services page, FAQ pages

**Example:**
```typescript
// app/_components/schema/faq.tsx
import { WithContext, FAQPage } from 'schema-dts'

export function FAQSchema({ questions }: { questions: Array<{ q: string, a: string }> }) {
  const jsonLd: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
      // Speakable markup for voice search
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.faq-answer'],
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

**Note:** Speakable is currently beta, US-only for Google Assistant, but increasingly important for AI systems in 2026

**Source:** [Google Speakable Markup](https://developers.google.com/search/docs/appearance/structured-data/speakable)

### Pattern 4: Dynamic Sitemap Generation

**What:** Automatic sitemap.xml generation from database/CMS content
**When to use:** Sites with dynamic content (projects, blog posts, services)

**Example:**
```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()

  const projectUrls = projects.map((project) => ({
    url: `https://jongerton.com/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://jongerton.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://jongerton.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://jongerton.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://jongerton.com/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    ...projectUrls,
  ]
}
```

**Source:** [Next.js Sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

### Pattern 5: Optimized Image Component Usage

**What:** Next.js Image component with proper sizing and priority for performance
**When to use:** All images, especially hero/above-the-fold images

**Example:**
```typescript
import Image from 'next/image'

// Hero image (LCP element)
<Image
  src="/hero.jpg"
  alt="Web Design Services"
  width={1200}
  height={600}
  priority // Loads immediately, no lazy loading
  sizes="100vw"
  style={{ width: '100%', height: 'auto' }}
/>

// Grid images (below fold)
<Image
  src={project.image}
  alt={project.title}
  width={400}
  height={300}
  loading="lazy" // Default, explicit for clarity
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Critical:** Always provide `sizes` prop for responsive images, or optimization is limited

**Source:** [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)

### Pattern 6: Web Vitals Measurement with Analytics

**What:** Track Core Web Vitals and send to Google Analytics 4
**When to use:** Production site with analytics enabled

**Example:**
```typescript
// app/_components/web-vitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Can also send to Vercel Analytics (automatic if installed)
    console.log(metric)
  })
}

// app/layout.tsx
import { WebVitals } from './_components/web-vitals'
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}
```

**Source:** [Next.js Analytics Guide](https://nextjs.org/docs/app/guides/analytics)

### Pattern 7: Calendly UTM Parameter Tracking

**What:** Pass UTM parameters to embedded Calendly for conversion tracking
**When to use:** Contact page with Calendly integration

**Example:**
```typescript
'use client'
import { useEffect, useState } from 'react'
import { InlineWidget } from 'react-calendly'

export function CalendlyEmbed() {
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})

  useEffect(() => {
    // Extract UTM parameters from URL
    const params = new URLSearchParams(window.location.search)
    const utm = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
    }

    // Store in sessionStorage for persistence
    sessionStorage.setItem('utm_params', JSON.stringify(utm))
    setUtmParams(utm)
  }, [])

  return (
    <InlineWidget
      url="https://calendly.com/yourusername/30min"
      utm={utmParams}
    />
  )
}
```

**Source:** [Calendly UTM Tracking](https://help.calendly.com/hc/en-us/articles/1500005575121-How-to-track-conversions-with-UTM-parameters)

### Anti-Patterns to Avoid

- **Client-side metadata:** Never use `<Head>` or `useEffect` to set metadata; use Metadata API only
- **Missing sizes prop:** Image component without `sizes` prop severely limits optimization
- **Duplicate JSON-LD:** Don't export both `metadata` object and `generateMetadata` from same file
- **Blocking scripts:** Don't load analytics synchronously; use @next/third-parties for optimization
- **Manual font loading:** Don't use CDN links; use next/font for automatic optimization
- **Leaving noindex in production:** Common mistake that blocks all indexing

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| llms.txt generation | Manual content summarization | next-aeo | Automatically analyzes build output, extracts structured content, handles internationalization |
| JSON-LD validation | Manual schema validation | schema-dts + TypeScript | Compile-time validation, 100% Schema.org coverage, maintained by Google |
| Google Analytics integration | Custom gtag.js implementation | @next/third-parties/google | Automatic script optimization, prevents render blocking, maintains privacy |
| Sitemap generation | Static XML files | app/sitemap.ts | Automatically includes dynamic routes, updates on build, proper XML format |
| Image optimization | Custom loader + CDN | next/image | Handles WebP/AVIF conversion, srcset generation, lazy loading, prevents CLS |
| Font loading | CDN links with font-display | next/font | Eliminates FOUT/FOIT, automatic subsetting, preloading, self-hosting |
| Robots.txt | Static public file | app/robots.ts | Dynamic based on environment, type-safe, includes sitemap reference |
| Open Graph images | Manual image generation | next/og (optional) | Dynamic OG images with ImageResponse API, automatic sizing |

**Key insight:** Next.js 14+ App Router has first-class SEO support built-in. Using external libraries (next-seo, react-helmet) for App Router is an anti-pattern that misses performance optimizations and newer features.

## Common Pitfalls

### Pitfall 1: Rendering Gap (Client-Side Hydration Issues)

**What goes wrong:** Critical content rendered only on client-side, invisible to search crawlers
**Why it happens:** Using client components for main content, accessing window object without checks
**How to avoid:**
- Keep main content in Server Components
- Use `'use client'` only for interactive elements
- Check `typeof window !== 'undefined'` before accessing browser APIs
**Warning signs:**
- Blank view source on key pages
- Google Search Console shows missing content
- Lighthouse shows high CLS from layout shifts

**2026 Context:** Googlebot Mobile (primary crawler) has a rendering budget; sites that rely heavily on JS execution get deprioritized.

### Pitfall 2: Missing or Incorrect metadata.metadataBase

**What goes wrong:** Open Graph images and canonical URLs generate incorrect absolute URLs
**Why it happens:** Forgetting to set `metadataBase` in root layout
**How to avoid:**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jongerton.com'),
  // ... other metadata
}
```
**Warning signs:**
- Social media cards show broken images
- Twitter Card Validator fails
- Relative URLs in Open Graph tags

### Pitfall 3: Image Component Without sizes Prop

**What goes wrong:** Next.js generates minimal srcset (1x, 2x only), missing responsive optimization
**Why it happens:** Not understanding how `sizes` drives srcset generation
**How to avoid:**
- Always provide `sizes` for responsive images
- Use `sizes="100vw"` for full-width images
- Use media query format for grid layouts: `sizes="(max-width: 768px) 100vw, 50vw"`
**Warning signs:**
- Large images on mobile devices
- Poor Lighthouse performance score
- High LCP (>2.5s)

### Pitfall 4: Leaving noindex in Production

**What goes wrong:** Site completely blocked from search engine indexing
**Why it happens:** Setting `robots: { index: false }` during development and forgetting to change for production
**How to avoid:**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: true,
  },
}
```
**Warning signs:**
- Zero pages indexed in Google Search Console
- No organic search traffic
- "noindex detected" warnings

### Pitfall 5: JSON-LD XSS Vulnerability

**What goes wrong:** Unescaped user content in JSON-LD causes script injection
**Why it happens:** Using `dangerouslySetInnerHTML` with unsanitized `JSON.stringify()`
**How to avoid:**
```typescript
// ALWAYS sanitize <
dangerouslySetInnerHTML={{
  __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
}}
```
**Warning signs:**
- Security audit warnings
- Broken schema validation
- Script tags visible in rendered HTML

### Pitfall 6: Priority Prop Misuse

**What goes wrong:** Multiple images marked with `priority`, defeating lazy loading benefits
**Why it happens:** Adding `priority` to all images or none
**How to avoid:**
- Use `priority` ONLY for LCP element (typically hero image)
- Remove `priority` from below-fold images
- Let default lazy loading handle everything else
**Warning signs:**
- Slow initial page load
- High TTFB
- Poor mobile performance

### Pitfall 7: Missing Speakable Schema on FAQ

**What goes wrong:** FAQ content not optimized for AI assistants and voice search
**Why it happens:** Not knowing about speakable markup
**How to avoid:**
- Add FAQPage schema to services page
- Include speakable markup on question/answer pairs
- Keep answers concise (20-30 seconds read time)
**Warning signs:**
- Low visibility in AI search results
- Missing from voice assistant responses
- Zero citations in AI overviews

### Pitfall 8: Analytics Script Blocking Render

**What goes wrong:** Google Analytics blocks page rendering, hurting INP/FCP
**Why it happens:** Adding gtag.js directly to `<head>` or using old patterns
**How to avoid:**
- Use `@next/third-parties/google` GoogleAnalytics component
- Loads after hydration automatically
- Never add scripts directly to `<Script>` without strategy
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```
**Warning signs:**
- Lighthouse flags "Reduce unused JavaScript"
- High INP (>200ms)
- Poor mobile performance score

### Pitfall 9: Forgetting next-aeo Post-Build

**What goes wrong:** llms.txt file not generated or outdated
**Why it happens:** Running next-aeo manually, not integrated into build pipeline
**How to avoid:**
```json
// package.json
{
  "scripts": {
    "build": "next build && next-aeo"
  }
}
```
**Warning signs:**
- 404 on /llms.txt
- AI search engines can't discover site
- No citations in ChatGPT/Perplexity

### Pitfall 10: Missing Alternates for Multi-Language

**What goes wrong:** Search engines can't discover language variants
**Why it happens:** Not using `alternates.languages` in metadata
**How to avoid:**
```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://jongerton.com',
    languages: {
      'en-US': 'https://jongerton.com/en',
      'es-ES': 'https://jongerton.com/es',
    },
  },
}
```
**Warning signs:**
- Wrong language pages ranking in regional searches
- Duplicate content penalties
- Missing hreflang tags

## Code Examples

Verified patterns from official sources:

### Complete Root Layout with SEO Optimizations

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { WebVitals } from './_components/web-vitals'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jongerton.com'),
  title: {
    template: '%s | Jon Gerton Web Design',
    default: 'Jon Gerton - Professional Web Design & Development',
  },
  description: 'Professional WordPress websites starting at $500. Custom designs, responsive layouts, and expert development services.',
  keywords: ['web design', 'WordPress', 'freelance', 'web development', 'portfolio'],
  authors: [{ name: 'Jon Gerton', url: 'https://jongerton.com' }],
  creator: 'Jon Gerton',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jongerton.com',
    siteName: 'Jon Gerton Web Design',
    title: 'Jon Gerton - Professional Web Design & Development',
    description: 'Professional WordPress websites starting at $500',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Jon Gerton Web Design',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jon Gerton - Professional Web Design & Development',
    description: 'Professional WordPress websites starting at $500',
    creator: '@yourusername',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <WebVitals />
        {children}
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
```

**Source:** [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### Dynamic robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jongerton.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

**Source:** [Next.js robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)

### Complete Schema Markup Example

```typescript
// app/_components/schema/home-schemas.tsx
import { WithContext, LocalBusiness, Person, Service } from 'schema-dts'

export function HomeSchemas() {
  const business: WithContext<LocalBusiness> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Jon Gerton Web Design',
    image: 'https://jongerton.com/logo.png',
    '@id': 'https://jongerton.com',
    url: 'https://jongerton.com',
    telephone: '+1-555-555-5555',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'City',
      addressRegion: 'ST',
      postalCode: '12345',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [
      'https://www.linkedin.com/in/yourprofile',
      'https://github.com/yourusername',
    ],
  }

  const person: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jon Gerton',
    jobTitle: 'Web Designer & Developer',
    url: 'https://jongerton.com',
    image: 'https://jongerton.com/profile.jpg',
    sameAs: [
      'https://www.linkedin.com/in/yourprofile',
      'https://github.com/yourusername',
    ],
  }

  const service: WithContext<Service> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Design',
    provider: {
      '@type': 'Person',
      name: 'Jon Gerton',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Design Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'WordPress Website Design',
            description: 'Custom WordPress websites starting at $500',
          },
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(business).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(service).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}
```

**Source:** [Schema.org LocalBusiness](https://schema.org/LocalBusiness)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-seo package | Metadata API (built-in) | Next.js 13.2 (2023) | Better performance, automatic optimization, App Router support |
| FID metric | INP metric | 2024 | Measures all interactions, not just first; stricter threshold (<200ms) |
| Manual font loading | next/font | Next.js 13 (2022) | Eliminates FOUT/FOIT, 200-500ms FCP improvement |
| External image CDN | next/image (built-in) | Next.js 10+ (2020, refined 2024) | Automatic WebP/AVIF, lazy loading, prevents CLS |
| Traditional SEO only | SEO + AEO | 2024-2026 | Must optimize for AI answer engines (ChatGPT, Perplexity, etc.) |
| Manual robots.txt | app/robots.ts | Next.js 13.3 (2023) | Dynamic, type-safe, environment-aware |
| Manual sitemap.xml | app/sitemap.ts | Next.js 13.3 (2023) | Auto-generated, includes dynamic routes |
| priority prop | preload prop | Next.js 16 (2026) | More explicit preloading behavior |
| Script component strategy | @next/third-parties | Next.js 14 (2024) | Optimized third-party scripts, better DX |

**Deprecated/outdated:**
- **next-seo package:** Doesn't support App Router Metadata API, misses streaming metadata
- **react-helmet:** Client-side only, doesn't work with App Router
- **FID metric:** Replaced by INP as Core Web Vital in 2024
- **Manual font-display CSS:** Use next/font instead for automatic optimization
- **quality prop open access:** Next.js 16 requires whitelisted qualities for security
- **Google PageSpeed Insights only:** Must track real user metrics via Vercel Analytics or CrUX

## Open Questions

Things that couldn't be fully resolved:

1. **Speakable Schema Adoption**
   - What we know: Currently beta, US-only, Google Assistant devices, requires News Publisher status for full features
   - What's unclear: Timeline for wider availability, whether to invest heavily now or wait
   - Recommendation: Implement for FAQ pages (low effort, future-proof), but don't expect immediate impact. AI systems increasingly use speakable hints even outside official program.

2. **next-aeo Configuration Options**
   - What we know: Runs post-build, generates llms.txt automatically, analyzes build output
   - What's unclear: Configuration options for customizing output, excluding certain pages, adding custom summaries
   - Recommendation: Use with defaults, review generated llms.txt, manually edit if needed (document that it's regenerated on each build)

3. **Optimal Image Quality Settings**
   - What we know: Next.js 16 requires whitelisted qualities, default is 75
   - What's unclear: Best quality values for portfolio site (balancing visual quality vs. performance)
   - Recommendation: Use [25, 50, 75, 90] for configuration, 75 for most images, 90 for hero/portfolio images where quality matters

4. **Mobile Testing Requirements**
   - What we know: Need to test on real iOS and Android devices
   - What's unclear: Minimum device/browser coverage needed for "displays correctly" success criteria
   - Recommendation: Test on at least iOS Safari (latest), Chrome Android (latest), and use BrowserStack/Sauce Labs for broader coverage if available. Focus on layout integrity, not pixel-perfection.

## Sources

### Primary (HIGH confidence)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Complete metadata field reference
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Official implementation patterns
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - Complete Image API reference
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Dynamic sitemap generation
- [Next.js Analytics Guide](https://nextjs.org/docs/app/guides/analytics) - Web Vitals measurement
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - next/font API
- [Next.js robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - Dynamic robots generation
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness) - Official schema definition
- [Google Local Business Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business) - Google's requirements
- [Google Speakable Markup](https://developers.google.com/search/docs/appearance/structured-data/speakable) - Official beta documentation

### Secondary (MEDIUM confidence)
- [next-aeo Introduction](https://www.tryprofound.com/blog/next-aeo) - Package purpose and usage (verified via npm)
- [schema-dts npm](https://www.npmjs.com/package/schema-dts) - Official Google package, 325k+ weekly downloads
- [@next/third-parties](https://nextjs.org/docs/app/guides/third-party-libraries) - Official Next.js package
- [Calendly UTM Tracking](https://help.calendly.com/hc/en-us/articles/1500005575121-How-to-track-conversions-with-UTM-parameters) - Official Calendly docs
- [Next.js SEO Guide 2026](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition) - Current best practices (verified with official docs)
- [AEO Guide 2026](https://salespeak.ai/blog/what-is-aeo-answer-engine-optimization-2026) - Answer Engine Optimization overview
- [Next.js Performance Guide 2026](https://www.sujalbuild.in/blog/nextjs-seo-performance-guide) - Core Web Vitals optimization

### Tertiary (LOW confidence - requires validation)
- [llms.txt explained](https://www.tacmind.com/blog/llms-txt) - Community guide (concepts verified via official next-aeo)
- [Core Web Vitals 2026](https://www.djamware.com/post/68d9f3ae8e05e97a4b21c7cd/improve-core-web-vitals-in-nextjs-apps) - Performance optimization (metrics verified via Google docs)
- [Next.js SEO Pitfalls](https://focusreactive.com/typical-next-js-seo-pitfalls-to-avoid-in-2024/) - Common mistakes (patterns verified)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries from official Next.js ecosystem or Google-maintained (schema-dts)
- Architecture: HIGH - Patterns from official Next.js documentation and Schema.org specs
- Pitfalls: MEDIUM-HIGH - Mix of official documentation warnings and community-verified patterns

**Research date:** 2026-02-04
**Valid until:** 2026-04-04 (60 days - stable ecosystem, but SEO/AEO landscape evolving with AI)

**Key considerations for planning:**
1. Existing project already uses Inter font with next/font/google - ✅ foundational optimization in place
2. Next.js 16.1.6 installed - latest version with all features needed
3. No SEO libraries currently installed - clean slate for proper implementation
4. Vercel deployment mentioned in requirements - Vercel Analytics will work out-of-box
5. Convex backend - can fetch dynamic content for sitemap generation
6. react-calendly already installed - UTM tracking can be added to existing integration
