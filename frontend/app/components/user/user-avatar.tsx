"use client";

import AuthMethodLogo from "@/app/components/user/auth-method-logo";
import useUserMenu from "@/app/lib/hooks/ui/useUserMenu";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import UserMenuDesktop from "@/app/ui/user-menu";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { createPortal } from "react-dom";

type Props = { src?: string | null; provider: string | "Credentials" };

/**
 *
 * @src User image src
 * @provider Needs for auth method icon
 */
export default function UserAvatar({ src, provider }: Props) {
  const { isOpen, toggleOpen, toggleOpenMobile } = useUserMenu();
  const isDesktop = useDesktopBreakpoint();

  if (src) {
    if (isDesktop) {
      return (
        <div
          data-type="desktop-oauth-avatar"
          className="relative hidden lg:block"
        >
          <div className="hover-avatar">
            <Image
              onClick={toggleOpen}
              className="rounded-full"
              src={src}
              alt="user-avatar"
              width="64"
              height="64"
            />
            <AuthMethodLogo provider={provider} />
          </div>
          {isOpen && createPortal(<UserMenuDesktop />, document.body)}
        </div>
      );
    } else {
      <div data-type="mobile-oauth-avatar" className="relative block lg:hidden">
        <div className="hover-avatar">
          <Image
            onClick={toggleOpenMobile}
            className="rounded-full"
            src={src}
            alt="user-avatar"
            width="48"
            height="48"
          />
          <AuthMethodLogo provider={provider} />
        </div>
      </div>;
    }
  } else {
    if (isDesktop) {
      return (
        <div
          data-type="desktop-avatar"
          className={clsx(
            "relative hidden items-center justify-center lg:flex",
            "size-16 rounded-full border-[1px] border-gray-300 bg-gray-100",
            "dark:border-slate-600 dark:bg-slate-800",
          )}
        >
          <div className="hover-avatar">
            <UserCircleIcon onClick={toggleOpen} className="size-[64px]" />
            <AuthMethodLogo provider={provider} />
          </div>
          {isOpen && createPortal(<UserMenuDesktop />, document.body)}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col lg:hidden">
          <div
            data-type="mobile-avatar"
            className={clsx(
              "relative flex items-center justify-center",
              "size-16 rounded-full border-[1px] border-gray-300 bg-gray-100",
              "dark:border-slate-600 dark:bg-slate-800",
            )}
          >
            <UserCircleIcon onClick={toggleOpenMobile} className="size-12" />
            <AuthMethodLogo provider={provider} />
          </div>
        </div>
      );
    }
  }
}
