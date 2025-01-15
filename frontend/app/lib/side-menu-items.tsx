"use client";

import { Link } from "@/i18n/routing";
import {
  CreditCardIcon,
  HomeIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { SideBarItem } from "./types";

export default function SideMenuItems() {
  const t = useTranslations();
  const locale = useLocale();
  const sideMenu: SideBarItem[] = [
    {
      title: t("sidebar.profile"),
      url: "/profile",
      icon: (
        <UserIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />
      ),
    },
    {
      title: t("sidebar.main"),
      url: "/dashboard",
      icon: (
        <HomeIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />
      ),
    },
    {
      title: t("sidebar.passwords"),
      url: "/passwords",
      icon: (
        <KeyIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />
      ),
    },
    {
      title: t("sidebar.cards"),
      url: "/cards",
      icon: (
        <CreditCardIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />
      ),
    },
  ];

  return (
    <ul className="flex flex-col gap-2">
      {sideMenu.map(({ url, title, icon }: SideBarItem) => (
        <Link
          locale={locale}
          href={url}
          key={title}
          className={clsx(
            "flex items-center gap-x-2",
            "group box-border p-2 text-sm",
            "bar-item",
          )}
        >
          {icon} {title}
        </Link>
      ))}
    </ul>
  );
}
