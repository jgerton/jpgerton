// Portfolio Composition Components
// These components combine shadcn/ui primitives with brand personality.
// They are presentational only - data fetching happens in page components.
//
// Component Language Conventions:
// - Card elevation: flat (informational), sm (content), lg (interactive/linked)
// - Typography: font-serif for headings/values, font-sans for labels/body
// - Colors: text-primary for emphasis, text-muted-foreground for supporting
// - Spacing: p-lg card padding, gap-md grids, gap-lg section grids
// - Buttons: CTAButton for conversion points, Button for navigation/secondary

export { ProjectCard } from "./project-card";
export { ProjectCardEnhanced } from "./project-card-enhanced";
export { ProjectGrid } from "./project-grid";
export { ProjectFilters } from "./project-filters";
export { CTAButton, ctaButtonVariants } from "./cta-button";
export { TestimonialCard } from "./testimonial-card";
export { CaseStudyVisual } from "./case-study-visual";
export { SocialProofDisplay } from "./social-proof-display";

// Section layout components
export { SectionBackground } from "./sections/section-background";
export { CTABanner } from "./sections/cta-banner";
export { HeroWithGradient } from "./sections/hero-with-gradient";
export { MidPageCTA } from "./sections/mid-page-cta";

// Type exports
export type { CTAButtonProps } from "./cta-button";
export type { TestimonialCardProps } from "./testimonial-card";
export type { CaseStudyVisualProps, CaseStudySection } from "./case-study-visual";
export type { SocialProofDisplayProps, Metric } from "./social-proof-display";
export type { SectionBackgroundProps } from "./sections/section-background";
export type { CTABannerProps } from "./sections/cta-banner";
export type { HeroWithGradientProps } from "./sections/hero-with-gradient";
export type { MidPageCTAProps } from "./sections/mid-page-cta";
