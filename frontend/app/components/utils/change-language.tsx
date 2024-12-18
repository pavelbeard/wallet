"use client";

import { Link, routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import Modal from "../layout/modal";
import { languages } from "./languages";

export default function ChangeLanguage({
  href,
  params: { locale },
}: LocaleProps & { href: string }) {
  const t = useTranslations();
  const [isOpen, setOpen] = useState(false);

  return (
    <div
      className={clsx(
        "h-[28px] lg:h-10 flex items-center justify-center gap-2 rounded-md bg-slate-100 p-2",
        "hover:bg-slate-600 dark:bg-slate-800 hover:text-slate-100",
      )}
    >
      <div className="flex items-center gap-2">
        <button onClick={() => setOpen(true)}>{languages[locale]}</button>
      </div>
      {isOpen &&
        createPortal(
          <Modal closeCallback={() => setOpen(false)}>
            <div className="flex flex-col items-start gap-2 border-t border-slate-800 p-4 dark:border-slate-600">
              <h1 className="py-1">{t("userMenu.changeLanguage")}</h1>
              {routing.locales.map((locale) => (
                <Link
                  key={locale}
                  className="w-32 rounded-md bg-slate-100 p-1 lg:p-2 hover:bg-slate-600 dark:bg-slate-800"
                  href={href}
                  locale={locale}
                >
                  {languages[locale]}
                </Link>
              ))}
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
}
