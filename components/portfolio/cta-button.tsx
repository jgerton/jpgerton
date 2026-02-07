"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/analytics";

const ctaButtonVariants = cva(
  "font-medium",
  {
    variants: {
      intent: {
        primary: "",
        warm: "bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90",
        gradient: "",
      },
      size: {
        default: "h-10 px-4",
        lg: "h-11 px-8",
        xl: "h-14 px-12 text-lg",
      },
    },
    compoundVariants: [
      {
        size: "xl",
        class: "font-semibold shadow-lg",
      },
    ],
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
);

export interface CTAButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "variant" | "size">,
    VariantProps<typeof ctaButtonVariants> {
  trackingName?: string;
}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, intent, size, asChild = false, trackingName, onClick, ...props }, ref) => {
    // Map CTAButton intent to Button variant
    const buttonVariant = intent === "gradient" ? "gradient" : "primary";

    // Wrap onClick to track CTA clicks
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trackingName) {
        trackCTAClick(trackingName);
      }
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        size={size as "default" | "lg" | "xl"}
        asChild={asChild}
        onClick={handleClick}
        className={cn(
          ctaButtonVariants({ intent, size }),
          className
        )}
        {...props}
      />
    );
  }
);

CTAButton.displayName = "CTAButton";

export { ctaButtonVariants };
