"use client";

import { sideMenu } from "@/app/lib/sidebar";
import { SideBarItem } from "@/app/lib/types";
import { Link } from "@/i18n/routing";
import { DEFAULT_SIGNED_OUT_PATH } from "@/routes";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export default function SideBar() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <aside
      className={clsx(
        "p-4 border-gray-300 bg-slate-100 drop-shadow-md shadow-black",
        "dark:bg-slate-800 dark:text-gray-100",
        "lg:border-r-[1px] dark:border-slate-600",
        "max-lg:flex-1",
      )}
    >
      <nav className="grid grid-rows-[1fr_50px] h-full">
        <ul className="flex flex-col gap-2">
          {sideMenu.map(({ url, title, icon }: SideBarItem) => (
            <Link
              locale={locale}
              href={url}
              key={title}
              className={clsx(
                "flex items-center gap-x-2",
                "box-border group p-2 text-sm",
                "hover:bg-white dark:hover:bg-slate-600",
                "hover:rounded-xl hover:drop-shadow-xl hover:shadow-black hover:text-black cursor-pointer",
              )}
            >
              {icon} {t(title)}
            </Link>
          ))}
        </ul>
        <ul>
          <li
            className={clsx(
              "group p-2",
              "hover:bg-white dark:hover:bg-slate-600 hover:rounded-xl hover:drop-shadow-xl hover:shadow-black cursor-pointer",
            )}
          >
            <button
              className="flex items-center gap-x-2 font-bold text-sm"
              onClick={() =>
                signOut({
                  callbackUrl: `/${locale}${DEFAULT_SIGNED_OUT_PATH}`,
                })
              }
              type="button"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6" />
              {t("sidebar.signOut")}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
