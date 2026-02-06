# WCAG 2.1 AA Accessibility Audit Results

**Audit date:** 2026-02-06
**Scope:** All public pages (Home, Projects, Services, About, Contact, Project Detail, Thank You)
**Method:** Manual source code review for semantic HTML, ARIA, contrast, heading hierarchy, form labels, image alt text, link text

---

## Critical Issues (Must Fix)

### C-01: Missing `<main>` landmark on Services page
- **File:** `app/services/page.tsx`
- **Issue:** Root wrapper is `<div>` instead of `<main>`. Screen readers cannot identify the primary content region.
- **WCAG:** 1.3.1 Info and Relationships (A), 2.4.1 Bypass Blocks (A)

### C-02: Missing `<main>` landmark on About page
- **File:** `app/about/page.tsx`
- **Issue:** Root wrapper is `<div>` instead of `<main>`. Same impact as C-01.
- **WCAG:** 1.3.1, 2.4.1

### C-03: Missing `<main>` landmark on Contact page
- **File:** `app/contact/page.tsx`
- **Issue:** Root wrapper is `<div>` instead of `<main>`. Same impact as C-01.
- **WCAG:** 1.3.1, 2.4.1

### C-04: Heading hierarchy skip on Contact page (h1 to h4)
- **File:** `app/contact/page.tsx`
- **Issue:** Page has h1 ("Let's Talk About Your Project") but the "Other Ways to Connect" card uses CardTitle (h3), then immediately has h4 elements ("Email", "GitHub", "LinkedIn") with no h2 between h1 and h3. The h4 headings should be consistent with the card structure.
- **WCAG:** 1.3.1 Info and Relationships (A)

### C-05: Heading hierarchy skip on Thank You page (h1 to h3/h4)
- **File:** `app/contact/thank-you/page.tsx`
- **Issue:** Page has h1, then CardTitle renders as h3 ("What Happens Next?", "While You Wait..."), then h4 elements ("Review", "Response", "Discussion"). Missing h2 level entirely.
- **WCAG:** 1.3.1

### C-06: Missing `<main>` landmark on Thank You page
- **File:** `app/contact/thank-you/page.tsx`
- **Issue:** Root wrapper is `<div>` without main landmark.
- **WCAG:** 1.3.1, 2.4.1

### C-07: Home page heading hierarchy - orphan h3
- **File:** `app/(home)/page.tsx`
- **Issue:** "What Clients Say" is an h3 (line 169) inside the Social Proof section, but it is not subordinate to an h2 in that same section. The preceding SocialProofDisplay component has no heading. This h3 is structurally orphaned since the previous h2 is "Recent Work" in the projects section.
- **WCAG:** 1.3.1

---

## Warnings (Should Fix)

### W-01: No `<footer>` landmark in layout
- **File:** `app/layout.tsx`
- **Issue:** The site has no `<footer>` element. While not a WCAG violation, it is a best practice for landmark navigation.
- **Recommendation:** Add a minimal footer to the root layout.

### W-02: SiteNav `<nav>` lacks aria-label
- **File:** `components/navigation/site-nav.tsx`
- **Issue:** The `<nav>` element inside the header has no `aria-label`. When the mobile menu opens, there are two `<nav>` elements (one in header, one in mobile menu dialog), making it unclear to screen readers which navigation is which.
- **WCAG:** 1.3.1 (best practice for multiple landmarks of same type)

### W-03: External links lack external indicator for screen readers
- **File:** `app/contact/page.tsx` (lines 96-101, 107-112)
- **Issue:** GitHub and LinkedIn links open in new tabs (`target="_blank"`) but have no text or ARIA indication of external behavior. While `rel="noopener noreferrer"` is present (good), screen reader users are not informed the link opens in a new window.
- **Recommendation:** Add visually hidden text like "(opens in new tab)" or an aria-label that includes this info.

