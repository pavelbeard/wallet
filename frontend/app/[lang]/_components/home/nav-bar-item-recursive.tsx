import Link from "next/link";

type MenuItem = {
    title: string,
    url?: string | undefined,
    subMenu?: MenuItem[] | undefined,
}

export default function NavBarItemRecursive({
    level,
    menuItem,
    openMenus,
    handleClickMenu
}: {
    level: number,
    menuItem: MenuItem,
    openMenus: OpenMenus,
    handleClickMenu: (title: string, level: number) => void
}) {
    // it's ideal
    const showUnorderedList = openMenus[level] === menuItem.title
    const toggle = () => handleClickMenu(menuItem.title, level)
    const menu = (
        !!menuItem?.url
            ? <Link href={menuItem.url}>{menuItem.title}</Link>
            : <button onClick={toggle}>{menuItem.title}</button>
    );
    const subMenu = (
        <ul>
            {showUnorderedList && !!menuItem?.subMenu && menuItem.subMenu.map(item =>
                //
                <NavBarItemRecursive
                    key={item.title}
                    level={level + 1}
                    menuItem={item}
                    openMenus={openMenus}
                    handleClickMenu={handleClickMenu}
                />
            )}
        </ul>
    );

    return <li>{menu}{subMenu}</li>
}