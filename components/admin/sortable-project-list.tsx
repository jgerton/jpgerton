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
import { SortableProjectRow } from "./sortable-project-row";
import { Id } from "@/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  status: "live" | "archived" | "in-progress";
  featured: boolean;
  screenshotUrl?: string | null;
}

interface SortableProjectListProps {
  projects: Project[];
  onReorder: (reorderedProjects: Project[]) => void;
  onDelete: (project: Project) => void;
}

export function SortableProjectList({
  projects,
  onReorder,
  onDelete,
}: SortableProjectListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p._id === active.id);
      const newIndex = projects.findIndex((p) => p._id === over.id);

      const reordered = arrayMove(projects, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={projects.map((p) => p._id)}
        strategy={verticalListSortingStrategy}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="w-8 text-left p-2"></th>
              <th className="text-left p-2">Image</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Featured</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <SortableProjectRow
                key={project._id}
                project={project}
                onDelete={() => onDelete(project)}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
