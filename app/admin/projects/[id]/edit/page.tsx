"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectForm, ProjectFormData } from "@/components/admin/project-form";
import { toast } from "@/hooks/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as Id<"projects">;

  const project = useQuery(api.projects.getById, { id: projectId });
  const update = useMutation(api.projects.update);

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await update({
        id: projectId,
        ...data,
      });

      toast({
        title: "Project updated",
        description: `"${data.name}" has been updated successfully.`,
      });

      router.push("/admin/projects");
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Update failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/projects");
  };

  if (project === undefined) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>Loading...</div>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>Project not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <ProjectForm
        mode="edit"
        initialData={project}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
