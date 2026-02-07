# Phase 19: Launch Prep + Tech Debt - Research

**Researched:** 2026-02-07
**Domain:** Next.js production launch readiness (SEO, analytics, OG images)
**Confidence:** HIGH

## Summary

Phase 19 prepares the site for public launch by completing SEO/analytics infrastructure, creating a default OG image, and cleaning up technical debt. The primary technical domains are Next.js metadata system (OG image fallback hierarchy), Google Analytics 4 custom event tracking, Vercel Analytics integration, robots.txt/sitemap configuration, and Lighthouse SEO auditing.

The standard approach for Next.js 16 App Router is to use file-based metadata conventions (opengraph-image.tsx in app directory) for default OG images, official @next/third-parties/google for GA4 integration, @vercel/analytics/react for Web Vitals monitoring, and dynamic route handlers for robots.txt and sitemap.xml. The site already has these foundations in place from Phase 17 (blog OG images) and Phase 5 (sitemap/robots), so this phase extends existing patterns rather than introducing new infrastructure.

**Primary recommendation:** Use dynamic ImageResponse for default OG image (matching existing blog pattern), extend existing GA4 integration with custom events via gtag(), add Vercel Analytics component to layout, update robots.ts to restrict only /admin, verify sitemap includes all routes, delete orphaned HeroSection component, and run Lighthouse audit for verification only (site already has excellent Core Web Vitals).

## Standard Stack

The established libraries/tools for Next.js production launch readiness:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/og (ImageResponse) | Next.js 14+ built-in | Dynamic OG image generation | Official Next.js API, supports JSX/CSS, edge runtime, no external dependencies |
| @next/third-parties/google | Next.js package | GA4 integration | Official Google Analytics integration, optimized loading, App Router support |
| @vercel/analytics/react | Latest | Web Vitals tracking | Official Vercel package, free on hobby tier, zero-config Core Web Vitals monitoring |
| next/web-vitals | Next.js built-in | Client-side performance reporting | Built-in hook for reporting LCP/CLS/INP/FCP/TTFB to analytics |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lighthouse CLI | Latest | SEO/performance auditing | Pre-launch verification, CI/CD quality gates, debugging performance regressions |
| knip | Latest | Unused code detection | Finding orphaned components, unused exports, dead dependencies |
| next-unused | Latest | Next.js-specific dead code finder | Simpler alternative to knip for finding unreferenced files |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ImageResponse | Static PNG file | Static PNG is faster (no runtime generation) but requires design tool, not dynamic, harder to maintain consistency across routes |
| @next/third-parties/google | Manual gtag script | Manual script gives more control but loses official optimization (delayed loading, hydration timing) |
| @vercel/analytics | Only GA4 | GA4 provides richer data but Vercel Analytics is simpler for Core Web Vitals and works without configuration |
| knip | Manual code review | Manual review is thorough but time-consuming and error-prone for large codebases |

**Installation:**
```bash
bun add @vercel/analytics @next/third-parties
# Lighthouse CLI for auditing (dev dependency)
bun add -D lighthouse
# Optional: dead code detection
bun add -D knip
```

## Architecture Patterns

### Recommended OG Image Structure
```
app/
├── opengraph-image.tsx              # Default site-wide OG image
├── (home)/
│   └── page.tsx                     # Uses default from root
├── blog/
│   ├── page.tsx                     # Uses default from root
│   └── [slug]/
│       └── opengraph-image.tsx      # Overrides default (already exists)
└── services/
    └── page.tsx                     # Uses default from root
```

**Fallback hierarchy:** More specific route segments override parent segments. Blog posts have custom OG images (Phase 17), all other pages fall back to root-level opengraph-image.tsx.

### Pattern 1: Dynamic OG Image with ImageResponse
**What:** Generate OG images at runtime using JSX and inline styles, following the existing pattern from blog post OG images.

