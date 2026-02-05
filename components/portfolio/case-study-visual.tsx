import * as React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CaseStudySection {
  heading: string;
  content: string;
  metrics?: string[];
}

export interface CaseStudyVisualProps {
  title?: string;
  problem: CaseStudySection;
  solution: CaseStudySection;
  results: CaseStudySection;
  className?: string;
}

export function CaseStudyVisual({
  title,
  problem,
  solution,
  results,
  className,
}: CaseStudyVisualProps) {
  return (
    <article className={cn(className)}>
      {title && (
        <h3 className="font-serif text-h3 leading-snug mb-lg">{title}</h3>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Problem Section */}
        <Card elevation="sm">
          <CardHeader className="pb-xs">
            <Badge variant="destructive" className="w-fit mb-sm">
              Challenge
            </Badge>
            <h4 className="font-serif text-h5 leading-snug">
              {problem.heading}
            </h4>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            <p>{problem.content}</p>
          </CardContent>
        </Card>

        {/* Solution Section */}
        <Card elevation="sm">
          <CardHeader className="pb-xs">
            <Badge variant="secondary" className="w-fit mb-sm">
              Approach
            </Badge>
            <h4 className="font-serif text-h5 leading-snug">
              {solution.heading}
            </h4>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            <p>{solution.content}</p>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card elevation="sm">
          <CardHeader className="pb-xs">
            <Badge variant="default" className="w-fit mb-sm">
              Impact
            </Badge>
            <h4 className="font-serif text-h5 leading-snug">
              {results.heading}
            </h4>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-md">
              {results.content}
            </p>
            {results.metrics && results.metrics.length > 0 && (
              <ul className="space-y-sm">
                {results.metrics.map((metric, index) => (
                  <li key={index} className="flex items-center gap-sm text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">{metric}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
