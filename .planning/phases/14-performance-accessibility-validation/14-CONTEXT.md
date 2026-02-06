# Phase 14: Performance & Accessibility Validation - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify the design polish work from Phases 8-13 maintains excellent performance and meets WCAG AA accessibility standards. Fix all issues found. This is a validation and remediation phase, not a feature-building phase. No new components, pages, or design elements are created.

</domain>

<decisions>
## Implementation Decisions

### Audit methodology
- Automated-first approach: run axe-core/Lighthouse automated checks, manually verify what they flag
- No full keyboard walkthrough or screen reader testing - rely on automated detection
- ARIA labels: verify existing labels are correct, don't add new ARIA where plain HTML semantics already work
- Contrast checks: re-verify all pages in both light and dark mode, even though Phases 8 and 10 already did contrast work
- Results format: Claude's discretion on whether to use inline fixes + summary doc or a tracking spreadsheet, based on volume of issues found

### Fix vs document scope
- Fix ALL accessibility findings, no deferring - ship clean
- Fix ALL performance issues unless the fix would visibly degrade the design
- Design change policy: subtle fixes (slightly darker border, minor spacing tweak) just fix. Major visual changes get flagged for user review before changing.
- Design polish is the priority of v1.1 - protect design over performance scores
- Lighthouse floor: 85+ in every category. Below 85 warrants investigation and potentially simplifying a visual. Above 85, design wins.

### Browser & device matrix
- Browsers: Chrome + Safari (no Firefox)
- Safari: no direct access available - rely on automated checks for known Safari CSS quirks (backdrop-filter, CSS grid gaps, font rendering). Document anything that can't be verified.
- Mobile: Chrome DevTools responsive mode, not real devices
- Breakpoints to test: 375px (small phone), 768px (tablet), 1024px (small laptop)
- No real device testing needed

### Performance budgets
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms (Google's "good" thresholds, not tighter)
- Animations stay even if they impact scores - the design polish is the point of v1.1. Only investigate if scores drop below 85.
- Bundle size: Lighthouse performance score is sufficient proxy. No separate bundle analysis tooling.
- Image optimization: spot-check hero and project thumbnail images for obvious oversizing. Not a full image audit.

### Claude's Discretion
- Audit results format (inline fixes vs spreadsheet)
- Which specific axe-core rules to prioritize when multiple issues exist
- Whether to use `next/bundle-analyzer` or skip it based on Lighthouse scores
- Order of fixes within each plan

</decisions>

<specifics>
## Specific Ideas

- User's audience is local business owners, often on iPhones - mobile rendering quality matters
- The site already had excellent Lighthouse scores pre-v1.1 - this phase confirms design polish didn't regress them
- Phases 8 and 10 did WCAG contrast work, but a full re-verification is wanted to catch any regressions from Phases 11-13

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 14-performance-accessibility-validation*
*Context gathered: 2026-02-06*