**When to use:** For default site-wide OG images that need consistency with existing dynamic images, or when image content includes dynamic data (site name, tagline).

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #003F75 0%, #2884BD 100%)",
          color: "white",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600 }}>
          Jon Gerton
        </div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.9 }}>
          Custom Websites for $500
        </div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.7 }}>
          jpgerton.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
```

**Critical limitations:**
- ImageResponse only supports flexbox and absolute positioning (no CSS Grid)
- 500KB bundle limit including fonts, images, and code
- Only inline styles (no Tailwind, no CSS variables)
- Only ttf, otf, woff font formats supported

### Pattern 2: GA4 Custom Events with gtag
**What:** Track user interactions (CTA clicks, form submissions, scroll depth) using gtag() function from @next/third-parties/google.

**When to use:** For all meaningful user actions that indicate engagement or conversion intent.

**Example:**
```typescript
// Source: https://developers.google.com/analytics/devguides/collection/ga4/events
// components/analytics/track-cta-click.tsx
"use client";

export function trackCTAClick(buttonName: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      button_name: buttonName,
      page_location: window.location.href,
    });
  }
}

// components/portfolio/cta-button.tsx
<button onClick={() => trackCTAClick("book_a_call")}>
  Book a Call
</button>
```

**Event naming rules:**
- Start with letter, only letters/numbers/underscores, no spaces
- Use lowercase snake_case (e.g., form_submit, cta_click)
- Max 25 parameters per event
- Parameter name max 40 chars, value max 100 chars

### Pattern 3: Vercel Analytics + GA4 Dual Setup
**What:** Use both Vercel Analytics (privacy-first, Core Web Vitals) and Google Analytics 4 (user behavior, conversions) together.

**When to use:** When you need both real-time performance monitoring and comprehensive user behavior analytics.

**Example:**
```typescript
// Source: https://vercel.com/docs/analytics
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebVitals } from "@/components/analytics/web-vitals";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals /> {/* Reports Web Vitals to both Vercel and GA4 */}
        {children}
        <Analytics /> {/* Vercel Analytics: page views, basic metrics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}

// components/analytics/web-vitals.tsx
"use client";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to GA4 if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });
  return null;
}
```

**Complementary purposes:**
- Vercel Analytics: Basic page views, Core Web Vitals, privacy-friendly, zero-config
- GA4: Custom events, user behavior, traffic sources, demographics, conversion funnels

### Pattern 4: Dynamic Robots.txt with Route Handler
**What:** Use app/robots.ts to generate robots.txt dynamically, allowing environment-based configuration.

**When to use:** Always (official Next.js pattern for App Router).

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://jpgerton.com"}/sitemap.xml`,
  };
}
```

**Current state:** Project already has app/robots.ts that disallows /admin/, /api/, /login. Update to only disallow /admin/ per CONTEXT.md decision.

### Anti-Patterns to Avoid
- **Root layout metadata without metadataBase:** Causes relative OG image URLs to fail in production. Always set metadataBase in root layout.
- **Static robots.txt in public/:** Deprecated pattern. Use app/robots.ts for App Router projects.
- **Blocking /_next/ in robots.txt:** Prevents crawlers from loading JS/CSS, breaks proper indexing.
- **Using window.gtag without type checking:** Causes runtime errors in SSR. Always check `typeof window !== "undefined" && window.gtag`.
- **Barrel file exports (index.ts) for large components:** Forces loader to process unused modules, adds 200-800ms overhead. Import from specific paths.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image generation | Custom image service with canvas API | next/og ImageResponse | 500KB bundle limit enforces optimization, edge runtime for speed, official API with ongoing support |
| Scroll depth tracking | Custom IntersectionObserver tracking | GA4 Enhanced Measurement (built-in 90% scroll) or Google Tag Manager | GA4 tracks 90% scroll by default, GTM provides visual interface for custom thresholds, battle-tested across billions of pageviews |
| Dead code detection | Manual grep/find for unused files | knip or next-unused | Parses AST to find unused exports, handles dynamic imports, catches dependencies that appear used but aren't |
| Web Vitals reporting | Custom PerformanceObserver setup | next/web-vitals useReportWebVitals hook | Handles all metric types (LCP/CLS/INP/FCP/TTFB), normalizes values, official Next.js implementation |
| Cookie consent banner | Custom modal with localStorage | Not needed for US audience with anonymized IPs | US privacy laws don't require consent for anonymized analytics, GDPR only applies to EU users |

**Key insight:** Next.js built-in APIs (ImageResponse, useReportWebVitals, metadata conventions) are optimized for edge runtime, automatic caching, and build-time generation. Custom solutions miss these optimizations and require ongoing maintenance as platform evolves.

## Common Pitfalls

### Pitfall 1: ImageResponse Bundle Size Exceeded
**What goes wrong:** Deployment fails with cryptic "Function payload is too large" error when ImageResponse exceeds 500KB including fonts and images.

**Why it happens:** Embedding custom fonts or large logo images inline pushes bundle over limit. Developers assume file size limits only apply to output PNG, not input assets.

**How to avoid:**
- Use system fonts (sans-serif, serif) when possible
- Fetch images from public/ directory at runtime instead of embedding
- Keep fonts minimal (one weight per font family)
- Use woff format over ttf/otf for smaller size

**Warning signs:**
- Custom font files over 100KB each
- Multiple font weights embedded in ImageResponse
- High-resolution logo images embedded inline
- Deployment succeeds locally but fails on Vercel

### Pitfall 2: GA4 Custom Parameters Not Visible
**What goes wrong:** Custom event parameters (button_name, form_name) appear in DebugView but not in standard reports or explorations.

**Why it happens:** GA4 requires explicit registration of custom parameters as custom dimensions before they appear in reports. DebugView shows all data, but reports only show registered dimensions.

**How to avoid:**
- Navigate to Admin > Custom Definitions in GA4
- Create custom dimensions for each parameter (button_name, form_name, etc.)
- Wait 24-48 hours for data to populate after registration
- Use recommended parameter names when possible (GA4 auto-registers these)

**Warning signs:**
- Events appear in DebugView but not in standard reports
- Exploration reports show (not set) for custom parameters
- Custom parameters missing from dimension dropdown

### Pitfall 3: Metadata Inheritance Overwrites Unexpectedly
**What goes wrong:** Child route defines openGraph.title, expecting to inherit parent's openGraph.description and openGraph.images, but entire openGraph object is replaced.

**Why it happens:** Next.js metadata uses shallow merging. When a child segment defines a nested object like openGraph, it completely replaces the parent's object rather than merging fields.

**How to avoid:**
- Extract shared metadata into a separate file and spread it in child routes
- Always define complete openGraph objects at each level
- Don't assume field-level inheritance for nested objects

**Example of correct pattern:**
```typescript
// app/shared-metadata.ts
export const defaultOG = {
  images: ["/og-image.png"],
  siteName: "Jon Gerton",
};

// app/blog/page.tsx
import { defaultOG } from "../shared-metadata";

export const metadata = {
  openGraph: {
    ...defaultOG,  // ✅ Explicit spread
    title: "Blog", // ✅ Override specific field
  },
};
```

**Warning signs:**
- OG images missing on specific routes
- Social sharing shows incomplete metadata
- Parent metadata fields disappearing on child routes

### Pitfall 4: Orphaned Component Still in Barrel Export
**What goes wrong:** Deleting a component file but leaving its export in index.ts causes build failures or runtime errors.

**Why it happens:** Barrel files (index.ts) centralize exports but aren't automatically updated when files are deleted. Build succeeds if no imports exist, but fails when someone tries to import the deleted component.

**How to avoid:**
- Check barrel exports (index.ts) when deleting components
- Remove export line from barrel file
- Search codebase for remaining imports of deleted component
- Use knip or next-unused to find orphaned exports proactively

**Warning signs:**
- Build errors about missing modules
- Components appearing in autocomplete but failing at runtime
- Barrel export count doesn't match component file count

### Pitfall 5: noindex Still Active in Production
**What goes wrong:** Site deploys to production but remains hidden from search engines because noindex meta tag is still present.

**Why it happens:** Developers set noindex during development to prevent staging/preview indexing, then forget to remove it for production launch.

**How to avoid:**
- Use environment-based robots metadata in root layout
- Check production HTML for <meta name="robots"> tag
- Run Lighthouse SEO audit which flags noindex issues
- Verify in Google Search Console that site is indexable

**Example of correct pattern:**
```typescript
// app/layout.tsx
export const metadata = {
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: true,
  },
};
```

**Warning signs:**
- Google Search Console shows "Page indexed without content"
- Site not appearing in search results weeks after launch
- HTML contains <meta name="robots" content="noindex">
- Lighthouse SEO audit score below 90

## Code Examples

Verified patterns from official sources:

### Default OG Image with ImageResponse
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #003F75 0%, #2884BD 100%)",
          color: "white",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600, marginBottom: 20 }}>
          Jon Gerton
        </div>
        <div style={{ fontSize: 36, fontWeight: 500 }}>
          Custom Websites for $500
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 40,
            opacity: 0.7,
          }}
        >
          jpgerton.com
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### GA4 Custom Event Tracking
```typescript
// Source: https://developers.google.com/analytics/devguides/collection/ga4/events
// lib/analytics.ts
export function trackCTAClick(buttonName: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      button_name: buttonName,
      page_location: window.location.href,
    });
  }
}

export function trackFormSubmit(formName: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "form_submit", {
      form_name: formName,
    });
  }
}

// components/portfolio/cta-button.tsx (example usage)
import { trackCTAClick } from "@/lib/analytics";

<button onClick={() => trackCTAClick("book_a_call")}>
  Book a Call
</button>
```

### Robots.txt with Sitemap Reference
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jpgerton.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Dynamic Sitemap with Blog Posts
```typescript
// Source: Project already has this pattern in app/sitemap.ts
// Verified against https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jpgerton.com";

  // Static pages
  const staticPages = [
    { url: BASE_URL, priority: 1, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/services`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/projects`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/about`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: "yearly" as const },
  ];

  // Dynamic blog posts
  let blogPages = [];
  try {
    const posts = await fetchQuery(api.blogPosts.listPublished, {});
    blogPages = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt
        ? new Date(post.publishedAt)
        : new Date(post._creationTime),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    console.warn("Sitemap: Could not fetch blog posts from Convex");
  }

  return [...staticPages, ...blogPages];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static public/robots.txt | Dynamic app/robots.ts | Next.js 13 App Router | Environment-based configuration, supports multiple user agents, cleaner deployment |
| Manual gtag script in _document | @next/third-parties/google | Next.js 14 | Official integration, optimized loading (delayed until hydration), automatic type definitions |
| Custom OG image service (Cloudinary, Imgix) | next/og ImageResponse | Next.js 13.3 | No external dependencies, edge runtime generation, automatic caching, 500KB bundle forces optimization |
| Static OG images in public/ | Dynamic opengraph-image.tsx | Next.js 13 | Data-driven images, consistent branding, easier updates (change code not design files) |
| robots: "noindex" hardcoded | Environment-based index setting | Ongoing best practice | Prevents accidental noindex in production, allows preview/staging to remain hidden |
| Separate scroll tracking script | GA4 Enhanced Measurement | GA4 launch (2020) | Built-in 90% scroll tracking, no custom code needed, standard implementation |

**Deprecated/outdated:**
- Static robots.txt in public/ directory (use app/robots.ts instead)
- pages/_document.tsx for analytics scripts (use app/layout.tsx and @next/third-parties)
- Custom canvas-based OG image generation (use ImageResponse API)
- Universal Analytics (UA) / gtag.js v1 (GA4 is current, UA sunset July 2023)

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal scroll depth thresholds for blog engagement**
   - What we know: GA4 tracks 90% scroll by default, GTM can add custom thresholds
   - What's unclear: Whether 90% is sufficient or if 25%/50%/75% provide better engagement signals
   - Recommendation: Start with GA4's default 90% scroll, add custom thresholds only if data shows need (avoid premature optimization)

2. **Google Search Console submission timing**
   - What we know: Sitemap can be submitted immediately after launch, Google crawls submitted sitemaps quickly
   - What's unclear: Whether to submit before launch (with noindex active) or after launch
   - Recommendation: Submit sitemap after removing noindex in production to avoid confusion with indexing status

3. **ImageResponse file size for social platforms**
   - What we know: ImageResponse generates PNG that can be "horribly heavy" and "unusable in apps like WhatsApp"
   - What's unclear: Specific file size limits for WhatsApp, LinkedIn, Twitter, Facebook
   - Recommendation: Generate default OG image, test file size, optimize if over 200KB (general guideline for social platforms)

4. **Read-through rate tracking implementation**
   - What we know: Can track scroll depth at various percentages using GTM
   - What's unclear: Whether to implement now or defer to future phase (CONTEXT.md mentions it but roadmap doesn't require it)
   - Recommendation: Implement basic 90% scroll tracking now (GA4 default), defer custom read-through percentage tracking to post-launch optimization

## Sources

### Primary (HIGH confidence)
- [Next.js Official Docs: opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - File conventions, size limits, route override patterns
- [Next.js Official Docs: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Metadata inheritance, shallow merging behavior
- [Next.js Official Docs: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - Dynamic robots configuration, user agent rules
- [Next.js Official Docs: ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response) - CSS limitations, bundle size limit, caching
- [Google Analytics Developers: Set up events](https://developers.google.com/analytics/devguides/collection/ga4/events) - Event structure, gtag syntax, placement requirements
- [Vercel Web Analytics](https://vercel.com/docs/analytics) - Free tier capabilities, Core Web Vitals tracking

### Secondary (MEDIUM confidence)
- [Google Analytics GA4 Implementation Guide for Next.js 16](https://medium.com/@aashari/google-analytics-ga4-implementation-guide-for-next-js-16-a7bbf267dbaa) - Custom events, @next/third-parties usage, verified with official docs
- [How to Configure SEO in Next.js 16](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16) - Robots/sitemap best practices, verified with Next.js docs
- [Scroll Tracking with Google Analytics 4](https://www.analyticsmania.com/post/scroll-tracking-with-google-analytics-4-and-google-tag-manager/) - 90% default scroll, GTM custom thresholds
- [Generate Dynamic OG Images with Next.js 16](https://makerkit.dev/blog/tutorials/dynamic-og-image) - ImageResponse patterns, edge runtime, caching strategies
- [Vercel Analytics vs Google Analytics comparison](https://www.jigz.dev/blogs/google-analytics-vs-vercel-analytics) - When to use both, complementary purposes

### Tertiary (LOW confidence - marked for validation)
- [next-unused GitHub](https://github.com/pacocoursey/next-unused) - Tool exists but no verification of current maintenance status or Next.js 16 compatibility
- [ImageResponse file size issues discussion](https://github.com/vercel/next.js/discussions/60366) - Community report of "horribly heavy" PNG files, no official resolution or file size limits documented

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js and Google packages, verified with documentation
- Architecture: HIGH - Patterns verified against official Next.js docs and existing project code
- Pitfalls: HIGH - Verified through official docs warnings and community discussions, cross-referenced with Next.js GitHub issues

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable domain with mature APIs)
