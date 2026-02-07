"use client";

import { Badge } from "@/components/ui/badge";

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null | undefined;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex flex-wrap gap-sm mb-xl"
    >
      <button
        type="button"
        onClick={() => onCategoryChange(null)}
        className="cursor-pointer"
      >
        <Badge
          variant={
            selectedCategory === null || selectedCategory === undefined
              ? "default"
              : "outline"
          }
        >
          All
        </Badge>
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className="cursor-pointer"
        >
          <Badge
            variant={selectedCategory === category ? "default" : "outline"}
          >
            {category}
          </Badge>
        </button>
      ))}
    </div>
  );
}
