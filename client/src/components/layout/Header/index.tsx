import { ThemeToggle } from "@/components/layout/Header/ThemeToggle";

export function Header() {
  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <a className="text-xl font-bold">KolibriGroove</a>
      </div>
      <div className="flex-none">
        <ThemeToggle />
      </div>
    </div>
  );
}
