import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 min-h-[44px] w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-[var(--duration-fast)] aria-invalid:border-destructive aria-invalid:border-2 aria-invalid:focus-visible:ring-destructive",
  {
    variants: {
      validationState: {
        default:
          "border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        error:
          "border-2 border-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        success:
          "border-2 border-green-600 dark:border-green-500 focus-visible:ring-2 focus-visible:ring-green-600 dark:focus-visible:ring-green-500 focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      validationState: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, keyof VariantProps<typeof inputVariants>>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validationState, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ validationState, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
