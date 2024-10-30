"use client";

import Card from "@/app/ui/card";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import { Link } from "@/i18n/routing";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";

export default function Error() {
  window.document.title = "Error";

  const locale = useLocale();
  const t = useTranslations("error");
  return (
    <LayoutPublicContainer color="error-bg">
      <Card>
        <div className="flex justify-center flex-col items-center p-4 font-bold text-red-500">
          <section className="p-4 flex items-center">
            <XCircleIcon className="size-8" />
            <span className="ml-1">{t("error500")}</span>
          </section>
          <section className="p-4">
            <Link
              className={clsx(
                "p-4 bg-slate-800 text-white",
                "rounded-full mt-4 shadow-slate-800 drop-shadow-lg",
                "hover:bg-slate-300 hover:text-black",
              )}
              locale={locale}
              href={"/"}
            >
              {t("toMainPage")}
            </Link>
          </section>
        </div>
      </Card>
    </LayoutPublicContainer>
  );
}
