"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Dynamic import with SSR disabled - prevents hydration errors
// Calendly widget requires browser DOM APIs
const PopupButton = dynamic(
  () => import("react-calendly").then((mod) => mod.PopupButton),
  { ssr: false }
);

interface CalendlyButtonProps {
  url: string;
  text?: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  size?: "default" | "sm" | "lg";
}

// UTM parameter types for Calendly tracking
interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export function CalendlyButton({
  url,
  text = "Book a Call",
  variant = "default",
  className,
  size = "default",
}: CalendlyButtonProps) {
  // Track client-side mounting to safely access document.body
  const [mounted, setMounted] = useState(false);
  // Store UTM parameters for conversion tracking
  const [utmParams, setUtmParams] = useState<UtmParams>({});

  useEffect(() => {
    setMounted(true);

    // Extract UTM parameters from URL for conversion tracking
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
        utmCampaign: params.get("utm_campaign") || undefined,
        utmContent: params.get("utm_content") || undefined,
        utmTerm: params.get("utm_term") || undefined,
      });
    }
  }, []);

  // Define button classes based on variant and size to match shadcn Button
  const buttonClasses = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    {
      // Variants
      "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
      "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
      "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
      // Sizes
      "h-9 px-4 py-2": size === "default",
      "h-8 rounded-md px-3 text-xs": size === "sm",
      "h-10 rounded-md px-8": size === "lg",
    },
    className
  );

  // Don't render until client-side to safely access document.body
  if (!mounted) {
    return (
      <button className={buttonClasses} disabled>
        {text}
      </button>
    );
  }

  return (
    <PopupButton
      url={url}
      rootElement={document.body}
      text={text}
      className={buttonClasses}
      utm={utmParams}
    />
  );
}
