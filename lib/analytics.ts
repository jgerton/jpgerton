/**
 * GA4 custom event tracking utilities
 *
 * All functions include SSR guards and gracefully no-op when GA4 is not loaded.
 * This ensures analytics only runs in production with NEXT_PUBLIC_GA_ID set.
 */

/**
 * Track CTA button clicks across the site
 *
 * @param buttonName - Identifier for the button (e.g., "book_a_call", "get_your_business_online")
 * @param metadata - Optional context about where/how the click happened
 */
export function trackCTAClick(
  buttonName: string,
  metadata?: { page_section?: string }
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      button_name: buttonName,
      page_location: window.location.href,
      page_section: metadata?.page_section,
    });
  }
}

/**
 * Track form submissions
 *
 * @param formName - Identifier for the form (e.g., "contact")
 * @param metadata - Optional context about the submission
 */
export function trackFormSubmit(
  formName: string,
  metadata?: { project_type?: string }
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "form_submit", {
      form_name: formName,
      page_location: window.location.href,
      project_type: metadata?.project_type,
    });
  }
}

/**
 * Track blog category filter usage
 *
 * @param category - The category selected (or "all" for the All button)
 */
export function trackBlogCategoryFilter(category: string): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "blog_category_filter", {
      category: category,
      page_location: window.location.href,
    });
  }
}

/**
 * Track blog post read-through completion
 *
 * @param slug - The blog post slug
 * @param readTimeMinutes - Estimated reading time from post metadata
 */
export function trackBlogReadComplete(
  slug: string,
  readTimeMinutes: number
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "blog_read_complete", {
      post_slug: slug,
      read_time_minutes: readTimeMinutes,
      page_location: window.location.href,
    });
  }
}
