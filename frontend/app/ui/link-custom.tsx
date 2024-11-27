import { Link } from "@/i18n/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { ReactNode } from "react";

type Props = { children: ReactNode; href: string };

export default function CustomLink({ children, href }: Props) {
  const locale = useLocale();
  return (
    <Link
      locale={locale}
      href={href}
      className={clsx(
        "px-2 py-1 bg-slate-300 dark:bg-slate-600 rounded-lg",
        "hover:bg-slate-400 hover:text-slate-100",
      )}
    >
      {children}
    </Link>
  );
}
