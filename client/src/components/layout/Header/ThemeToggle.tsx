import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks";
import { getValidClassNames } from "@/helpers";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle Dark Mode"
      className={getValidClassNames(
        "btn btn-square btn-ghost swap swap-rotate",
        { "swap-active": theme === "dark" }
      )}
    >
      <Sun className="swap-on w-6 h-6" />
      <Moon className="swap-off w-6 h-6" />
    </button>
  );
}
