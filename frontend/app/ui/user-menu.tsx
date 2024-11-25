import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import useUserMenu from "@/app/lib/hooks/useUserMenu";
import { type UserMenuItem } from "@/app/lib/types";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";

function UserMenuItem({ item }: { item: UserMenuItem }) {
  const isDesktop = useDesktopBreakpoint();
  const locale = useLocale();
  const t = useTranslations();
  return (
    <li
      className={clsx(
        "p-2",
        "hover:bg-white hover:text-black hover:rounded-md",
        "dark:hover:bg-slate-600 dark:hover:text-gray-100",
      )}
    >
      <Link
        href={item.url}
        locale={locale}
        className={clsx(
          "w-full flex items-center justify-between",
          item.fontBold && "font-bold",
        )}
      >
        <div className="flex w-full text-sm items-center gap-x-2">
          {item.icon}
          {t(item.title)}
        </div>
        {isDesktop && (
          <p className={clsx("text-sm", item.fontBold && "font-bold")}>
            {t(item.title)}
          </p>
        )}
      </Link>
    </li>
  );
}

export function UserMenuMobile() {
  const { userMenu, mobileRef, toggleOpenMobile } = useUserMenu();

  return (
    <nav
      className={clsx("w-full p-2 flex-1 bg-slate-100", "dark:bg-slate-800")}
    >
      <div ref={mobileRef}>
        <button
          className="p-2 flex items-center gap-x-2"
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
  const { desktopRef, userMenu } = useUserMenu();

  return (
    <nav
      ref={desktopRef}
      className={clsx(
        "block absolute right-0 top-24 z-50",
        "py-4 p-4 w-64 max-w-96",
        "bg-slate-100 shadow-black drop-shadow-md border-[1px] border-slate-300 rounded-md",
        "dark:bg-slate-800 dark:border-slate-600",
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
