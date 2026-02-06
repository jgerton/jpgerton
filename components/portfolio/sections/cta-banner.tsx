import * as React from "react";
import Link from "next/link";
import { CTAButton } from "@/components/portfolio/cta-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CTABannerProps {
  headline: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
    intent?: "warm" | "primary";
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function CTABanner({
  headline,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CTABannerProps) {
  return (
    <section
      className={cn(
        "relative py-3xl px-md overflow-hidden",
        "bg-linear-to-br from-primary/10 via-tech-blue/8 to-accent/8",
        className
      )}
    >
      {/* Decorative blurred circles for depth */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-tech-blue/5 blur-3xl translate-y-1/2 -translate-x-1/2"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-h2 leading-tight mb-md">
          {headline}
        </h2>
        <p className="text-lg text-muted-foreground mb-xl">{description}</p>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <CTAButton
            asChild
            intent={primaryCta.intent ?? "warm"}
            size="xl"
          >
            <Link href={primaryCta.href}>{primaryCta.text}</Link>
          </CTAButton>
          {secondaryCta && (
            <Button asChild variant="outline" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
