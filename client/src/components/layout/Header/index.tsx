import { Logo } from "@/components";
import { ThemeToggle } from "@/components/layout/Header/ThemeToggle";

export function Header() {
  return (
    <header
      className="navbar bg-base-100 shadow-md px-4 justify-between"
      data-testid="tracks-header"
    >
      <Logo />
      <ThemeToggle />
    </header>
  );
}
