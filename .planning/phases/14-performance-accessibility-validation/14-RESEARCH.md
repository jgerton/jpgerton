# Phase 14: Performance & Accessibility Validation - Research

**Researched:** 2026-02-06
**Domain:** Automated accessibility testing, performance validation, WCAG 2.1 AA compliance
**Confidence:** HIGH

## Summary

This phase validates that Phases 8-13 design polish work maintains excellent performance and meets WCAG 2.1 AA accessibility standards. The research confirms an automated-first approach is viable, with axe-core catching 57% of WCAG issues and Lighthouse providing comprehensive performance and accessibility audits. The project already has strong foundations in place: Web Vitals tracking, semantic HTML structure, focus ring transitions, and CSS-only animations. The validation scope is narrowed to Chrome + Safari browsers, Chrome DevTools responsive testing, and an 85+ Lighthouse floor (not 90+) to protect design over scores.

Key findings show that automated tools have clear limitations (Lighthouse catches only 30-40% of accessibility issues), but the user's scoping decisions (no full keyboard walkthrough, no screen reader testing, automated-first) make this acceptable. The priority is catching regressions from Phases 11-13 in areas already validated in Phases 8-10 (contrast, semantic HTML, ARIA usage).

**Primary recommendation:** Use Lighthouse CI in GitHub Actions for continuous monitoring, Chrome DevTools for manual verification of flagged issues, WebAIM Contrast Checker for dark mode re-verification, and Next.js Image priority prop for LCP optimization. Fix all accessibility issues, investigate performance issues only if scores drop below 85.

## Standard Stack

The established libraries/tools for accessibility and performance validation:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Lighthouse | 11+ (Chrome) | Performance, accessibility, SEO audits | Built into Chrome DevTools, industry standard for Core Web Vitals, automated WCAG checks |
| axe-core | 4.8+ | Accessibility testing engine | Zero false positives, 57% WCAG coverage, used by Lighthouse under the hood |
| Chrome DevTools | Latest | Responsive testing, network throttling, accessibility tree inspection | Native browser tooling, no setup required, sufficient for DevTools-only responsive testing |
| WebAIM Contrast Checker | Web tool | WCAG AA contrast verification | Authoritative source for contrast ratios, free, trusted by accessibility community |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @lhci/cli | 0.13+ | Lighthouse CI automation | Continuous performance monitoring in GitHub Actions |
| web-vitals | Built-in Next.js | Real User Monitoring (RUM) | Already implemented in project, tracks LCP/CLS/INP in production |
| next/image | 16+ | Image optimization, LCP improvements | Already in use, verify priority prop on hero images |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| axe-core | @axe-core/react | React 18+ incompatibility - package deprecated by Deque, not recommended for modern React |
| Lighthouse CI | Manual Lighthouse runs | CI automation prevents regressions, tracks scores over time, but adds CI time |
| Real devices | Chrome DevTools responsive mode | User decision: DevTools sufficient for this project's needs |
| Firefox/Edge | Chrome + Safari only | User decision: narrower browser matrix, sufficient for target audience |

**Installation:**
```bash
# Lighthouse CI (if adding CI automation - Claude's discretion)
bun add -D @lhci/cli

# No additional runtime dependencies needed - Lighthouse and DevTools are browser-native
```

## Architecture Patterns

### Recommended Validation Workflow

```
1. Automated Audit (CI or local)
   ├── Run Lighthouse on all pages
   ├── Check scores against 85+ threshold
   └── Flag violations for manual verification

2. Manual Verification (Chrome DevTools)
   ├── Verify flagged contrast issues in both light/dark mode
   ├── Spot-check keyboard tab order on flagged pages
   └── Inspect accessibility tree for flagged ARIA issues

3. Cross-Browser Check (Safari via automated heuristics)
   ├── Document known Safari CSS quirks to check
   ├── Verify -webkit- prefixes exist where needed
   └── Flag any unverifiable issues for user review

4. Fix and Re-audit
   ├── Subtle fixes: apply immediately (darker border, etc.)
   ├── Major visual changes: flag for user review first
   └── Re-run Lighthouse to confirm fix
```

### Pattern 1: Lighthouse CI Integration (Claude's Discretion)

**What:** Automated Lighthouse runs in GitHub Actions on every PR, tracking scores over time.

**When to use:** If issues are found across multiple pages, CI automation prevents future regressions.

