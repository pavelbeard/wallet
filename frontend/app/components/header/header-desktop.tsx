import { User } from "next-auth";
import { MENU } from "./constants";
import LogoHeader from "./logo-header";
import NavBar from "./nav-bar";
import NavItem from "./nav-item";
import DropdownMenu from "./nav-item-dropdown";

export default function HeaderDesktop({
  user,
}: {
  user: User | undefined;
}) {
  return (
    <>
      <LogoHeader className="flex flex-grow basis-0 items-center" />

      <NavBar className="flex">
        {/* Level 1 */}
        {MENU.map((item) => (
          <NavItem
            key={item.title}
            isOnHeader
            title={item.title}
            href={item?.href}
            isMenuRoot={item?.isMenuRoot}
          >
            {item.children && (
              <DropdownMenu>
                <ul className="flex gap-x-8">
                  {item.children.map((dropdownItem) => (
                    <NavItem
                      key={dropdownItem.title}
                      isMenuRoot={dropdownItem.isMenuRoot}
                      title={dropdownItem.title}
                    >
                      {dropdownItem?.children &&
                        dropdownItem?.children.map((child, index) => (
                          <NavItem
                            key={child.title}
                            animationOrder={index + 1}
                            title={child.title}
                          />
                        ))}
                    </NavItem>
                  ))}
                </ul>
              </DropdownMenu>
            )}
          </NavItem>
        ))}
      </NavBar>

      <NavBar className="flex flex-grow justify-end basis-0" data-testid="desktop-right-nav">
        {user ? (
          <NavItem isOnHeader title="Dashboard" href="/dashboard" />
        ) : (
          <NavItem isOnHeader title="Sign in" href="/auth/sign-in" />
        )}
      </NavBar>
    </>
  );
}