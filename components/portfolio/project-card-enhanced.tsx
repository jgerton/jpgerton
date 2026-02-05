import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardEnhancedProps {
  project: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    screenshotUrl: string | null;
    techStack: string[];
    status: "live" | "archived" | "in-progress";
  };
  priority?: boolean;
}

export function ProjectCardEnhanced({ project, priority = false }: ProjectCardEnhancedProps) {
  const statusVariant = {
    live: "default" as const,
    archived: "secondary" as const,
    "in-progress": "outline" as const,
  };

  const displayedTechStack = project.techStack.slice(0, 4);
  const remainingTechCount = project.techStack.length - 4;

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card elevation="lg" className="overflow-hidden group">
        <div className="relative aspect-video bg-muted">
          {project.screenshotUrl ? (
            <Image
              src={project.screenshotUrl}
              alt={`${project.name} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-[var(--duration-base)] ease-smooth"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No preview
            </div>
          )}
          <div className="absolute top-sm right-sm z-10">
            <Badge
              variant={statusVariant[project.status]}
              className="bg-background/80 backdrop-blur-sm"
            >
              {project.status}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <h3 className="font-serif text-h5 leading-snug">
            {project.name}
          </h3>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        {project.techStack.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-xs items-center">
              {displayedTechStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {remainingTechCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{remainingTechCount} more
                </span>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
