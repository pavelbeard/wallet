"use client";

import PageName from "@/app/components/dashboard/page-name";
import clsx from "clsx";
import dynamic from "next/dynamic";
import ChangeLanguageSkeleton from "./change-language-skeleton";
import ChangeThemeSkeleton from "./change-theme-skeleton";

const ChangeTheme = dynamic(
  () => import("@/app/components/dashboard/change-theme"),
  {
    ssr: false,
    loading: () => <ChangeThemeSkeleton />,
  },
);

const ChangeLanguage = dynamic(
  () => import("@/app/components/dashboard/change-language"),
  {
    ssr: false,
    loading: () => <ChangeLanguageSkeleton />,
  },
);

export default function TopBar() {
  return (
    <div
      className={clsx(
        "border-b-[1px] border-gray-300 bg-slate-100 p-4 shadow-black drop-shadow-xl",
        "dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100",
        "relative flex items-start gap-x-4 lg:items-center",
        "lg:justify-end lg:drop-shadow-sm",
      )}
    >
      <div
        className="flex flex-grow basis-0 max-md:hidden"
        aria-label="for flex box"
      >
        {/* EMPTY */}
      </div>
      <PageName className="flex items-center justify-center font-bold max-lg:hidden" />
      <div className="flex flex-grow basis-0 items-center justify-start gap-4 lg:justify-end">
        <ChangeLanguage />
        <ChangeTheme />
      </div>
    </div>
  );
}
