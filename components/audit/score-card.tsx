import {
  Gauge,
  Eye,
  Search,
  Shield,
  Code,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { GradeRing } from "./grade-ring";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  performance: Gauge,
  accessibility: Eye,
  seo: Search,
  security: Shield,
  bestPractices: Code,
};

const categoryLabels: Record<string, string> = {
  performance: "Performance",
  accessibility: "Accessibility",
  seo: "SEO",
  security: "Security",
  bestPractices: "Best Practices",
};

interface ScoreCardProps {
  category: string;
  score: number;
  grade: string;
  className?: string;
}

export function ScoreCard({
  category,
  score,
  grade,
  className,
}: ScoreCardProps) {
  const Icon = categoryIcons[category] || Code;
  const label = categoryLabels[category] || category;

  return (
    <Card
      elevation="flat"
      className={cn("p-md flex items-center gap-md", className)}
    >
      <GradeRing grade={grade} score={score} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-sm mb-1">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium text-sm">{label}</span>
        </div>
        <p className="text-2xl font-bold tabular-nums">{score}</p>
      </div>
    </Card>
  );
}
