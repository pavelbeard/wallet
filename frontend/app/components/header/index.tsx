"use client";

import LogoHeader from "@/app/components/header/logo-header";
import useDropdownMenu from "@/app/lib/hooks/header/useDropdownMenu";
import useHeader from "@/app/lib/hooks/header/useHeader";
import useNavItem from "@/app/lib/hooks/header/useNavItem";
import useUser from "@/app/lib/hooks/useUser";
import {
  InnerHeaderContext,
  OuterHeaderContext,
} from "@/app/lib/providers/header";
import Underline from "@/app/ui/underline";
import { Link } from "@/i18n/routing";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { Fragment } from "react";
import {
  DesktopMenuItem,
  DropdownMenuProps,
  NavBarProps,
  NavItemProps,
} from "../../lib/types/header";
import BurgerButtonMenu from "./burger-menu-btn";
import "./style.css";

const MENU: DesktopMenuItem[] = [
  {
    title: "Why is Cartera?",
    isOnHeader: true,
  },
  {
    title: "Advantages",
    isOnHeader: true,
    children: [
      {
        title: "First one",
        isMenuRoot: true,
        children: [
          {
            title: "Because we are strong!",
          },
          {
            title: "And ferries!",
          },
        ],
      },
      {
        title: "Second one",
        isMenuRoot: true,
        children: [
          {
            title: "Because we are robust!",
          },
          {
            title: "And penguins!",
          },
        ],
      },
      {
        title: "Next?",
        isMenuRoot: true,
        children: [
          {
            title: "What will be next?",
          },
          {
            title: "I don't know...",
          },
          {
            title: "You're sure?",
          },
        ],
      },
    ],
  },
  {
    title: "Passwords",
    isOnHeader: true,
    children: [
      {
        title: "Create new password",
        isMenuRoot: true,
      },
    ],
  },
];

function NavBar({ className, children }: NavBarProps) {
  return (
    <nav className={className}>
      <ul className="flex flex-col lg:flex-row text-sm">{children}</ul>
    </nav>
  );
}

function NavItem({
  title,
  href,
  isOnHeader,
  isMenuRoot,
  animationOrder,
  onClick,
  children,
}: NavItemProps) {
  const locale = useLocale();
  const { opening, closing, isVisible, navItemRef, isDesktop } = useNavItem(
    children,
    animationOrder,
  );

  if (href) {
    return (
      <Link
        className={clsx(
          "relative inline-block px-4 py-2 z-10",
          isMenuRoot && "font-semibold text-md",
        )}
        locale={locale}
        href={href}
      >
        {title}
      </Link>
    );
  }

  return (
    <li
      onMouseEnter={() => isOnHeader && isDesktop && opening()}
      onMouseLeave={() => isOnHeader && isDesktop && closing()}
      data-testid="nav-item"
      ref={navItemRef}
      // if isOnHeader, apply animation-order
      className={clsx(!isOnHeader && "appear-from-left animation-order")}
    >
      <button
        onClick={onClick}
        className={clsx(
          // for mobile menu -> if has onClick and menuRoot, apply flex and gap-x-2
          onClick && isMenuRoot ? "flex items-center gap-x-2 px-2" : "px-4",
          "relative group inline-block py-2 z-10",
          isMenuRoot && "font-semibold text-md",
        )}
        aria-label={title}
      >
        {/* for mobile menu -> if has onClick and menuRoot, show chevron icon */}
        {onClick && isMenuRoot && <ChevronLeftIcon className="size-6" />}
        {title}
        {!onClick && <Underline />}
      </button>
      <InnerHeaderContext.Provider value={{ isVisible }}>
        {children && <ul>{children}</ul>}
      </InnerHeaderContext.Provider>
    </li>
  );
}

function DropdownMenu({ children }: DropdownMenuProps) {
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

export default function Header() {
  const {
    visibilityState,
    setVisibilityMain,
    dropdownMenuRef,
    sidebarMenuRef,
    sidebarSection,
    toggleSidebarSection,
    isDesktop,
    isBurgerOpen,
    toggleBurgerMenu,
  } = useHeader();
  const user = useUser();

  return (
    <OuterHeaderContext.Provider
      value={{
        visibilityState,
        setVisibilityMain,
        dropdownMenuRef,
        sidebarMenuRef,
      }}
    >
      <header
        ref={dropdownMenuRef}
        role="navigation"
        className={clsx(
          "px-8 py-8 md:px-16 lg:px-32 flex items-center fixed top-0 w-full justify-between z-10",
          "blur-scroll appear-from-void lg:header-desktop-navbar",
          visibilityState,
        )}
      >
        {isDesktop ? (
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
                        {item.children.map((dropdownItem, index) => (
                          <NavItem
                            key={index}
                            isMenuRoot={dropdownItem.isMenuRoot}
                            title={dropdownItem.title}
                          >
                            {dropdownItem?.children &&
                              dropdownItem?.children.map((child, index) => (
                                <NavItem
                                  key={dropdownItem.title}
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

            <NavBar className="flex flex-grow justify-end basis-0">
              {user ? (
                <NavItem isOnHeader title="Dashboard" href="/dashboard" />
              ) : (
                <NavItem isOnHeader title="Sign in" href="/auth/sign-in" />
              )}
            </NavBar>
          </>
        ) : (
          <>
            <LogoHeader className="flex flex-grow basis-0 items-center" />

            <BurgerButtonMenu
              isBurgerOpen={isBurgerOpen}
              toggleBurgerMenu={toggleBurgerMenu}
            />

            {isBurgerOpen && (
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
                                      accordionItem.children.map(
                                        (child, index) => (
                                          <NavItem
                                            key={child.title}
                                            animationOrder={index + 1}
                                            title={child.title}
                                          />
                                        ),
                                      )}
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

                <NavBar className="flex flex-grow basis-0 p-6 border-t border-slate-800 dark:border-slate-300">
                  {user ? (
                    <NavItem isOnHeader title="Dashboard" href="/dashboard" />
                  ) : (
                    <NavItem isOnHeader title="Sign in" href="/auth/sign-in" />
                  )}
                </NavBar>
              </div>
            )}
          </>
        )}
      </header>
    </OuterHeaderContext.Provider>
  );
}
