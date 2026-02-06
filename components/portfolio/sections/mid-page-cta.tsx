import * as React from "react";
import Link from "next/link";
import { CTAButton } from "@/components/portfolio/cta-button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MidPageCTAProps {
  variant: "simple" | "card" | "inline";
  headline: string;
  cta: {
    text: string;
    href: string;
    intent?: "warm" | "primary";
  };
  description?: string;
  className?: string;
}

export function MidPageCTA({
  variant,
  headline,
  cta,
  description,
  className,
}: MidPageCTAProps) {
  if (variant === "simple") {
    return (
      <div className={cn("text-center mt-2xl", className)}>
        <h3 className="font-serif text-h3 leading-snug mb-md">{headline}</h3>
        {description && (
          <p className="text-muted-foreground mb-lg">{description}</p>
        )}
        <CTAButton asChild intent={cta.intent ?? "warm"} size="lg">
          <Link href={cta.href}>{cta.text}</Link>
        </CTAButton>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card
        elevation="sm"
        className={cn("p-xl text-center bg-muted/20 mt-2xl", className)}
      >
        <h3 className="font-serif text-h3 leading-snug mb-md">{headline}</h3>
        {description && (
          <p className="text-muted-foreground mb-lg">{description}</p>
        )}
        <CTAButton asChild intent={cta.intent ?? "warm"} size="lg">
          <Link href={cta.href}>{cta.text}</Link>
        </CTAButton>
      </Card>
    );
  }

  // inline variant
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-md mt-2xl",
        className
      )}
    >
      <div>
        <h3 className="font-serif text-h3 leading-snug">{headline}</h3>
        {description && (
          <p className="text-muted-foreground mt-xs">{description}</p>
        )}
      </div>
      <CTAButton asChild intent={cta.intent ?? "warm"} size="lg">
        <Link href={cta.href}>{cta.text}</Link>
      </CTAButton>
    </div>
  );
}
