"use client";

import useHeader from "@/app/lib/hooks/header/useHeader";
import useUser from "@/app/lib/hooks/ui/useUser";
import { OuterHeaderContext } from "@/app/lib/providers/header";
import clsx from "clsx";
import HeaderDesktop from "./header-desktop";
import HeaderMobile from "./header-mobile";
import "./style.css";

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
          <HeaderDesktop user={user} data-testid="header-desktop-nav" />
        ) : (
          <HeaderMobile
            sidebarMenuRef={sidebarMenuRef}
            sidebarSection={sidebarSection}
            toggleSidebarSection={toggleSidebarSection}
            isBurgerOpen={isBurgerOpen}
            toggleBurgerMenu={toggleBurgerMenu}
            user={user}
            data-testid="header-mobile-nav"
          />
        )}
      </header>
    </OuterHeaderContext.Provider>
  );
}
