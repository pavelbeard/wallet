import { useHeaderContext } from "@/app/components/header/header-provider";
import NavBarSubMenuItem from "@/app/components/header/nav-bar-sub-menu-item";
import type { NavBarItem, NavBarItemLevel } from "@/app/lib/types";
import { Link } from "@/i18n/routing";
import { clsx } from "clsx";
import { useLocale } from "next-intl";
import { useId } from "react";

type NavBarItemProps = NavBarItem & NavBarItemLevel;

export default function NavBarItem({ title, url, subMenu }: NavBarItemProps) {
  const dropdownId = useId();
  const locale = useLocale();
  const {
    isDesktopScreen,
    visibility,
    changeVisibility,
    isVisibleRest,
    toggleVisibility,
  } = useHeaderContext();
  const isVisible = visibility(title);

  const underline = (
    <span
      className={clsx(
        isVisible ? "max-w-full" : "max-w-0",
        "block h-[0.8px] bg-slate-800 transition-all duration-500",
      )}
    />
  );

  const desktop = (
    <li
      className="px-2"
      onMouseEnter={() => changeVisibility(title, true)}
      onMouseLeave={() => changeVisibility(title, false)}
      id={dropdownId}
      data-dropdown="dropdown-desktop"
      data-dropdown-trigger="hover"
    >
      {url ? (
        <Link className="text-lg font-bold" locale={locale} href={url}>
          {title}
          {underline}
        </Link>
      ) : (
        <span className="text-lg block w-fit font-bold">
          {title}
          {underline}
        </span>
      )}
      {subMenu && (
        <NavBarSubMenuItem
          parentId={dropdownId}
          parentTitle={title}
          cb={toggleVisibility}
          subMenu={subMenu}
          isVisible={isVisible}
        />
      )}
    </li>
  );

  const mobile = !isVisible
    ? isVisibleRest && (
        <li
          aria-hidden={isVisibleRest}
          className="px-10"
          onClick={() => toggleVisibility(title, true)}
        >
          {url ? (
            <Link className="hover:text-gray-100" locale={locale} href={url}>
              {title}
            </Link>
          ) : (
            <button
              className="hover:text-gray-100 text-lg font-bold"
              id={dropdownId}
              data-dropdown="dropdown-mobile"
              data-dropdown-toggle="dropdown-btn"
              type="button"
            >
              {title}
            </button>
          )}
        </li>
      )
    : subMenu && (
        <NavBarSubMenuItem
          parentId={dropdownId}
          parentTitle={title}
          cb={toggleVisibility}
          subMenu={subMenu}
          isVisible={isVisible}
        />
      );

  return isDesktopScreen ? desktop : mobile;
}
