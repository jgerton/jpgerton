"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectForm, ProjectFormData } from "@/components/admin/project-form";
import { toast } from "@/hooks/use-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const create = useMutation(api.projects.create);

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await create(data);

      toast({
        title: "Project created",
        description: `"${data.name}" has been created successfully.`,
      });

      router.push("/admin/projects");
    } catch (error) {
      console.error("Create failed:", error);
      toast({
        title: "Create failed",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/projects");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Project</h1>
      <ProjectForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