### W-04: Visually mismatched heading levels on Services/About
- **Files:** `app/services/page.tsx` (line 207), `app/about/page.tsx` (line 149)
- **Issue:** Both pages have "Ready to Get Started?" as an `<h2>` element styled with `text-h3` class (visually smaller than other h2 headings on the same page). While semantically correct (h2 under h1), the visual mismatch can confuse sighted users who expect heading size to correlate with importance.
- **Note:** This is a design judgment call, not a strict WCAG violation. Keeping h2 is correct semantically.

---

## Passed Checks

### Semantic HTML
- [PASS] Home page uses `<main>` wrapper
- [PASS] Projects index uses `<main>` wrapper
- [PASS] Project detail uses `<main>` wrapper
- [PASS] SectionBackground renders as `<section>` element
- [PASS] CTABanner renders as `<section>` element
- [PASS] HeroWithGradient renders as `<section>` element
- [PASS] SocialProofDisplay renders as `<section>` with aria-label
- [PASS] TestimonialCard uses semantic figure/blockquote/figcaption/cite
- [PASS] CaseStudyVisual uses `<article>` element
- [PASS] `<html>` has `lang="en"` attribute
- [PASS] Mobile menu uses `role="dialog"`, `aria-modal="true"`, `aria-label`

### ARIA Usage
- [PASS] No redundant `role="navigation"` on `<nav>` elements
- [PASS] Mobile menu toggle has `aria-label` and `aria-expanded`
- [PASS] Theme toggle has dynamic `aria-label` and `sr-only` text
- [PASS] Decorative elements in HeroWithGradient and CTABanner have `aria-hidden="true"`
- [PASS] Honeypot field has `aria-hidden="true"` and `tabIndex={-1}`
- [PASS] No `tabindex` values greater than 0

### Images
- [PASS] All `<Image>` components have descriptive alt text (e.g., `${project.name} screenshot`)
- [PASS] No raw `<img>` tags found (all use Next.js Image component)
- [PASS] Decorative divs use `aria-hidden="true"` instead of images

### Forms
- [PASS] Contact form uses FormLabel for all inputs (Name, Email, Project Type, Message)
- [PASS] Validation via react-hook-form with zod schema
- [PASS] Select element has proper label association via FormControl
- [PASS] Submit button has clear text ("Send Message")
- [PASS] Disabled state with "Sending..." for loading

### Color Contrast (Light Mode)
- [PASS] Foreground on background: 17.4:1 (far exceeds 4.5:1)
- [PASS] Primary on white: 11.16:1
- [PASS] Muted-foreground on white: 4.74:1 (passes AA)
- [PASS] Border contrast: 3.36:1 (passes 3:1 UI minimum)
- [PASS] Accent warm foreground: 8.16:1 on amber

### Links
- [PASS] No "click here" or ambiguous link text found
- [PASS] All external links on project detail page have `rel="noopener noreferrer"`
- [PASS] Contact page external links have `rel="noopener noreferrer"`

### Keyboard & Focus
- [PASS] Global `*:focus-visible` transition for smooth focus ring
- [PASS] Mobile menu closes on Escape key
- [PASS] Backdrop overlay has `aria-hidden="true"` and closes menu on click
- [PASS] Body scroll locked when mobile menu is open

### Reduced Motion
- [PASS] `prefers-reduced-motion: reduce` override uses 0.01ms (not 0ms) for event compatibility
- [PASS] Global scope covers *, *::before, *::after

---

## Notes (Observations, Not Violations)

1. **CardTitle renders as h3 by default** (shadcn/ui). This means any page using CardTitle must account for heading hierarchy - there must be an h2 before CardTitle's h3.

2. **Placeholder testimonials** on home page use hardcoded data. When real testimonials are added via admin, ensure the data model requires alt text for photos.

3. **Calendly popup** (CalendlyButton) injects a third-party widget. Accessibility of the popup modal is controlled by Calendly and cannot be audited here.

4. **ProjectFilters component** was not audited for form accessibility (radio buttons, select elements). This is a lower priority since it is a progressive enhancement for browsing, not a core interaction.

---

## Fixes Applied

(To be updated in Task 2)
