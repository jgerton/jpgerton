"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableBlogRow, BlogPost } from "./sortable-blog-row";

interface SortableBlogListProps {
  posts: BlogPost[];
  onReorder: (reorderedPosts: BlogPost[]) => void;
  onDelete: (post: BlogPost) => void;
}

export function SortableBlogList({
  posts,
  onReorder,
  onDelete,
}: SortableBlogListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex((p) => p._id === active.id);
      const newIndex = posts.findIndex((p) => p._id === over.id);
      const reordered = arrayMove(posts, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={posts.map((p) => p._id)} strategy={verticalListSortingStrategy}>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="w-8 text-left p-2"></th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <SortableBlogRow key={post._id} post={post} onDelete={() => onDelete(post)} />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
