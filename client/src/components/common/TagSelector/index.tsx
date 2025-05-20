import React, { useCallback } from "react";
import { TagBadge } from "./TagBadge";

interface TagSelectorProps {
  value: string[];
  options: string[];
  loading?: boolean;
  error?: boolean;
  onChange(tags: string[]): void;
}

export function TagSelector({
  value,
  options,
  loading = false,
  error = false,
  onChange,
}: TagSelectorProps) {
  const available = options.filter((g) => !value.includes(g));
  const isSelectDisabled = loading || error || available.length === 0;

  const handleAdd = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const g = e.target.value;
      if (g && !value.includes(g)) onChange([...value, g]);
      e.target.value = "";
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (g: string) => onChange(value.filter((v) => v !== g)),
    [value, onChange]
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {value.map((tag) => (
        <TagBadge key={tag} tag={tag} onRemove={handleRemove} />
      ))}

      <select
        className="select select-bordered select-sm w-auto min-w-[8rem]"
        value=""
        onChange={handleAdd}
        disabled={isSelectDisabled}
        aria-disabled={isSelectDisabled}
      >
        {loading && <option>Loading…</option>}
        {error && <option>Error</option>}
        {!loading && !error && (
          <>
            <option value="" disabled>
              + Add genre
            </option>
            {available.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
