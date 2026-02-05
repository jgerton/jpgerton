import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,text-decoration-color,fill,stroke,transform] duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] active:duration-[var(--duration-fast)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tertiary: "bg-muted text-muted-foreground hover:bg-muted/80",
        gradient: [
          "bg-gradient-to-r from-primary via-tech-blue to-primary",
          "bg-[length:200%_100%] bg-[position:0%_0%]",
          "hover:bg-[position:100%_0%]",
          "transition-[background-position] duration-[var(--duration-slow)] ease-smooth",
          "text-primary-foreground",
        ].join(" "),
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      {
        variant: "gradient",
        size: "xl",
        class: "px-16",
      },
      {
        variant: "outline",
        size: "lg",
        class: "border-2",
      },
      {
        variant: "outline",
        size: "xl",
        class: "border-2",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
