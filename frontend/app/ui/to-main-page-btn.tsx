"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function ToMainPageBtn() {
  const t = useTranslations();

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={clsx(
        "left-8 top-24 h-12 w-40 lg:absolute",
        "flex items-center justify-center rounded-full",
        "shadow-slate-800 drop-shadow-lg",
        "bg-slate-800 text-white hover:text-slate-800",
        "dark:bg-gray-100 dark:text-slate-800",
        "hover:bg-slate-300",
      )}
    >
      <ArrowLeftIcon className="size-4" />
      <span className="ml-2">{t("auth.page.toMainPage")}</span>
    </button>
  );
}
