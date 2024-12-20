"use client";

import AuthMethodLogo from "@/app/components/user/auth-method-logo";
import logger from "@/app/lib/helpers/logger";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Props = { image?: string | null; provider: string | "Credentials" };

/**
 *
 * @src User image src
 * @provider Needs for auth method icon
 */
export default function UserAvatar({ image, provider }: Props) {
  const isDesktop = useDesktopBreakpoint();
  const size = isDesktop ? 64 : 48;

  if (image) {
    return (
      <div className="relative">
        <img
          className="rounded-full"
          src={image}
          alt="user-avatar"
          width={size}
          height={size}
        />
        <AuthMethodLogo provider={provider} />
      </div>
    );
  } else {
    // desktop credentials avatar
    if (isDesktop) {
      return (
        <div
          data-type="desktop-avatar"
          className={clsx(
            "relative items-center justify-center lg:flex",
            "size-16 rounded-full border-[1px] border-gray-300 bg-gray-100",
            "dark:border-slate-600 dark:bg-slate-800",
          )}
        >
          <UserCircleIcon className="size-[64px]" />
          <AuthMethodLogo provider={provider} />
        </div>
      );
    } else {
      // mobile credentials avatar
      return (
        <div className="flex flex-col">
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
