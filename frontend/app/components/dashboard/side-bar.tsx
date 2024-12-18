"use client";

import { sideMenu } from "@/app/lib/sidebar";
import { SideBarItem } from "@/app/lib/types";
import { Link } from "@/i18n/routing";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const SideBarProfileMobile = dynamic(
  () => import("@/app/components/dashboard/side-bar-profile"),
  {
    ssr: false,
  },
);

const SideBarThemeMobile = dynamic(
  () => import("@/app/components/dashboard/side-bar-theme"),
  {
    ssr: false,
  },
);

export default function SideBar() {
  const t = useTranslations();
  const locale = useLocale();
  const sideBar = useMemo(() => sideMenu, []);

  const liStyle = clsx(
    "group p-2",
    "cursor-pointer hover:rounded-xl hover:bg-white hover:shadow-black hover:drop-shadow-xl dark:hover:bg-slate-600",
  );

  return (
    <aside
      className={clsx(
        "border-gray-300 bg-slate-100 p-4 shadow-black drop-shadow-md",
        "dark:bg-slate-800 dark:text-gray-100",
        "dark:border-slate-600 lg:border-r-[1px]",
        "max-lg:flex-1",
      )}
    >
      <nav className="grid h-full grid-rows-[1fr_150px]">
        <ul className="flex flex-col gap-2">
          <SideBarProfileMobile liStyle={liStyle} t={t} locale={locale} />
          {sideBar.map(({ url, title, icon }: SideBarItem) => (
            <Link
              locale={locale}
              href={url}
              key={title}
              className={clsx(
                "flex items-center gap-x-2",
                "group box-border p-2 text-sm",
                "hover:bg-white dark:hover:bg-slate-600",
                "cursor-pointer hover:rounded-xl hover:text-black hover:shadow-black hover:drop-shadow-xl",
              )}
            >
              {icon} {t(title)}
            </Link>
          ))}
        </ul>
        <ul className="flex flex-col gap-2">
          <SideBarThemeMobile liStyle={liStyle} t={t} locale={locale} />
          <li className={clsx(liStyle)}>
            <Link
              locale={locale}
              href="/auth/sign-out"
              className="flex items-center gap-x-2 text-sm font-bold"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6 group-hover:text-black" />
              {t("sidebar.signOut")}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
