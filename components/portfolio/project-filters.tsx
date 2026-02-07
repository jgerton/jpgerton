"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectFiltersProps = {
  availableTechs: string[];
};

export function ProjectFilters({ availableTechs }: ProjectFiltersProps) {
  const [selectedTechs, setSelectedTechs] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("date")
  );

  const toggleTech = (tech: string) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const clearFilters = () => {
    setSelectedTechs([]);
    setSortBy("date");
  };

  const hasFilters = selectedTechs.length > 0 || sortBy !== "date";

  return (
    <div className="mb-xl space-y-md">
      <div className="flex flex-wrap items-center gap-md">
        <div className="flex items-center gap-xs">
          <span className="text-sm font-medium text-muted-foreground">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-sm py-1.5 rounded-md border bg-background text-sm"
          >
            <option value="date">Newest First</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-xs">
        <span className="text-sm font-medium text-muted-foreground mr-xs self-center">
          Filter by tech:
        </span>
        {availableTechs.map((tech) => (
          <Badge
            key={tech}
            variant={selectedTechs.includes(tech) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90"
            onClick={() => toggleTech(tech)}
          >
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}
