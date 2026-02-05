import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        frontend:
          "border-transparent bg-tech-blue/10 text-tech-blue dark:bg-tech-blue/20 dark:text-tech-blue transition-colors duration-[var(--duration-fast)]",
        backend:
          "border-transparent bg-corporate-blue/10 text-corporate-blue dark:bg-corporate-blue/20 dark:text-corporate-blue transition-colors duration-[var(--duration-fast)]",
        tool:
          "border-transparent bg-turquoise/10 text-turquoise dark:bg-turquoise/20 dark:text-turquoise transition-colors duration-[var(--duration-fast)]",
        skill:
          "border-transparent bg-accent/50 text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground transition-colors duration-[var(--duration-fast)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
