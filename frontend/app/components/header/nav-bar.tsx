import { NavBarProps } from "@/app/lib/types/header";

export default function NavBar({ className, children }: NavBarProps) {
  return (
    <nav className={className}>
      <ul className="flex flex-col lg:flex-row text-sm">{children}</ul>
    </nav>
  );
}
