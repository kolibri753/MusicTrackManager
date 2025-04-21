import React, { useState, useEffect, InputHTMLAttributes } from "react";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
>;

interface DebouncedInputProps extends NativeInputProps {
  value: string;
  onChange(value: string): void;
  debounce?: number;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 300,
  ...nativeProps
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const h = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(h);
  }, [value, debounce, onChange]);

  return (
    <input
      {...nativeProps}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
