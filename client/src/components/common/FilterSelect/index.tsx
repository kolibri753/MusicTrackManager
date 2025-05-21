import React from "react";

type NativeProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
>;

interface FilterSelectProps extends NativeProps {
  label: string;
  options: string[];
  value: string;
  onChange(v: string): void;
  loading?: boolean;
  error?: boolean;
  dataTestId?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  loading = false,
  error = false,
  dataTestId,
  ...nativeProps
}) => (
  <div className="form-control w-full sm:w-auto">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>

    <select
      {...nativeProps}
      data-testid={dataTestId}
      className="select select-bordered select-sm min-w-[8rem]"
      value={value}
      disabled={loading || error}
      onChange={(e) => onChange(e.target.value)}
    >
      {loading && <option>Loading…</option>}
      {error && <option>Error</option>}
      {!loading && !error && (
        <>
          <option value="">All {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </>
      )}
    </select>
  </div>
);
