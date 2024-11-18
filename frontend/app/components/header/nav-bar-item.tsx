import NavBarSubMenuItem from "@/app/components/header/nav-bar-sub-menu-item";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import type { NavBarItem } from "@/app/lib/types";
import { Link } from "@/i18n/routing";
import { clsx } from "clsx";
import { useLocale } from "next-intl";
import { useId, useState } from "react";

type NavBarItemProps = NavBarItem;

type PropsDesktop = NavBarItemProps & {
  mouseEnter: () => void;
  mouseLeave: () => void;
  isVisible: boolean;
};

type MobileInteractProps = {
  isActive: boolean;
  hasNotActive: boolean;
  onToggle: () => void;
};

type PropsMobile = NavBarItemProps & MobileInteractProps;

const HoverUnderline = ({ isVisible }: { isVisible: boolean }) => (
  <span
    className={clsx(
      isVisible ? "max-w-full" : "max-w-0",
      "block h-[0.8px] bg-slate-800 transition-all duration-500",
      "dark:bg-gray-100",
    )}
  />
);

function NavBarItemDesktop({
  mouseEnter,
  mouseLeave,
  title,
  url,
  subMenu,
  isVisible,
}: PropsDesktop) {
  const dropdownId = useId();
  const locale = useLocale();

  return (
    <li
      className="px-2"
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      id={dropdownId}
      data-dropdown="dropdown-desktop"
      data-dropdown-trigger="hover"
    >
      {url ? (
        <Link className="text-lg font-bold" locale={locale} href={url}>
          {title}
          <HoverUnderline isVisible={isVisible} />
        </Link>
      ) : (
        <span className="text-lg block w-fit font-bold">
          {title}
          <HoverUnderline isVisible={isVisible} />
        </span>
      )}
      {subMenu && (
        <NavBarSubMenuItem
          parentId={dropdownId}
          parentTitle={title}
          subMenu={subMenu}
          isVisible={isVisible}
        />
      )}
    </li>
  );
}

function NavBarItemMobile({ title, url, hasNotActive, onToggle }: PropsMobile) {
  const dropdownId = useId();
  const locale = useLocale();

  if (!hasNotActive) return null;

  return (
    <li
      className={clsx("px-8 animate-slide")}
      data-testid={title}
      onClick={onToggle}
    >
      {url ? (
        <Link
          className="hover:text-gray-600 dark:hover:text-gray-200"
          locale={locale}
          href={url}
        >
          {title}
        </Link>
      ) : (
        <button
          className="hover:text-gray-600 text-lg font-bold dark:hover:text-gray-200"
          id={dropdownId}
          data-slide="slide-mobile"
          data-slide-toggle="slide-btn"
          type="button"
        >
          {title}
        </button>
      )}
    </li>
  );
}

export default function NavBarItem({
  isActive,
  hasNotActive,
  onToggle,
  title,
  url,
  subMenu,
}: NavBarItemProps & MobileInteractProps) {
  const dropdownSubmenuId = useId();
  const isDesktop = useDesktopBreakpoint();
  const [drilldownOn, setDrilldown] = useState(false);

  return isDesktop ? (
    <div data-type="desktop-item">
      <NavBarItemDesktop
        mouseEnter={() => setDrilldown(true)}
        mouseLeave={() => setTimeout(() => setDrilldown(false), 500)}
        title={title}
        url={url}
        subMenu={subMenu}
        isVisible={drilldownOn}
      />
    </div>
  ) : (
    <div data-type="mobile-item" data-testid="mobile-item">
      {drilldownOn && subMenu ? (
        <NavBarSubMenuItem
          parentId={dropdownSubmenuId}
          parentTitle={title}
          callback={() => {
            onToggle();
            setDrilldown(false);
          }}
          subMenu={subMenu}
          isVisible={drilldownOn}
        />
      ) : (
        <NavBarItemMobile
          isActive={isActive}
          hasNotActive={hasNotActive}
          title={title}
          url={url}
          subMenu={subMenu}
          onToggle={() => {
            onToggle();
            setDrilldown(true);
          }}
        />
      )}
    </div>
  );
}
