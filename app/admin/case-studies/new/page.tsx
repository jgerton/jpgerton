"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CaseStudyForm, CaseStudyFormData } from "@/components/admin/case-study-form";
import { toast } from "@/hooks/use-toast";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const create = useMutation(api.caseStudies.create);

  const handleSubmit = async (data: CaseStudyFormData) => {
    try {
      await create({
        title: data.title,
        projectId: data.projectId ? (data.projectId as Id<"projects">) : undefined,
        problemHeading: data.problemHeading,
        problemContent: data.problemContent,
        solutionHeading: data.solutionHeading,
        solutionContent: data.solutionContent,
        resultsHeading: data.resultsHeading,
        resultsContent: data.resultsContent,
        metrics: data.metrics,
        coverImageId: data.coverImageId ? (data.coverImageId as Id<"_storage">) : undefined,
        coverImageAlt: data.coverImageAlt,
      });
      toast({
        title: "Case study created",
        description: `"${data.title}" has been created.`,
      });
      router.push("/admin/case-studies");
    } catch (error) {
      console.error("Create failed:", error);
      toast({
        title: "Create failed",
        description: "Failed to create case study.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => router.push("/admin/case-studies");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">New Case Study</h1>
      <CaseStudyForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
