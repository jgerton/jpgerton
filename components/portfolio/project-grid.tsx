import { ProjectCard } from "./project-card";

type Project = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  screenshotUrl: string | null;
  status: "live" | "archived" | "in-progress";
};

type ProjectGridProps = {
  projects: Project[];
  loading?: boolean;
};

export function ProjectGrid({ projects, loading }: ProjectGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-2xl text-muted-foreground">
        No projects found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
