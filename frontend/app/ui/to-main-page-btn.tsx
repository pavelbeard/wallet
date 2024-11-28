"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function ToMainPageBtn() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Link
      locale={locale}
      href={'/'}
      className={clsx(
        "lg:absolute top-24 left-8 h-12 w-40",
        "flex justify-center items-center rounded-full",
        "shadow-slate-800 drop-shadow-lg",
        "bg-slate-800 text-white hover:text-slate-800",
        "dark:bg-gray-100 dark:text-slate-800",
        "hover:bg-slate-300"
      )}
    >
      <ArrowLeftIcon className="size-4" />
      <span className="ml-2">{t("auth.page.toMainPage")}</span>
    </Link>
  );
}
