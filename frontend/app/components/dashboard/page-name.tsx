"use client";

import { usePathname } from "@/i18n/routing";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default function PageName({ className }: { className?: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const pageName: { [x: string]: string } = {
    "/dashboard": t("pageName.dashboard"),
    "/passwords": t("pageName.passwords"),
    "/cards": t("pageName.cards"),
    "/profile": t("pageName.profile"),
    "/profile/2fa": t("pageName.2fa"),
  };

  return (
    <div className={clsx(className, "max-[420px]:hidden")}>
      {pageName[pathname]}
    </div>
  );
}
