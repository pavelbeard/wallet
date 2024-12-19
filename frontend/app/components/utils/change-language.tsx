"use client";

import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { useState } from "react";
import ChangeLanguageModal from "./change-language-modal";
import { languages } from "./languages";

export default function ChangeLanguage({
  href,
  params: { locale },
}: LocaleProps & { href: string }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        className={clsx(
          "flex h-[28px] items-center justify-center gap-2 rounded-md bg-slate-100 p-2 lg:h-10",
          "hover:bg-slate-600 hover:text-slate-100 dark:bg-slate-800",
        )}
        onClick={() => setOpen(true)}
      >
        {languages[locale]}
      </button>
      {isOpen && <ChangeLanguageModal href={href} setOpen={setOpen} />}
    </>
  );
}
