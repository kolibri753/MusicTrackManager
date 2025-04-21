import React from "react";

type NativeSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
>;

interface FilterSelectProps extends NativeSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange(value: string): void;
  testid?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  testid,
  ...nativeProps
}) => (
  <div className="form-control w-full sm:w-auto">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <select
      {...nativeProps}
      data-testid={testid}
      className="select select-bordered select-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
