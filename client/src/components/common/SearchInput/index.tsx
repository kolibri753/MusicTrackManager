import React, { useState, useEffect, InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
>;

interface SearchInputProps extends NativeInputProps {
  value: string;
  onChange(value: string): void;
  placeholder?: string;
  dataTestId?: string;
  debounce?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: initialValue,
  onChange,
  placeholder = "Search...",
  dataTestId,
  debounce = 300,
  ...nativeProps
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(handler);
  }, [value, debounce, onChange]);

  return (
    <fieldset className="fieldset w-full sm:w-auto">
      <legend className="fieldset-legend text-sm">{placeholder}</legend>
      <label className="input input-bordered input-sm relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 h-3 w-3" />
        <input
          type="search"
          {...nativeProps}
          data-testid={dataTestId}
          placeholder={placeholder}
          className="w-full pl-4 bg-transparent focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
    </fieldset>
  );
};
