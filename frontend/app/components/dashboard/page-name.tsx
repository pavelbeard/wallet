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
    "/profile/verify/email": t("pageName.verify.email"),
    "/profile/verify/password": t("pageName.verify.password"),
  };

  const keys = Object.keys(pageName);
  const matchingKeys = keys.filter((key) => pathname.startsWith(key));
  const bestMatch = matchingKeys?.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
  );

  return (
    <div className={clsx(className, "max-[420px]:hidden")}>
      {pageName[bestMatch]}
    </div>
  );
}
