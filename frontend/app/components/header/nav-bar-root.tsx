import NavBarItem from "@/app/components/header/nav-bar-item";
import useHeader from "@/app/lib/hooks/useHeader";
import { NavBarItems } from "@/app/lib/types";
import { clsx } from "clsx";

export default function NavBarRoot({
  menu,
  position,
}: {
  menu: NavBarItems;
  position: "left" | "right" | "center";
}) {
  const { activeItem, toggleActiveItem } = useHeader();

  return (
    <nav
      className={clsx(
        "max-lg:h-screen",
        position !== "center"
          ? position == "left"
            ? "justify-self-start"
            : "justify-self-end"
          : "justify-self-center",
      )}
    >
      <ul className="pt-4 flex flex-col lg:flex-row lg:pt-0 gap-2">
        {menu.map((navBarItem, index) => (
          <NavBarItem
            key={navBarItem.title}
            isActive={activeItem == index}
            hasNotActive={activeItem == null}
            onToggle={() => toggleActiveItem(index)}
            title={navBarItem.title}
            url={navBarItem.url}
            subMenu={navBarItem.subMenu}
          />
        ))}
      </ul>
    </nav>
  );
}
