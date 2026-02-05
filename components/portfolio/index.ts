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

export { HeroSection } from "./hero-section";
export { ProjectCard } from "./project-card";
export { ProjectCardEnhanced } from "./project-card-enhanced";
export { ProjectGrid } from "./project-grid";
export { ProjectFilters } from "./project-filters";
export { CTAButton, ctaButtonVariants } from "./cta-button";
export { TestimonialCard } from "./testimonial-card";
export { CaseStudyVisual } from "./case-study-visual";
export { SocialProofDisplay } from "./social-proof-display";

// Type exports
export type { CTAButtonProps } from "./cta-button";
export type { TestimonialCardProps } from "./testimonial-card";
export type { CaseStudyVisualProps, CaseStudySection } from "./case-study-visual";
export type { SocialProofDisplayProps, Metric } from "./social-proof-display";
