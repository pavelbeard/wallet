import type { NavBarItem } from "@/app/lib/types";
import Link from "next/link";

export default function NavBarItem({ title, url, subMenu }: NavBarItem) {

    const navBarSubMenu = (
        <ul>
            {subMenu?.map(subMenuItem =>
                <NavBarItem
                    key={subMenuItem.title}
                    title={subMenuItem.title}
                    url={subMenuItem.url}
                    subMenu={subMenuItem.subMenu}
                />
            )}
        </ul>
    );

    return (
        <li>
            {url ? <Link href={url}>{title}</Link> : <span>{title}</span>}
            {subMenu && navBarSubMenu}
        </li>
    )
}