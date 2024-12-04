import { Link, routing, usePathname } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import Modal from "../layout/modal";
import { languages } from "./languages";

export default function ChangeLanguage({
  params: { locale },
  isOpen,
  closeForm,
}: LocaleProps & { isOpen: boolean; closeForm: () => void }) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="flex items-center justify-center gap-2 rounded-md">
      <p className="text-xs">{languages[locale]}</p>
      {isOpen &&
        createPortal(
          <Modal closeCallback={closeForm}>
            <div className="flex flex-col items-start gap-2 border-t border-slate-800 p-4 dark:border-slate-600">
              <h1 className="py-1 text-sm">{t("userMenu.language")}:</h1>
              {routing.locales.map((locale) => (
                <Link
                  key={locale}
                  className="w-32 rounded-md bg-slate-300 p-2 text-sm hover:bg-slate-600 hover:text-slate-100"
                  href={pathname}
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
