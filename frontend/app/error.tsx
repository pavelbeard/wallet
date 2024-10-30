"use client";

import Card from "@/app/ui/card";
import { Link } from "@/i18n/routing";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import LayoutContainer from "@/app/ui/layout-container";

export default function Error() {
  const locale = useLocale();
  const t = useTranslations('error');
  return (
    <LayoutContainer color="error-bg">
      <Card>
        <h1 className="flex justify-center items-center p-4 font-bold text-red-500">
          <XCircleIcon className="size-8" />
          <span className="ml-1">{t("error500")}</span>
        </h1>
      </Card>
      <Link
        className="p-4 bg-slate-300 rounded-full mt-4 shadow-slate-800 drop-shadow-lg"
        locale={locale}
        href={"/"}
      >
        {t("toMainPage")}
      </Link>
    </LayoutContainer>
  );
}
