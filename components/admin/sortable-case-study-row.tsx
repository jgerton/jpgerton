"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "./confirm-dialog";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export interface CaseStudy {
  _id: Id<"caseStudies">;
  title: string;
  status: "draft" | "published";
  project: { _id: Id<"projects">; name: string; slug: string } | null;
  coverImageUrl: string | null;
  createdAt: number;
}

interface SortableCaseStudyRowProps {
  caseStudy: CaseStudy;
  onDelete: () => void;
}

export function SortableCaseStudyRow({
  caseStudy,
  onDelete,
}: SortableCaseStudyRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: caseStudy._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <tr ref={setNodeRef} style={style} className="border-b">
        <td className="p-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </td>
        <td className="p-2 font-medium">{caseStudy.title}</td>
        <td className="p-2">
          {caseStudy.project ? (
            <span>{caseStudy.project.name}</span>
          ) : (
            <span className="text-muted-foreground">Unlinked</span>
          )}
        </td>
        <td className="p-2">
          <Badge variant={caseStudy.status === "published" ? "default" : "outline"}>
            {caseStudy.status}
          </Badge>
        </td>
        <td className="p-2 text-sm text-muted-foreground">
          {formatDate(caseStudy.createdAt)}
        </td>
        <td className="p-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/case-studies/${caseStudy._id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Case Study"
        description={`Are you sure you want to delete "${caseStudy.title}"? This action cannot be undone.`}
        onConfirm={onDelete}
        confirmText="Delete"
        destructive
      />
    </>
  );
}
