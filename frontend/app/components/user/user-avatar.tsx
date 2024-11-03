"use client";

import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import useUserMenu from "@/app/lib/hooks/useUserMenu";
import AuthMethodLogo from "@/app/ui/auth-method-logo";
import UserMenuDesktop from "@/app/ui/user-menu";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = { src?: string | null; provider: string | "Credentials" };

/**
 *
 * @src User image src
 * @provider Needs for auth method icon
 */
export default function UserAvatar({ src, provider }: Props) {
  const { ref, isOpen, toggleOpen, toggleOpenMobile } = useUserMenu();
  const isDesktop = useDesktopBreakpoint();

  return src ? (
    isDesktop ? (
      <div
        ref={ref}
        data-type="desktop-oauth-avatar"
        className="hidden lg:block relative"
      >
        <Image
          onClick={toggleOpen}
          className="rounded-full"
          src={src}
          alt="user-avatar"
          width={64}
          height={64}
        />
        <AuthMethodLogo provider={provider} />
        {isOpen && <UserMenuDesktop />}
      </div>
    ) : (
      <div data-type="mobile-oauth-avatar" className="block lg:hidden relative">
        <Image
          onClick={toggleOpenMobile}
          className="rounded-full"
          src={src}
          alt="user-avatar"
          width={48}
          height={48}
        />
        <AuthMethodLogo provider={provider} />
      </div>
    )
  ) : isDesktop ? (
    <div
      ref={ref}
      data-type="desktop-avatar"
      className="hidden relative lg:flex justify-center items-center bg-gray-100 size-16 border-[1px] border-gray-300 rounded-full"
    >
      <UserCircleIcon
        className="hidden lg:block hover:stroke-2"
        onClick={toggleOpen}
        width={64}
        height={64}
      />
      <AuthMethodLogo provider={provider} />
      {isOpen && <UserMenuDesktop />}
    </div>
  ) : (
    <div className="lg:hidden flex flex-col">
      <div
        data-type="mobile-avatar"
        className="relative flex justify-center items-center bg-gray-100 size-16 border-[1px] border-gray-300 rounded-full"
      >
        <UserCircleIcon
          className="block lg:hidden hover:stroke-2"
          onClick={toggleOpenMobile}
          width={48}
          height={48}
        />
        <AuthMethodLogo provider={provider} />
      </div>
    </div>
  );
}
