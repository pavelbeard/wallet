"use client"

import { sideMenu } from "@/app/lib/sidebar";
import { SideBarItem } from "@/app/lib/types";
import { Link } from "@/i18n/routing";
import { DEFAULT_SIGNED_OUT_PATH } from "@/routes";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export default function SideBar() {
  const t = useTranslations("sidebar");
  const locale = useLocale();

  return (
    <aside className={clsx(
      "p-4 border-gray-300 bg-slate-100 drop-shadow-md shadow-black",
      "lg:border-r-[1px]",
      "max-lg:flex-1"
    )}>
      <nav className="">
        <ul className="flex flex-col gap-2">
          {sideMenu.map(({ url, title, icon }: SideBarItem) => (
            <li
              key={title}
              className={clsx(
                "group p-2",
                "hover:bg-white hover:rounded-xl hover:drop-shadow-xl hover:shadow-black cursor-pointer",
              )}
            >
              <Link className="flex items-center" locale={locale} href={url}>
                {icon} {title}
              </Link>
            </li>
          ))}
          <li
            className={clsx(
              "group p-2",
              "hover:bg-white hover:rounded-xl hover:drop-shadow-xl hover:shadow-black cursor-pointer",
            )}
          >
            <button
              className="font-bold"
              onClick={() =>
                signOut({
                  callbackUrl: `/${locale}${DEFAULT_SIGNED_OUT_PATH}`,
                })
              }
              type="button"
            >
              {t("signOut")}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
