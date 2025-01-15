"use client";

import useUser from "@/app/lib/hooks/ui/useUser";
import SideMenuItems from "@/app/lib/side-menu-items";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import UserAvatarSkeleton from "../user/user-avatar-skeleton";
import SideBarSignOut from "./side-bar-sign-out";

const UserAvatar = dynamic(() => import("@/app/components/user/user-avatar"), {
  ssr: false,
  loading: () => <UserAvatarSkeleton />,
});

export default function SideBar() {
  const user = useUser();
  const image = user?.image;
  const provider = user?.provider ?? "credentials";
  const t = useTranslations();
  const locale = useLocale();

  const liStyle = clsx(
    "group p-2",
    "cursor-pointer hover:rounded-xl hover:bg-white hover:shadow-black hover:drop-shadow-xl",
    "dark:hover:bg-slate-600",
  );

  return (
    <aside
      className={clsx(
        "flex flex-col",
        "border-gray-300 bg-slate-100 shadow-black drop-shadow-md",
        "dark:bg-slate-800 dark:text-gray-100",
        "dark:border-slate-600 lg:border-r-[1px]",
        "max-lg:flex-1",
      )}
    >
      <div className="flex flex-col items-start gap-4 border-b border-gray-300 p-4 dark:border-slate-600">
        <UserAvatar image={image} provider={provider} />
        <span className="hidden text-sm font-bold lg:block">
          {user?.username ?? "..."}
        </span>
        <span className="text-sm font-bold lg:hidden">
          {user?.username ?? "..."}
        </span>
      </div>
      <nav className="grid h-full grid-rows-[1fr_150px] p-4 lg:grid-rows-[1fr_50px]">
        <SideMenuItems />
        <SideBarSignOut liStyle={liStyle} t={t} locale={locale} />
      </nav>
    </aside>
  );
}
