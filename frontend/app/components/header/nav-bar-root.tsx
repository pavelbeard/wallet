import { NavBarItemActions, NavBarItems } from "@/app/lib/types";
import NavBarItem from "@/app/components/header/nav-bar-item";


export default function NavBarLeft({
    leftMenu,
    visibility,
    changeVisibility
}: {
    leftMenu: NavBarItems
} & NavBarItemActions) {
    return (
        <nav>
            <ul className="pt-2 flex flex-col lg:flex-row lg:pt-0">
                {leftMenu.map(navBarItem =>
                    <NavBarItem
                        key={navBarItem.title}
                        level={0}
                        title={navBarItem.title}
                        url={navBarItem.url}
                        subMenu={navBarItem.subMenu}
                        visibility={visibility}
                        changeVisibility={changeVisibility}
                    />
                )}
            </ul>
        </nav>
    );
}