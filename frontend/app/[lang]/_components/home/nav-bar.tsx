"use client";

import NavBarItemRecursive from "@/app/[lang]/_components/home/nav-bar-item-recursive";
import { useMemo, useState } from "react";

export default function NavBar() {
    const [openMenus, setOpenMenus] = useState<object>({});
    const handleClickMenu = (title: string, level: number) => {
        setOpenMenus((prevState: OpenMenus) => ({
            ...prevState,
            [level]: prevState[level] === title ? null : title
        }))
    };
    const menu = useMemo(() => [
        {
            title: 'NavBarItem1',
            subMenu: [
                {
                    title: 'SubMenu1Item1',
                    subMenu: [
                        {
                            title: 'SubMenu2Item1',
                            url: 'https://example.com',
                        }
                    ]
                }
            ],
        },
        {
            title: 'NavbarItem2',
            subMenu: [
                {
                    title: 'SubMenu1Item1',
                    url: 'https://example.com',
                }
            ]
        },
        {
            title: 'NavbarItem3'
        }
    ], []);

    return (
        <nav className="bg-blue-300">
            <ul className="flex flex-col lg:flex-row ">
                {menu.map(menuItem => (
                    <NavBarItemRecursive
                        key={menuItem.title}
                        level={0}
                        menuItem={menuItem}
                        openMenus={openMenus as OpenMenus}
                        handleClickMenu={handleClickMenu}
                    />
                ))}
            </ul>
        </nav>
    );
}