**Example:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: bun install
      - run: bun run build
      - run: bunx @lhci/cli autorun
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: "bun run start",
      url: ["http://localhost:3000", "http://localhost:3000/projects"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.85 }],
        "categories:seo": ["error", { minScore: 0.85 }],
      },
    },
  },
};
```

**Source:** [Lighthouse CI GitHub Actions with Next.js](https://dev.to/joerismits/ensure-your-nextjs-apps-performance-is-top-notch-with-lighthouse-ci-and-github-actions-4ne8)

### Pattern 2: Manual Lighthouse Audit (Always Applicable)

**What:** Run Lighthouse directly in Chrome DevTools on each page, review each category.

**When to use:** Always. This is the baseline for the phase.

**Steps:**
1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Select Desktop/Mobile, check all categories
4. Click "Analyze page load"
5. Review issues in Accessibility, Performance, SEO sections
6. Click through to axe-core rule descriptions for remediation guidance

### Pattern 3: Contrast Re-verification (Both Modes)

**What:** Re-check all text/UI contrast ratios in light and dark mode, even though Phases 8-10 did this work.

**When to use:** Always. User wants full re-verification to catch regressions from Phases 11-13.

**Example:**
```bash
# Pages to verify
- / (home)
- /projects
- /services
- /about
- /contact

# Elements to check (both modes)
- Body text: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- UI components (borders, icons): 3:1 minimum
- Interactive states (hover, focus, active)
```

**Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Pattern 4: Next.js Image Optimization for LCP

**What:** Verify hero and above-the-fold images use priority prop for preloading.

**When to use:** If LCP is above 2.5s, check image loading strategy first.

**Example:**
```tsx
// Hero image - should have priority
import Image from "next/image";

<Image
  src="/hero-image.jpg"
  alt="Descriptive text"
  width={1200}
  height={600}
  priority // Preloads, no lazy loading
  sizes="100vw"
/>

// Below-the-fold images - default lazy loading
<Image
  src="/project-thumb.jpg"
  alt="Project name"
  width={400}
  height={300}
  // No priority prop - lazy loads by default
/>
```

**Source:** [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

### Pattern 5: Safari CSS Compatibility Checks (Automated Heuristics)

**What:** Since no direct Safari access, check for known Safari quirks in code.

**When to use:** Always, as part of cross-browser validation.

**Checklist:**
```css
/* backdrop-filter - requires -webkit- prefix in Safari */
.element {
  -webkit-backdrop-filter: blur(10px); /* Safari */
  backdrop-filter: blur(10px); /* Standard */
  background-color: rgba(0, 0, 0, 0.5); /* Required for Safari */
}

/* CSS variables in -webkit- properties - NOT supported in Safari */
/* BAD: Will not work in Safari */
.element {
  -webkit-backdrop-filter: var(--blur-amount);
}

