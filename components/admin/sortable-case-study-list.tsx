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
import { SortableCaseStudyRow, CaseStudy } from "./sortable-case-study-row";

interface SortableCaseStudyListProps {
  caseStudies: CaseStudy[];
  onReorder: (reorderedCaseStudies: CaseStudy[]) => void;
  onDelete: (caseStudy: CaseStudy) => void;
}

export function SortableCaseStudyList({
  caseStudies,
  onReorder,
  onDelete,
}: SortableCaseStudyListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = caseStudies.findIndex((cs) => cs._id === active.id);
      const newIndex = caseStudies.findIndex((cs) => cs._id === over.id);
      const reordered = arrayMove(caseStudies, oldIndex, newIndex);
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
        items={caseStudies.map((cs) => cs._id)}
        strategy={verticalListSortingStrategy}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="w-8 text-left p-2"></th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Project</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.map((caseStudy) => (
              <SortableCaseStudyRow
                key={caseStudy._id}
                caseStudy={caseStudy}
                onDelete={() => onDelete(caseStudy)}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
