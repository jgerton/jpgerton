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

export interface BlogPost {
  _id: Id<"blogPosts">;
  title: string;
  status: "draft" | "published";
  category: "Local Business" | "Technical" | "Announcement";
  coverImageUrl: string | null;
  readingTime: number;
  createdAt: number;
}

interface SortableBlogRowProps {
  post: BlogPost;
  onDelete: () => void;
}

export function SortableBlogRow({
  post,
  onDelete,
}: SortableBlogRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: post._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
        <td className="p-2 font-medium">{post.title}</td>
        <td className="p-2">
          <Badge variant="secondary">
            {post.category}
          </Badge>
        </td>
        <td className="p-2">
          <Badge variant={post.status === "published" ? "default" : "outline"}>
            {post.status}
          </Badge>
        </td>
        <td className="p-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </td>
        <td className="p-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/blog/${post._id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        onConfirm={onDelete}
        confirmText="Delete"
        destructive
      />
    </>
  );
}
