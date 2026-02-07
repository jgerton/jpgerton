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

interface Project {
  _id: Id<"projects">;
  name: string;
  status: "live" | "archived" | "in-progress";
  featured: boolean;
  screenshotUrl?: string | null;
}

interface SortableProjectRowProps {
  project: Project;
  onDelete: () => void;
}

export function SortableProjectRow({
  project,
  onDelete,
}: SortableProjectRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusVariant = {
    live: "default" as const,
    "in-progress": "secondary" as const,
    archived: "outline" as const,
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
        <td className="p-2">
          {project.screenshotUrl ? (
            <img
              src={project.screenshotUrl}
              alt={project.name}
              className="h-12 w-12 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </td>
        <td className="p-2 font-medium">{project.name}</td>
        <td className="p-2">
          <Badge variant={statusVariant[project.status]}>
            {project.status}
          </Badge>
        </td>
        <td className="p-2">
          {project.featured ? (
            <Badge variant="default">Featured</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </td>
        <td className="p-2">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={`/admin/projects/${project._id}/edit`}>
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
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        onConfirm={onDelete}
        confirmText="Delete"
        destructive
      />
    </>
  );
}
