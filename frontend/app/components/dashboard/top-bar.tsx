"use client";

import useUser from "@/app/lib/hooks/ui/useUser";
import clsx from "clsx";
import dynamic from "next/dynamic";
import UserAvatarSkeleton from "../user/user-avatar-skeleton";
import PageName from "./page-name";

const UserAvatar = dynamic(() => import("@/app/components/user/user-avatar"), {
  ssr: false,
  loading: () => <UserAvatarSkeleton />,
});

export default function TopBar() {
  const user = useUser();
  const image = user?.image;
  const provider = user?.provider ?? "credentials";

  return (
    <div
      className={clsx(
        "p-4 border-b-[1px] border-gray-300 bg-slate-100 drop-shadow-xl shadow-black",
        "dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600",
        "relative flex items-start lg:items-center gap-x-4",
        "lg:drop-shadow-sm lg:justify-end",
      )}
    >
      <div className="max-md:hidden flex flex-grow basis-0" aria-label="for flex box"></div>
      <PageName className="flex justify-center items-center font-bold max-lg:hidden" />
      <div className="flex flex-grow basis-0 justify-start items-center lg:justify-end gap-4">
        <span className="hidden lg:block text-lg font-bold">
          {user?.username}
        </span>
        <UserAvatar src={image} provider={provider} />
        <span className="lg:hidden text-lg font-bold">{user?.username}</span>
      </div>
    </div>
  );
}