/* GOOD: Use fixed values with -webkit- prefix */
.element {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: var(--blur-amount); /* OK in standard property */
}
```

**Source:** [Safari backdrop-filter compatibility issues](https://github.com/mdn/browser-compat-data/issues/25914)

### Anti-Patterns to Avoid

- **Don't remove focus outlines without a visible replacement.** The project already has `*:focus-visible` with transition - preserve this.
- **Don't add ARIA where semantic HTML already works.** Lighthouse/axe-core will flag unnecessary ARIA. Trust "No ARIA is better than bad ARIA."
- **Don't chase 100 scores if design suffers.** User decision: 85+ floor, design wins above that threshold.
- **Don't test every breakpoint.** User decision: 375px, 768px, 1024px only.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contrast calculation | Custom HSL math | WebAIM Contrast Checker (web) or Chrome DevTools color picker | WCAG formula is complex, tools handle it correctly |
| Keyboard trap detection | Manual keyboard testing | Lighthouse automated checks | Lighthouse flags focus traps automatically |
| ARIA validation | Manual screen reader testing | axe-core rules | 90+ axe-core rules for ARIA, catches most issues |
| Core Web Vitals tracking | Custom performance observers | `web-vitals` library (already in project) | Google's official library, matches CrUX data |
| Image size optimization | Manual resizing | next/image (already in project) | Automatic responsive sizing, WebP/AVIF conversion |

**Key insight:** Accessibility and performance have mature, battle-tested tooling. Don't build custom solutions when axe-core, Lighthouse, and Next.js built-ins exist. The project already uses best-in-class tools (web-vitals, next/image) - leverage them.

## Common Pitfalls

### Pitfall 1: Assuming Lighthouse 100 = Fully Accessible

**What goes wrong:** Developers ship with Lighthouse 100 accessibility score, users still can't navigate the site with a keyboard or screen reader.

**Why it happens:** Lighthouse catches only 30-40% of accessibility issues. It can't test keyboard navigation flow, screen reader announcements, or complex interaction patterns.

**How to avoid:** Treat Lighthouse as a baseline, not a certification. The user's scoping decision (automated-first, no full manual testing) is acceptable for catching **regressions** in areas already validated in prior phases, but not for net-new accessibility work.

**Warning signs:** All Lighthouse checks pass, but keyboard tab order skips important elements, or focus gets trapped in modals.

### Pitfall 2: Dark Mode Contrast Assumptions

**What goes wrong:** Light text on dark background looks great, but fails WCAG AA contrast checks. Soft grays (#666 text on #1A1A1A background) are comfortable to read but below 4.5:1 ratio.

**Why it happens:** Designers optimize for aesthetics and assume dark mode automatically has high contrast. WCAG doesn't care about mode - same 4.5:1 ratio applies.

**How to avoid:** Re-verify every text/UI color pair in dark mode with WebAIM Contrast Checker. Don't trust eyeballing. The project's dark mode already passed in Phase 10, but Phases 11-13 may have introduced new colors or components.

**Warning signs:** Lighthouse flags "Elements must meet minimum color contrast ratio thresholds" in dark mode but not light mode.

### Pitfall 3: LCP Regression from New Images

**What goes wrong:** Hero images added in Phase 11 or 13 lazy load by default, pushing LCP above 2.5s.

**Why it happens:** next/image lazy loads everything by default unless you add `priority` prop. Developers forget this on above-the-fold images.

**How to avoid:** Audit all hero, banner, and above-the-fold images. Add `priority` prop if the image is visible without scrolling.

**Warning signs:** Lighthouse Performance score drops, LCP metric shows the hero image as the LCP element but loads late.

### Pitfall 4: Safari backdrop-filter with CSS Variables

**What goes wrong:** `backdrop-filter: blur(var(--blur-amount))` works in Chrome/Firefox but renders as solid background in Safari.

**Why it happens:** Safari requires `-webkit-` prefix for backdrop-filter, but doesn't support CSS variables in `-webkit-` properties. You must use fixed values.

**How to avoid:** Grep the codebase for `backdrop-filter` usage. If found, ensure `-webkit-backdrop-filter` exists with fixed values, not variables. Standard `backdrop-filter` can use variables.

**Warning signs:** Blurred glass effects work in Chrome DevTools but are reported as missing in Safari.

### Pitfall 5: Keyboard Focus Order Disrupted by Animations

**What goes wrong:** Staggered entrance animations (Phase 12) cause elements to become focusable before they're visible, confusing keyboard users.

**Why it happens:** Elements with `opacity: 0` can still receive keyboard focus. CSS animations don't affect focus order.

**How to avoid:** Verify keyboard tab order on pages with staggered animations (home page services section, project grid). If an element is focusable before visible, add `pointer-events: none` until animation completes.

**Warning signs:** Keyboard focus jumps to invisible elements, or elements receive focus before they fade in.

### Pitfall 6: Touch Target Size Below 44x44px

**What goes wrong:** Mobile users tap the wrong link or button because targets are too small. Lighthouse passes (24px minimum for Level AA), but user experience suffers.

**Why it happens:** WCAG 2.2 Level AA only requires 24x24px. Best practice is 44x44px for comfortable mobile interaction.

**How to avoid:** Spot-check interactive elements in Chrome DevTools responsive mode (375px width). Verify buttons, links, and icons have at least 44x44px clickable area (including padding).

**Warning signs:** User reports of mobile usability issues, buttons too close together.

## Code Examples

Verified patterns from official sources:

### Running Lighthouse Locally (Chrome DevTools)

```bash
# Open Chrome DevTools
# 1. Navigate to page (e.g., http://localhost:3400)
# 2. F12 to open DevTools
# 3. Click "Lighthouse" tab
# 4. Select "Desktop" or "Mobile"
# 5. Check all categories (Performance, Accessibility, Best Practices, SEO)
# 6. Click "Analyze page load"
# 7. Review violations, click through to axe-core rule descriptions
```

### Verifying Contrast in Both Modes (Chrome DevTools)

```bash
# Light mode contrast check
1. Chrome DevTools > Elements tab
2. Select element with text
3. Styles pane shows color value - click color square
4. DevTools shows contrast ratio and WCAG compliance
5. Adjust until "AA" badge appears

