"use client";

import ChangeLanguageModal from "@/app/components/utils/change-language-modal";
import { languages } from "@/app/components/utils/languages";
import useClickOutside from "@/app/lib/hooks/useClickOutside";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { Link, usePathname } from "@/i18n/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { RefObject, useState } from "react";
import { createPortal } from "react-dom";

export default function ChangeLanguage() {
  const isDesktop = useDesktopBreakpoint();
  const [isOpen, setOpen] = useState(false);
  const locale = useLocale();
  const href = usePathname();
  const ref = useClickOutside(() => setOpen(false));

  return isDesktop ? (
    <button
      className={clsx("flex items-center justify-center gap-2", "p-2 text-sm")}
      onClick={() => setOpen(true)}
    >
      {languages[locale]}
      {isOpen &&
        createPortal(
          <div
            ref={ref as RefObject<HTMLDivElement>}
            className={clsx(
              "absolute right-2 top-28 z-50",
              "flex flex-col gap-2",
              "rounded-lg border border-slate-300 bg-slate-100 p-2 dark:border-slate-600 dark:bg-slate-800",
            )}
          >
            {Object.entries(languages).map(([locale, language]) => (
              <Link
                key={locale}
                className={clsx(
                  "flex items-center gap-2",
                  "p-2 text-xs",
                  "bar-item",
                )}
                href={href}
                locale={locale}
              >
                {language}
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </button>
  ) : (
    <button
      className={clsx("flex items-center justify-center gap-2", "p-2 text-sm")}
      onClick={() => setOpen(true)}
    >
      {languages[locale]}
      {isOpen && <ChangeLanguageModal href={href} setOpen={setOpen} />}
    </button>
  );
}
