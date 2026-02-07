"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SortableProjectList } from "@/components/admin/sortable-project-list";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Id } from "@/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  status: "live" | "archived" | "in-progress";
  featured: boolean;
  screenshotUrl?: string | null;
}

export default function AdminProjectsPage() {
  const projects = useQuery(api.projects.list);
  const reorder = useMutation(api.projects.reorder);
  const remove = useMutation(api.projects.remove);

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const handleReorder = async (reorderedProjects: Project[]) => {
    try {
      // Extract IDs in the new order
      const projectIds = reorderedProjects.map((p) => p._id);
      await reorder({ projectIds });

      toast({
        title: "Projects reordered",
        description: "The project order has been updated.",
      });
    } catch (error) {
      console.error("Reorder failed:", error);
      toast({
        title: "Reorder failed",
        description: "Failed to update project order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await remove({ id: deleteTarget._id });

      toast({
        title: "Project deleted",
        description: `"${deleteTarget.name}" has been deleted.`,
      });

      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {projects === undefined ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="mb-4">No projects yet. Add your first project!</p>
          <Link href="/admin/projects/new">
            <Button>Add Project</Button>
          </Link>
        </Card>
      ) : (
        <SortableProjectList
          projects={projects}
          onReorder={handleReorder}
          onDelete={(project) => setDeleteTarget(project)}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        destructive
      />
    </div>
  );
}
