"use client";

import useUserMenu from "@/app/lib/hooks/ui/useUserMenu";
import { type UserMenuItem } from "@/app/lib/types";
import { Link, usePathname } from "@/i18n/routing";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import ChangeTheme from "../components/utils/change-theme";

const ChangeLanguage = dynamic(
  () => import("@/app/components/utils/change-language"),
  {
    ssr: false,
  },
);

type LinkProps = {
  href: string;
  locale: string;
  className: string;
  children: React.ReactNode;
};

type ListProps = {
  className: string;
  callback?: () => void;
  children: React.ReactNode;
};

function LinkItem({ href, locale, className, children }: LinkProps) {
  return (
    <Link href={href} locale={locale} className={className}>
      {children}
    </Link>
  );
}

function ListItem({ className, children }: ListProps) {
  return <li className={className}>{children}</li>;
}

function UserMenuItem({ item }: { item: UserMenuItem }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const isChangeLanguage = item.title === "userMenu.language";
  const isChangeTheme = item.title === "userMenu.theme";

  const className = clsx(
    "p-2",
    "hover:bg-white hover:text-black hover:rounded-md",
    "dark:hover:bg-slate-600 dark:hover:text-gray-100",
    "w-full flex items-center justify-between",
    item.fontBold && "font-bold",
  );

  const children = (
    <>
      <div className="flex w-full items-center gap-x-2 text-xs">
        {item.icon}
        {t(item.title)}
      </div>
      {isChangeLanguage && (
        <div className={clsx("text-xs", item.fontBold && "font-bold")}>
          <ChangeLanguage href={pathname} params={{ locale }} />
        </div>
      )}
      {isChangeTheme && (
        <div className={clsx("text-xs", item.fontBold && "font-bold")}>
          <ChangeTheme />
        </div>
      )}
    </>
  );

  if (item.url) {
    return (
      <LinkItem href={item.url} locale={locale} className={className}>
        {children}
      </LinkItem>
    );
  } else {
    return <ListItem className={className}>{children}</ListItem>;
  }
}

export function UserMenuMobile() {
  const { userMenu, mobileRef, toggleOpenMobile } = useUserMenu();

  return (
    <nav
      className={clsx(
        "w-full flex-1 bg-slate-100 p-2 text-slate-800",
        "dark:bg-slate-800 dark:text-slate-100",
      )}
    >
      <div ref={mobileRef}>
        <button
          className="flex items-center gap-x-2 p-2"
          onClick={toggleOpenMobile}
        >
          <ArrowLeftIcon className="size-6" />
          Back
        </button>
        <ul>
          {userMenu.map((item) => (
            <UserMenuItem key={item.title} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default function UserMenuDesktop() {
  const { ref, userMenu } = useUserMenu();

  return (
    <nav
      ref={ref}
      className={clsx(
        "absolute right-4 top-28 z-50 block",
        "w-64 max-w-96 p-4 py-4",
        "rounded-md border-[1px] border-slate-300 bg-slate-100 shadow-black drop-shadow-md",
        "text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
      )}
    >
      <ul>
        {userMenu.map((item) => (
          <UserMenuItem key={item.title} item={item} />
        ))}
      </ul>
    </nav>
  );
}
