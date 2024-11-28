import { User } from "next-auth";
import { Fragment } from "react";
import { MENU } from "./constants";
import NavBar from "./nav-bar";
import NavItem from "./nav-item";

export default function BurgerMenu({
  sidebarMenuRef,
  sidebarSection,
  toggleSidebarSection,
  user,
}: {
  sidebarMenuRef: React.RefObject<HTMLDivElement>;
  sidebarSection: string | null;
  toggleSidebarSection: (section: string) => void;
  user: User | undefined;
}) {
  return (
    <div
      ref={sidebarMenuRef}
      className="header-mobile-accordion-sidebar"
    >
      <NavBar className="flex px-6 pt-6 h-4/5 overflow-y-auto border-t border-slate-800 dark:border-slate-300">
        {MENU.map(
          (item) =>
            item.children && (
              <Fragment key={item.title}>
                {sidebarSection == item.title ? (
                  <>
                    <NavItem
                      isMenuRoot
                      title={item.title}
                      onClick={() => toggleSidebarSection(item.title)}
                    />
                    <div className="flex flex-col md:flex-row gap-4">
                      {item.children.map((accordionItem) => (
                        <NavItem
                          key={accordionItem.title}
                          isMenuRoot
                          title={accordionItem.title}
                        >
                          {accordionItem.children &&
                            accordionItem.children.map((child, index) => (
                              <NavItem
                                key={child.title}
                                animationOrder={index + 1}
                                title={child.title}
                              />
                            ))}
                        </NavItem>
                      ))}
                    </div>
                  </>
                ) : (
                  sidebarSection == null && (
                    <NavItem
                      key={item.title}
                      title={item.title}
                      onClick={() => toggleSidebarSection(item.title)}
                    />
                  )
                )}
              </Fragment>
            ),
        )}
      </NavBar>

      <NavBar
        className="flex flex-grow basis-0 p-6 border-t border-slate-800 dark:border-slate-300"
        data-testid="mobile-bottom-nav"
      >
        {user ? (
          <NavItem isOnHeader title="Dashboard" href="/dashboard" />
        ) : (
          <NavItem isOnHeader title="Sign in" href="/auth/sign-in" />
        )}
      </NavBar>
    </div>
  );
}