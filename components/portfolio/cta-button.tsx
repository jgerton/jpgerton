import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    VariantProps<typeof ctaButtonVariants> {}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, intent, size, asChild = false, ...props }, ref) => {
    // Map CTAButton intent to Button variant
    const buttonVariant = intent === "gradient" ? "gradient" : "primary";

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        size={size as "default" | "lg" | "xl"}
        asChild={asChild}
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
