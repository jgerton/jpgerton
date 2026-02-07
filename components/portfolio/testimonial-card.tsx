"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  photo?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  title,
  company,
  photo,
  className,
}: TestimonialCardProps) {
  // Derive initials from name
  const initials = name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Limit to 2 characters for better visual balance

  return (
    <Card elevation="sm" className={cn("p-lg", className)}>
      <figure>
        <blockquote className="border-l-4 border-primary pl-md mb-md">
          <p className="text-base leading-relaxed text-foreground">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-md mt-md">
          <Avatar className="h-12 w-12">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <cite className="font-semibold not-italic text-foreground">
              {name}
            </cite>
            <p className="text-sm text-muted-foreground">
              {title} at {company}
            </p>
          </div>
        </figcaption>
      </figure>
    </Card>
  );
}
