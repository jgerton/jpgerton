import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  project: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    screenshotUrl: string | null;
    status: "live" | "archived" | "in-progress";
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const statusVariant = {
    live: "default" as const,
    archived: "secondary" as const,
    "in-progress": "outline" as const,
  };

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-video bg-muted">
          {project.screenshotUrl ? (
            <Image
              src={project.screenshotUrl}
              alt={`${project.name} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No preview
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-xs">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <Badge variant={statusVariant[project.status]}>
              {project.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
