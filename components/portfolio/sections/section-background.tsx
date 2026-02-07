import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionBackgroundProps {
  variant: "gradient" | "neutral" | "muted";
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const backgrounds: Record<SectionBackgroundProps["variant"], string> = {
  gradient: "bg-linear-to-br from-primary/5 via-tech-blue/5 to-primary/5",
  neutral: "bg-background",
  muted: "bg-muted/30",
};

export function SectionBackground({
  variant,
  children,
  className,
  id,
}: SectionBackgroundProps) {
  return (
    <section
      id={id}
      className={cn("py-3xl px-md", backgrounds[variant], className)}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
