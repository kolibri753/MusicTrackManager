import React, { useCallback } from "react";
import { useGenres } from "@/hooks";
import { TagBadge } from "./TagBadge";

interface TagSelectorProps {
  value: string[];
  onChange(tags: string[]): void;
}

export function TagSelector({ value, onChange }: TagSelectorProps) {
  const genres = useGenres();

  const handleAdd = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const genre = e.target.value;
      if (genre && !value.includes(genre)) {
        onChange([...value, genre]);
      }
      e.target.value = "";
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (genre: string) => onChange(value.filter((g) => g !== genre)),
    [value, onChange]
  );

  const available = genres.filter((g) => !value.includes(g));

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {value.map((tag) => (
        <TagBadge key={tag} tag={tag} onRemove={handleRemove} />
      ))}

      <select
        className="select select-bordered select-sm w-auto min-w-max max-w-xs"
        value=""
        onChange={handleAdd}
        disabled={available.length === 0}
        aria-disabled={available.length === 0}
      >
        <option value="" disabled>
          + Add genre
        </option>
        {available.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
