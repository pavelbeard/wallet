import { NavBarItems } from "@/app/lib/types";
import NavBarItem from "@/app/components/nav-bar/nav-bar-item";

export default async function NavBar() {
    const leftMenu: NavBarItems = [
        {
            title: "Home",
            subMenu: [
                {
                    title: "Passwords",
                    url: '/passwords'
                },
                {
                    title: "Cards",
                    url: '/cards'
                }
            ]
        }
    ]

    return (
        <nav className="w-full bg-slate-300 p-4">
            <ul>
                {leftMenu.map(navBarItem =>
                    <NavBarItem
                        key={navBarItem.title}
                        title={navBarItem.title}
                        url={navBarItem.url}
                        subMenu={navBarItem.subMenu}
                    />
                )}
            </ul>
        </nav>
    )
}