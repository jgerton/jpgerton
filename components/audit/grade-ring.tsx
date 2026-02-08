"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const gradeColors: Record<string, string> = {
  A: "text-green-500 stroke-green-500",
  B: "text-blue-500 stroke-blue-500",
  C: "text-yellow-500 stroke-yellow-500",
  D: "text-orange-500 stroke-orange-500",
  F: "text-red-500 stroke-red-500",
};

const gradeTrackColors: Record<string, string> = {
  A: "stroke-green-500/15",
  B: "stroke-blue-500/15",
  C: "stroke-yellow-500/15",
  D: "stroke-orange-500/15",
  F: "stroke-red-500/15",
};

interface GradeRingProps {
  grade: string;
  score: number;
  size?: "sm" | "lg";
  className?: string;
}

export function GradeRing({
  grade,
  score,
  size = "sm",
  className,
}: GradeRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const dimensions = size === "lg" ? 120 : 64;
  const strokeWidth = size === "lg" ? 8 : 5;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;
  const colorClass = gradeColors[grade] || gradeColors.F;
  const trackClass = gradeTrackColors[grade] || gradeTrackColors.F;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="img"
      aria-label={`Grade ${grade}, score ${score} out of 100`}
    >
      <svg width={dimensions} height={dimensions} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClass}
        />
        {/* Progress arc */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(colorClass, "transition-[stroke-dashoffset] duration-700 ease-out")}
        />
      </svg>
      <span
        className={cn(
          "absolute font-bold",
          colorClass,
          size === "lg" ? "text-3xl" : "text-lg"
        )}
      >
        {grade}
      </span>
    </div>
  );
}
