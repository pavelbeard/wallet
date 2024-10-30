"use client";

import useBurgerMenu from "@/app/lib/hooks/useBurgerMenu";
import { LayoutLogo } from "@/app/ui/layout-logo";
import LogoHeader from "@/app/ui/logo-header";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import UserInfo from "../user/user-info";
import SideBar from "./side-bar";

export default function LayoutSideElementsMobile() {
  const animationRef = useRef<HTMLDivElement>(null);
  const { isBurgerOpen, toggleBurgerMenu } = useBurgerMenu();
  const [isAppeared, setAppeared] = useState(false);

  // slide to right side bar (expand) animation (-50ms)
  useEffect(() => {
    if (isBurgerOpen) {
      animationRef.current?.classList.add("animate-medium-slide-to-right");
      const timer = setTimeout(() => setAppeared(true), 450);
      return () => clearTimeout(timer);
    }
  }, [isBurgerOpen]);

  // slide to left side bar (collapse) animations (-50ms)
  useEffect(() => {
    if (!isAppeared && isBurgerOpen) {
      animationRef.current?.classList.remove("animate-medium-slide-to-right");
      animationRef.current?.classList.add("animate-medium-slide-to-left");
      const timer = setTimeout(() => toggleBurgerMenu(), 450);
      return () => clearTimeout(timer);
    }
  }, [isAppeared]);

  return (
    <>
      {isBurgerOpen && (
        <div className="absolute z-10 grid grid-cols-[250px_1fr] w-full">
          <div ref={animationRef} className="flex flex-col min-h-screen">
            <div className="p-4 bg-slate-100 drop-shadow-md shadow-black">
              <XMarkIcon
                className="size-6"
                onClick={() => setAppeared(false)}
              />
            </div>
            <LayoutLogo />
            <UserInfo />
            <SideBar />
          </div>
          {isAppeared && (
            <div
              className="min-h-screen w-full bg-black/30"
              onClick={() => setAppeared(false)}
            />
          )}
        </div>
      )}

      <div className="lg:hidden p-4 relative z-0 flex justify-between items-center bg-slate-100 drop-shadow-md shadow-black">
        <Bars3Icon className="size-6" onClick={toggleBurgerMenu} />
        <LogoHeader position="right" />
      </div>
    </>
  );
}