# Dark mode contrast check
1. Chrome DevTools > Elements tab > Styles pane
2. Click ".dark" class icon (or toggle class manually)
3. Verify contrast ratios again
4. Or use browser extension to toggle dark mode
```

**Source:** [Chrome DevTools color picker](https://developer.chrome.com/docs/devtools/accessibility/contrast)

### Semantic HTML Check (Current Project Pattern)

```tsx
// GOOD: Current project uses semantic HTML
<main className="min-h-screen bg-background">
  <HeroWithGradient />
  <SectionBackground variant="gradient">
    <section>
      <h2>Services</h2>
      <div className="grid">
        {/* Service cards */}
      </div>
    </section>
  </SectionBackground>
</main>

// BAD: Non-semantic divs
<div className="page">
  <div className="hero" />
  <div className="section">
    <div className="heading">Services</div>
    <div className="grid">
      {/* No semantic structure */}
    </div>
  </div>
</div>
```

**Current state:** Project already uses semantic HTML (`<main>`, `<section>`, likely `<nav>` in SiteNav). Verify this is consistent across all pages.

### Focus Ring Transition (Already Implemented)

```css
/* Current implementation in globals.css - GOOD */
*:focus-visible {
  transition: box-shadow var(--duration-fast) var(--ease-smooth);
}

/* Verify shadcn/ui components don't override this */
/* Check Button, Card, Link components for focus-visible styles */
```

**Source:** Project `app/globals.css` line 255

### Web Vitals Tracking (Already Implemented)

```tsx
// Current implementation - GOOD
// components/analytics/web-vitals.tsx
"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Logs in development, sends to GA in production
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vital] ${metric.name}: ${metric.value}`);
    }
    // Google Analytics integration already in place
  });
  return null;
}
```

**Current state:** Web Vitals tracking is already implemented and logs to console in development. Check console during manual testing to see real metrics.

