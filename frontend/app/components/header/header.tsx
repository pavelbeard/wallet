"use client";

import NavBarRoot from "@/app/components/header/nav-bar-root";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import useHeader from "@/app/lib/hooks/useHeader";
import LogoHeader from "@/app/ui/logo-header";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";

function DesktopHeader() {
  const { leftMenu, rightMenu } = useHeader();
  return (
    <div
      className={clsx(
        "grid relative grid-cols-3",
        "bg-slate-300 rounded-full justify-items-stretch items-center p-4 z-10",
        // "shadow-slate-800 drop-shadow-2xl",
        "dark:bg-slate-800 dark:text-gray-100"
      )}
    >
      <NavBarRoot menu={leftMenu} position="left" />
      <LogoHeader position="center" />
      <NavBarRoot menu={rightMenu} position="right" />
    </div>
  );
}

function MobileHeader() {
  const {
    mobileRef,
    isAppeared,
    leftMenu,
    rightMenu,
    isBurgerOpen,
    toggleBurgerMenu,
  } = useHeader();

  return (
    <>
      <aside
        data-type="header-mobile"
        data-testid="header-mobile"
        className={clsx(
          "flex items-center justify-between relative bg-slate-300 p-2 h-12",
          "dark:bg-slate-800 dark:text-gray-100"
        )}
      >
        <LogoHeader position="center" />
        <button data-testid="burger-menu-btn" onClick={toggleBurgerMenu}>
          <Bars3Icon className="size-6" />
        </button>
      </aside>

      {/* side bar */}
      {isBurgerOpen && (
        <>
          {/* for tablets */}
          <div className="hidden absolute top-0 z-10 w-full md:grid grid-cols-[1fr_280px] min-h-screen">
            {isAppeared && (
              <div
                className="min-h-screen w-full bg-black/30"
                onClick={toggleBurgerMenu}
              />
            )}
            <aside
              data-type="header-expanded-md"
              ref={mobileRef}
              className={clsx(
                "flex flex-col min-h-screen w-full bg-gray-100",
                "dark:bg-slate-600 dark:text-gray-100"
              )}
            >
              <div className="flex items-center justify-between p-2">
                <LogoHeader position="center" />
                <XMarkIcon className="size-6" onClick={toggleBurgerMenu} />
              </div>
              <NavBarRoot menu={leftMenu} position="center" />
            </aside>
          </div>

          {/* for smartphone screens */}
          <aside
            data-type="header-expanded-sm"
            className={clsx(
              "md:hidden absolute top-0 z-10 grid grid-rows-[auto_1fr] overflow-hidden w-full bg-gray-100",
              "dark:bg-slate-600 dark:text-gray-100"
            )}
          >
            <div className="flex items-center justify-between p-2">
              <LogoHeader position="center" />
              <XMarkIcon className="size-6" onClick={toggleBurgerMenu} />
            </div>
            <NavBarRoot menu={leftMenu} position="left" />
          </aside>
        </>
      )}
    </>
  );
}

export default function Header() {
  const isDesktop = useDesktopBreakpoint();

  return isDesktop ? (
    <header className="w-full py-4 px-12">
      <DesktopHeader />
    </header>
  ) : (
    <header className="w-full">
      <MobileHeader />
    </header>
  );
}
