"use client";

import SideBar from "@/app/components/dashboard/side-bar";
import UserInfo from "@/app/components/user/user-info";
import useDashboard from "@/app/lib/hooks/useDashboard";
import useUser from "@/app/lib/hooks/useUser";
import useUserMenu from "@/app/lib/hooks/useUserMenu";
import { LayoutLogo } from "@/app/ui/layout-logo";
import LogoHeader from "@/app/ui/logo-header";
import { UserMenuMobile } from "@/app/ui/user-menu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function LayoutSideElementsMobile() {
  const user = useUser();
  const { mobileRef, isAppeared, isBurgerOpen, toggleBurgerMenu } =
    useDashboard();
  const { isOpenMobile } = useUserMenu();

  return (
    <>
      {isBurgerOpen && (
        <div className="absolute z-10 grid grid-cols-[250px_1fr] w-full">
          <aside ref={mobileRef} className="flex flex-col min-h-screen">
            <div className="p-4 bg-slate-100 drop-shadow-md shadow-black">
              <button data-testid="burger-close-btn" onClick={toggleBurgerMenu}>
                <XMarkIcon className="size-6" />
              </button>
            </div>
            <LayoutLogo />
            {isOpenMobile ? (
              <UserMenuMobile />
            ) : (
              <>
                <UserInfo user={user} />
                <SideBar />
              </>
            )}
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

      <header className="lg:hidden p-4 relative z-0 flex justify-between items-center bg-slate-100 drop-shadow-md shadow-black">
        <button data-testid="burger-open-btn" onClick={toggleBurgerMenu}>
          <Bars3Icon className="size-6" />
        </button>
        <LogoHeader position="right" />
      </header>
    </>
  );
}
