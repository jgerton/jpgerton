"use client";

import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { CTAButton } from "@/components/portfolio/cta-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroWithGradientProps {
  headline?: string;
  subheadline?: string;
  className?: string;
}

export function HeroWithGradient({
  headline = "Get Your Business Online in 5 Days",
  subheadline = "Professional WordPress sites from $500. Fast, mobile-friendly, and built to grow your business.",
  className,
}: HeroWithGradientProps) {
  const { elementRef, isVisible } =
    useIntersectionObserver<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={elementRef}
      className={cn(
        "relative py-3xl px-md text-center overflow-hidden",
        className
      )}
    >
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0 bg-linear-to-br from-primary via-tech-blue to-primary opacity-10"
        aria-hidden="true"
      />

      {/* Decorative blurred circles */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/3"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-tech-blue/5 blur-3xl translate-y-1/3 -translate-x-1/4"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-2/3 w-72 h-72 rounded-full bg-turquoise/5 blur-3xl -translate-y-1/2"
        aria-hidden="true"
      />

      {/* Content with entrance animation */}
      <div
        className={cn(
          "relative z-10 max-w-4xl mx-auto",
          "opacity-0 translate-y-5",
          "transition-[opacity,transform] duration-[var(--duration-entrance)] ease-[var(--ease-smooth)]",
          isVisible && "opacity-100 translate-y-0"
        )}
      >
        <h1 className="font-serif font-semibold text-hero leading-tight mb-md text-foreground">
          {headline}
        </h1>
        <p className="font-serif italic text-h5 leading-snug text-muted-foreground mb-xl max-w-2xl mx-auto">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <CTAButton asChild intent="warm" size="xl">
            <Link href="/services">Get Your Business Online</Link>
          </CTAButton>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">See My Work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
