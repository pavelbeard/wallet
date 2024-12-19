"use client";

import AuthMethodLogo from "@/app/components/user/auth-method-logo";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";

type Props = { src?: string | null; provider: string | "Credentials" };

/**
 *
 * @src User image src
 * @provider Needs for auth method icon
 */
export default function UserAvatar({ src, provider }: Props) {
  const isDesktop = useDesktopBreakpoint();

  if (src) {
    // desktop oauth avatar
    if (isDesktop) {
      return (
        <div data-type="desktop-oauth-avatar" className="relative">
          <div className="hover-avatar">
            <Image
              className="rounded-full"
              src={src}
              alt="user-avatar"
              width="64"
              height="64"
            />
            <AuthMethodLogo provider={provider} />
          </div>
        </div>
      );
    } else {
      // mobile oauth avatar
      <div data-type="mobile-oauth-avatar" className="relative">
        <div className="hover-avatar">
          <Image
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
    // desktop credentials avatar
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
            <UserCircleIcon className="size-[64px]" />
            <AuthMethodLogo provider={provider} />
          </div>
        </div>
      );
    } else {
      // mobile credentials avatar
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
            <UserCircleIcon className="size-12" />
            <AuthMethodLogo provider={provider} />
          </div>
        </div>
      );
    }
  }
}
