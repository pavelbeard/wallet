"use client";

import SideBar from "@/app/components/dashboard/side-bar";
import TopBar from "@/app/components/dashboard/top-bar";
import useDashboard from "@/app/lib/hooks/ui/useDashboard";
import { LayoutLogo } from "@/app/ui/layout-logo";
import LogoHeader from "@/app/ui/logo-header";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import PageName from "./page-name";

export default function LayoutSideElementsMobile() {
  const { mobileRef, isAppeared, isBurgerOpen, toggleBurgerMenu } =
    useDashboard();

  return (
    <>
      {isBurgerOpen && (
        <div className="absolute z-10 grid w-full grid-cols-[250px_1fr]">
          <aside ref={mobileRef} className="flex min-h-screen flex-col">
            <div className="bg-slate-100 p-4 shadow-black drop-shadow-md dark:bg-slate-800 dark:text-gray-100">
              <button data-testid="burger-close-btn" onClick={toggleBurgerMenu}>
                <XMarkIcon className="size-6" />
              </button>
            </div>
            
            <LayoutLogo />
            <TopBar />
            <SideBar />
          </aside>
          {isAppeared && (
            <div
              data-testid="burger-close-layout-btn"
              className="w-full bg-black/30"
              onClick={toggleBurgerMenu}
            />
          )}
        </div>
      )}

      <header
        className={clsx(
          "relative z-0 flex items-center justify-between bg-slate-100 p-4 shadow-black drop-shadow-md lg:hidden",
          "dark:bg-slate-800 dark:text-gray-100",
        )}
        aria-label="header-mobile"
      >
        <button
          className="flex flex-grow basis-0"
          data-testid="burger-open-btn"
          onClick={toggleBurgerMenu}
        >
          <Bars3Icon className="size-6" />
        </button>

        <PageName className="flex items-center justify-center font-bold" />

        <LogoHeader position="right" />
      </header>
    </>
  );
}
