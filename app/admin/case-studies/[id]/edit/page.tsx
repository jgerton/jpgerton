"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CaseStudyForm, CaseStudyFormData } from "@/components/admin/case-study-form";
import { toast } from "@/hooks/use-toast";

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams();
  const caseStudyId = params.id as Id<"caseStudies">;

  const caseStudy = useQuery(api.caseStudies.getById, { id: caseStudyId });
  const update = useMutation(api.caseStudies.update);

  const handleSubmit = async (data: CaseStudyFormData) => {
    try {
      await update({
        id: caseStudyId,
        title: data.title,
        slug: data.slug,
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
        title: "Case study updated",
        description: `"${data.title}" has been updated.`,
      });
      router.push("/admin/case-studies");
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Update failed",
        description: "Failed to update case study.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => router.push("/admin/case-studies");

  if (caseStudy === undefined) {
    return (
      <div className="max-w-3xl mx-auto">
        <div>Loading...</div>
      </div>
    );
  }

  if (caseStudy === null) {
    return (
      <div className="max-w-3xl mx-auto">
        <div>Case study not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Case Study</h1>
      <CaseStudyForm
        mode="edit"
        initialData={{
          title: caseStudy.title,
          slug: caseStudy.slug,
          projectId: caseStudy.projectId,
          problemHeading: caseStudy.problemHeading,
          problemContent: caseStudy.problemContent,
          solutionHeading: caseStudy.solutionHeading,
          solutionContent: caseStudy.solutionContent,
          resultsHeading: caseStudy.resultsHeading,
          resultsContent: caseStudy.resultsContent,
          metrics: caseStudy.metrics,
          coverImageId: caseStudy.coverImageId,
          coverImageAlt: caseStudy.coverImageAlt,
          coverImageUrl: caseStudy.coverImageUrl,
          status: caseStudy.status,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
