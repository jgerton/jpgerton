"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const checkItems = [
  { label: "Checking page speed and performance...", delay: 0 },
  { label: "Scanning accessibility...", delay: 3000 },
  { label: "Analyzing SEO elements...", delay: 6000 },
  { label: "Testing security headers...", delay: 9000 },
  { label: "Generating your report...", delay: 12000 },
];

type AuditStatus =
  | "pending"
  | "running"
  | "complete"
  | "partial"
  | "failed";

interface AuditProgressProps {
  status: AuditStatus | undefined;
  onComplete: () => void;
  onTimeout: () => void;
}

export function AuditProgress({
  status,
  onComplete,
  onTimeout,
}: AuditProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  // Animate check items on timed sequence
  useEffect(() => {
    const timers = checkItems.map((item, index) =>
      setTimeout(() => setActiveIndex(index), item.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Watch for completion
  useEffect(() => {
    if (status === "complete" || status === "partial") {
      // Brief delay to show final checkmark
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
    if (status === "failed") {
      onComplete();
    }
  }, [status, onComplete]);

  // 60-second timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status !== "complete" && status !== "partial" && status !== "failed") {
        setTimedOut(true);
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, [status]);

  if (timedOut) {
    return (
      <Card elevation="sm" className="max-w-xl mx-auto p-lg text-center">
        <p className="text-muted-foreground mb-md">
          The analysis is taking longer than expected. This can happen with slow
          or heavily protected sites.
        </p>
        <Button onClick={onTimeout} variant="outline">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <Card elevation="sm" className="max-w-xl mx-auto p-lg">
      <div className="space-y-md">
        {checkItems.map((item, index) => {
          const isDone =
            index < activeIndex ||
            status === "complete" ||
            status === "partial";
          const isActive = index === activeIndex && !isDone;

          return (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-sm transition-opacity duration-300",
                index > activeIndex && "opacity-40"
              )}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm",
                  isDone && "text-muted-foreground",
                  isActive && "font-medium"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
