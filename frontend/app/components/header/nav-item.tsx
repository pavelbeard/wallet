import useNavItem from "@/app/lib/hooks/header/useNavItem";
import { InnerHeaderContext } from "@/app/lib/providers/header";
import { NavItemProps } from "@/app/lib/types/header";
import Underline from "@/app/ui/underline";
import { Link } from "@/i18n/routing";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale } from "next-intl";

export default function NavItem({
  title,
  href,
  isOnHeader,
  isMenuRoot,
  animationOrder,
  onClick,
  children,
}: NavItemProps) {
  const locale = useLocale();
  const { opening, closing, isVisible, navItemRef, isDesktop } = useNavItem(
    children,
    animationOrder,
  );

  if (href) {
    return (
      <Link
        role="nav-item-link"
        className={clsx(
          "relative inline-block px-4 py-2 z-10",
          isMenuRoot && "font-semibold text-md",
        )}
        locale={locale}
        href={href}
      >
        {title}
      </Link>
    );
  }

  return (
    <li
      role="nav-item"
      onMouseEnter={() => isOnHeader && isDesktop && opening()}
      onMouseLeave={() => isOnHeader && isDesktop && closing()}
      data-testid="nav-item"
      ref={navItemRef}
      // if isOnHeader, apply animation-order
      className={clsx(!isOnHeader && "appear-from-left animation-order")}
    >
      <button
        onClick={onClick}
        className={clsx(
          // for mobile menu -> if has onClick and menuRoot, apply flex and gap-x-2
          onClick && isMenuRoot ? "flex items-center gap-x-2 px-2" : "px-4",
          "relative group inline-block py-2 z-10",
          isMenuRoot && "font-semibold text-md",
        )}
        aria-label={title}
      >
        {/* for mobile menu -> if has onClick and menuRoot, show chevron icon */}
        {onClick && isMenuRoot && <ChevronLeftIcon className="size-6" />}
        {title}
        {!onClick && <Underline />}
      </button>
      <InnerHeaderContext.Provider value={{ isVisible }}>
        {children && <ul>{children}</ul>}
      </InnerHeaderContext.Provider>
    </li>
  );
}
