"use client";

import { Link, routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import Modal from "../layout/modal";
import { languages } from "./languages";

export default function ChangeLanguageModal({
  href,
  setOpen,
}: {
  href: string;
  setOpen: (value: boolean) => void;
}) {
  const t = useTranslations();

  return createPortal(
    <Modal closeCallback={() => setOpen(false)}>
      <div className="flex flex-col items-start gap-2 border-t border-slate-800 p-4 dark:border-slate-600">
        <h1 className="py-1">{t("userMenu.changeLanguage")}</h1>
        {routing.locales.map((locale) => (
          <Link
            key={locale}
            className="w-32 rounded-md bg-slate-100 p-1 hover:bg-slate-600 dark:bg-slate-800 lg:p-2"
            href={href}
            locale={locale}
          >
            {languages[locale]}
          </Link>
        ))}
      </div>
    </Modal>,
    document.body,
  );
}
