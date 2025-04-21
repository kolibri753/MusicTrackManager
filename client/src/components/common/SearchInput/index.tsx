import React from "react";
import { Search } from "lucide-react";
import { DebouncedInput } from "../DebouncedInput";

interface SearchInputProps {
  value: string;
  onChange(value: string): void;
  placeholder?: string;
  testid?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  testid,
}) => (
  <div className="form-control w-full sm:w-auto">
    <label className="label">
      <span className="label-text">{placeholder}</span>
    </label>
    <div className="input-group">
      <span>
        <Search size={16} />
      </span>
      <DebouncedInput
        data-testid={testid}
        className="input input-bordered input-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);
