"use client";

import { Button } from "@/components/ui/button";

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  // Don't render if only 1 page
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  const getPageNumbers = (): (number | "ellipsis")[] => {
    // Show all pages if 7 or fewer
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Current page near the start (1-4)
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    // Current page near the end (last 4 pages)
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Current page in the middle
    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Blog pagination" className="flex justify-center mt-xl">
      <div className="flex items-center gap-sm">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-sm text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
