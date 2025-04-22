// client/src/components/Form/TagSelector.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getGenres } from "../../api/genres";

export function TagSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange(v: string[]): void;
}) {
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    getGenres().then(setOptions);
  }, []);

  const add = (g: string) => onChange([...value, g]);
  const remove = (g: string) => onChange(value.filter((x) => x !== g));

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {value.map((g) => (
        <span key={g} className="badge badge-primary gap-1">
          {g}
          <button
            type="button"
            onClick={() => remove(g)}
            className="focus:outline-none"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      <select
        className="select select-bordered select-sm w-auto"
        value=""
        onChange={(e) => e.currentTarget.value && add(e.currentTarget.value)}
      >
        <option value="">+ Add genre</option>
        {options
          .filter((o) => !value.includes(o))
          .map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
      </select>
    </div>
  );
}
