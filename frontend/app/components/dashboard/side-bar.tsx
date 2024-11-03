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
  const t = useTranslations("sidebar");
  const locale = useLocale();

  return (
    <aside
      className={clsx(
        "p-4 border-gray-300 bg-slate-100 drop-shadow-md shadow-black",
        "lg:border-r-[1px]",
        "max-lg:flex-1",
      )}
    >
      <nav className="grid grid-rows-[1fr_50px] h-full">
        <ul className="flex flex-col gap-2">
          {sideMenu.map(({ url, title, icon }: SideBarItem) => (
            <li
              key={title}
              className={clsx(
                "group p-2",
                "hover:bg-white hover:rounded-xl hover:drop-shadow-xl hover:shadow-black cursor-pointer",
              )}
            >
              <Link className="flex items-center gap-x-2" locale={locale} href={url}>
                {icon} {title}
              </Link>
            </li>
          ))}
        </ul>
        <ul>
          <li
            className={clsx(
              "group p-2",
              "hover:bg-white hover:rounded-xl hover:drop-shadow-xl hover:shadow-black cursor-pointer",
            )}
          >
            <button
              className="flex items-center gap-x-2 font-bold"
              onClick={() =>
                signOut({
                  callbackUrl: `/${locale}${DEFAULT_SIGNED_OUT_PATH}`,
                })
              }
              type="button"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6" />
              {t("signOut")}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
