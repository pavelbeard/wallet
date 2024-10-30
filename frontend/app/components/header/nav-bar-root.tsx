import NavBarItem from "@/app/components/header/nav-bar-item";
import { NavBarItems } from "@/app/lib/types";
import { clsx } from "clsx";

export default function NavBarRoot({
  menu,
  position,
}: {
  menu: NavBarItems;
  position: "left" | "right" | "center";
}) {
  return (
    <nav
      className={clsx(
        "max-lg:border-t-[1px] border-slate-800",
        position !== "center"
          ? position == "left"
            ? "justify-self-start"
            : "justify-self-end"
          : "justify-self-center",
      )}
    >
      <ul className="pt-4 flex flex-col lg:flex-row lg:pt-0 gap-2">
        {menu.map((navBarItem) => (
          <NavBarItem
            key={navBarItem.title}
            level={0}
            title={navBarItem.title}
            url={navBarItem.url}
            subMenu={navBarItem.subMenu}
          />
        ))}
      </ul>
    </nav>
  );
}