**Source:** [Next.js Web Vitals documentation](https://nextjs.org/docs/pages/api-reference/functions/use-report-web-vitals)

### Chrome DevTools Responsive Testing Workflow

```bash
# Test mobile breakpoints (375px, 768px, 1024px)
1. Chrome DevTools > Toggle device toolbar (Ctrl+Shift+M)
2. Select "Responsive" from device dropdown
3. Enter width manually: 375px (iPhone SE)
4. Verify layout, touch targets, text readability
5. Repeat for 768px (tablet), 1024px (small laptop)

# Test network conditions
1. DevTools > Network tab > Throttling dropdown
2. Select "Slow 3G" or "Fast 3G"
3. Reload page, observe LCP timing
```

**Source:** [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FID (First Input Delay) | INP (Interaction to Next Paint) | March 2024 | Google officially replaced FID with INP in Core Web Vitals. INP measures responsiveness throughout page lifetime, not just first input. Thresholds: INP < 200ms (good), 200-500ms (needs improvement), > 500ms (poor). |
| Lighthouse 6.x scoring | Lighthouse 11.x scoring | 2023-2024 | Stricter accessibility scoring, more axe-core rules. Projects that passed with 100 before may now score lower. Re-audit after every Lighthouse update. |
| @axe-core/react | axe Developer Hub or direct axe-core | 2023 | @axe-core/react doesn't support React 18+. Deque deprecated the package. For React 18+ projects, use axe Developer Hub (paid) or run axe-core directly in tests (Playwright, Jest). |
| Manual contrast checks | Automated contrast in DevTools | Ongoing | Chrome DevTools color picker now shows WCAG AA/AAA compliance badges automatically. Faster than WebAIM Contrast Checker for spot checks. |

**Deprecated/outdated:**
- **FID metric:** Replaced by INP (March 2024). Update any documentation or thresholds.
- **@axe-core/react:** React 18+ incompatible. Don't install this package.
- **Lighthouse < 10:** Scoring algorithms changed. Always use latest Chrome stable for consistent results.

## Open Questions

Things that couldn't be fully resolved:

1. **Safari Verification Without Direct Access**
   - What we know: Safari requires `-webkit-` prefixes for backdrop-filter, doesn't support CSS variables in `-webkit-` properties, may have font rendering differences.
   - What's unclear: Actual rendering quality in current Safari (18.x) without real device or BrowserStack access.
   - Recommendation: Document known quirks to check via code inspection, flag any unverifiable issues in deliverable for user to test. User accepted this limitation in decisions.

2. **Lighthouse CI vs. Manual Audits**
   - What we know: Lighthouse CI adds GitHub Actions automation, tracks scores over time, prevents regressions. Setup is ~30 minutes. CI runs add 3-5 minutes per PR.
   - What's unclear: Whether the volume of issues found in this phase warrants CI automation, or if manual audits are sufficient.
   - Recommendation: Claude's discretion. If issues span multiple pages or are subtle (contrast regressions), recommend CI. If issues are isolated, manual audits are sufficient.

3. **Touch Target Size: 24px or 44px?**
   - What we know: WCAG 2.2 Level AA requires 24x24px. Industry best practice (Apple HIG, Material Design) recommends 44x44px. Research shows 44px reduces touch errors by 3x.
   - What's unclear: What threshold the user wants to enforce. Requirement A11Y-03 says "44x44px minimum per WCAG 2.2," but WCAG 2.2 actually says 24x24px for AA.
   - Recommendation: Flag for user review if issues are found. Propose 44x44px for primary CTAs, 24x24px acceptable for secondary actions.

4. **Staggered Animation Impact on Focus Order**
   - What we know: Phase 12 added staggered entrance animations (opacity: 0 -> 1). CSS animations don't affect DOM focus order.
   - What's unclear: Whether elements become keyboard-focusable before they're visible, causing confusion.
   - Recommendation: Test manually with keyboard (Tab key) on home page services section and project grid. If focus jumps to invisible elements, add `pointer-events: none` during animation, remove on completion.

## Sources

### Primary (HIGH confidence)
- [Lighthouse Accessibility Scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring) - Official Chrome DevTools documentation
- [axe-core by Deque](https://www.deque.com/axe/axe-core/) - Official axe-core documentation, zero false positives approach
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/) - Authoritative keyboard accessibility principles
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - Official Next.js documentation, priority prop for LCP
- [Next.js Web Vitals](https://nextjs.org/docs/pages/api-reference/functions/use-report-web-vitals) - Official Next.js useReportWebVitals documentation
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode) - Official Chrome DevTools responsive testing documentation

### Secondary (MEDIUM confidence)
- [Understanding Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) - Google official documentation, FID -> INP change
- [WCAG 2.5.5 Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) - W3C official WCAG documentation
- [Accessible Target Sizes Cheatsheet](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/) - Smashing Magazine, 44px best practice research
- [Lighthouse CI with Next.js](https://dev.to/joerismits/ensure-your-nextjs-apps-performance-is-top-notch-with-lighthouse-ci-and-github-actions-4ne8) - Community guide verified with official Lighthouse CI docs
- [Next.js Lighthouse Optimization Case Study](https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores) - Real-world optimization patterns

### Tertiary (LOW confidence)
- [Safari backdrop-filter CSS variable issue](https://github.com/mdn/browser-compat-data/issues/25914) - GitHub issue, not official Safari documentation, but corroborated by multiple sources
- [Dark Mode Design Best Practices 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/) - Blog post, contrast guidance aligns with WCAG but not authoritative
- [Common React Accessibility Mistakes](https://medium.com/@ignatovich.dm/accessibility-in-react-best-practices-for-building-inclusive-web-apps-906d1cbedd27) - Medium article, patterns align with WebAIM/W3C but not official

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Lighthouse, axe-core, Chrome DevTools, WebAIM Contrast Checker are all authoritative, official tools
- Architecture: HIGH - Patterns verified with official documentation (Lighthouse CI, Next.js Image, Chrome DevTools workflows)
- Pitfalls: MEDIUM - Based on community experience and known issues, some from GitHub issues (Safari quirks) not official docs
- Safari compatibility: LOW - No direct testing possible, relying on documented known issues and code inspection heuristics

**Research date:** 2026-02-06
**Valid until:** 30 days (2026-03-08) - Lighthouse and Chrome DevTools are stable, but axe-core rules update every 3-5 months
