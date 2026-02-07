import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Metric {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SocialProofDisplayProps {
  metrics: Metric[];
  className?: string;
}

export function SocialProofDisplay({
  metrics,
  className,
}: SocialProofDisplayProps) {
  return (
    <section aria-label="Key metrics" className={cn(className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
        {metrics.map((metric, index) => (
          <Card key={index} elevation="flat" className="p-lg text-center">
            {metric.icon && (
              <div className="flex justify-center mb-sm text-primary">
                {metric.icon}
              </div>
            )}
            <div className="font-serif text-h2 leading-tight text-primary font-bold mb-xs">
              {metric.value}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {metric.label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
