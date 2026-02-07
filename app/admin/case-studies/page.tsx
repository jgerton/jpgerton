"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  SortableCaseStudyList,
} from "@/components/admin/sortable-case-study-list";
import { CaseStudy } from "@/components/admin/sortable-case-study-row";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type FilterTab = "all" | "draft" | "published";

export default function CaseStudiesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);

  const allCaseStudies = useQuery(api.caseStudies.list, {});
  const reorder = useMutation(api.caseStudies.reorder);
  const remove = useMutation(api.caseStudies.remove);

  const filteredCaseStudies =
    allCaseStudies?.filter((cs) => {
      if (activeTab === "all") return true;
      return cs.status === activeTab;
    }) ?? [];

  const handleReorder = async (reorderedStudies: CaseStudy[]) => {
    try {
      await reorder({
        caseStudyIds: reorderedStudies.map((cs) => cs._id),
      });
      toast({
        title: "Order updated",
        description: "Case study order has been saved.",
      });
    } catch (error) {
      console.error("Reorder failed:", error);
      toast({
        title: "Reorder failed",
        description: "Failed to update case study order.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (caseStudy: CaseStudy) => {
    setDeleteTarget(caseStudy);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await remove({ id: deleteTarget._id });
      toast({
        title: "Case study deleted",
        description: `"${deleteTarget.title}" has been deleted.`,
      });
      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete case study.",
        variant: "destructive",
      });
    }
  };

  if (allCaseStudies === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Case Studies</h1>
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: allCaseStudies.length },
    {
      key: "draft",
      label: "Draft",
      count: allCaseStudies.filter((cs) => cs.status === "draft").length,
    },
    {
      key: "published",
      label: "Published",
      count: allCaseStudies.filter((cs) => cs.status === "published").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Case Studies</h1>
        <Button asChild>
          <Link href="/admin/case-studies/new">
            <Plus className="h-4 w-4 mr-2" />
            New Case Study
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {filteredCaseStudies.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No case studies yet. Create your first case study!
          </p>
          <Button asChild>
            <Link href="/admin/case-studies/new">
              <Plus className="h-4 w-4 mr-2" />
              New Case Study
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <SortableCaseStudyList
            caseStudies={filteredCaseStudies}
            onReorder={handleReorder}
            onDelete={handleDelete}
          />
        </Card>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Case Study"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        destructive
      />
    </div>
  );
}
