"use client";

import { useHeaderContext } from "@/app/components/header/header-provider";
import NavBarRoot from "@/app/components/header/nav-bar-root";
import LogoHeader from "@/app/ui/logo-header";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const {
    leftMenu,
    rightMenu,
    isBurgerOpen,
    toggleBurgerMenu,
    isDesktopScreen,
  } = useHeaderContext();
  const animationRef = useRef<HTMLElement>(null);
  const [isAppeared, setAppeared] = useState(false);
  const [nextAnimationCollapseRight, setNextAnimation] = useState(false);

  useEffect(() => {
    let timer;

    if (isBurgerOpen) {
      setNextAnimation(true);
      animationRef.current?.classList.add(
        "animate-medium-slide-from-far-right-to-right",
      );
      timer = setTimeout(() => setAppeared(true), 500);
    } else {
      setAppeared(false);
      animationRef.current?.classList.remove(
        "animate-medium-slide-from-far-right-to-right",
      );
      animationRef.current?.classList.add(
        "animate-medium-slide-from-right-to-far-right",
      );
      timer = setTimeout(() => setNextAnimation(false), 420);
    }

    return () => clearTimeout(timer);
  }, [isBurgerOpen]);

  const desktopHeader = (
    <div
      className={clsx(
        "grid relative grid-cols-3",
        "bg-slate-300 rounded-full justify-items-stretch items-center p-4 z-10",
        "shadow-slate-800 drop-shadow-2xl",
      )}
    >
      <NavBarRoot menu={leftMenu} position="left" />
      <LogoHeader position="center" />
      <NavBarRoot menu={rightMenu} position="right" />
    </div>
  );

  const mobileHeader = (
    <>
      <aside className="flex items-center justify-between relative bg-slate-300 p-2 h-12">
        <LogoHeader position="center" />
        <Bars3Icon className="size-6" onClick={toggleBurgerMenu} />
      </aside>

      {(isBurgerOpen || nextAnimationCollapseRight) && (
        <>
          {/* for tablets */}
          <div className="hidden absolute top-0 z-10 w-full md:grid grid-cols-[1fr_280px]">
            {isAppeared && (
              <div
                className="min-h-screen w-full bg-black/30"
                onClick={toggleBurgerMenu}
              />
            )}
            <aside
              ref={animationRef}
              className="flex flex-col min-h-screen w-full bg-slate-300"
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
            className={clsx(
              "md:hidden absolute top-0 z-10 flex flex-col w-full bg-slate-300 min-h-[200vh]",
            )}
          >
            <div className="flex items-center justify-between p-2">
              <LogoHeader position="center" />
              <XMarkIcon className="size-6" onClick={toggleBurgerMenu} />
            </div>
            <NavBarRoot menu={leftMenu} position="center" />
          </aside>
        </>
      )}
    </>
  );

  return (
    <header className="w-full lg:py-4 lg:px-12">
      {isDesktopScreen ? desktopHeader : mobileHeader}
    </header>
  );
}
