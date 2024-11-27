import useDropdownMenu from "@/app/lib/hooks/header/useDropdownMenu";
import { DropdownMenuProps } from "@/app/lib/types/header";
import clsx from "clsx";

export default function DropdownMenu({ children }: DropdownMenuProps) {
  const { containerRef, isVisible } = useDropdownMenu();

  return (
    <div
      ref={containerRef}
      aria-expanded={isVisible}
      className={clsx(
        "header-desktop-dropdown",
        isVisible ? "visible active" : "invisible",
      )}
    >
      <div className="pt-24"></div>
      <div className="header-desktop-dropdown__container">
        <div className="header-desktop-dropdown__inner-container">
          {isVisible && children}
        </div>
      </div>
    </div>
  );
}
