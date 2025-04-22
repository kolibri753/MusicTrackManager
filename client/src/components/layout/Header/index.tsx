import { Logo } from "@/components";
import { ThemeToggle } from "@/components/layout/Header/ThemeToggle";

export function Header() {
  return (
    <div className="navbar bg-base-100 shadow-md px-4 justify-between">
      <Logo />
      <ThemeToggle />
    </div>
  );
}
