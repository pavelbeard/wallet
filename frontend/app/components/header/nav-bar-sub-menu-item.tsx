import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { NavBarItem } from "@/app/lib/types";
import Underline from "@/app/ui/underline";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import "./header-animations.css";

type Props = {
  parentId: string;
  subMenu: NavBarItem[];
  isVisible: boolean;
  parentTitle: string;
  callback?: () => void;
};

function UnorderedList({
  parentId,
  isVisible,
  subMenu,
}: {
  parentId: string;
  isVisible: boolean;
  subMenu: NavBarItem[];
}) {
  const animationRef = useRef<HTMLUListElement>(null);
  const locale = useLocale();
  const [isAppeared, setAppeared] = useState(false);
  const [nextAnimation, setNextAnimation] = useState(false); // it needs for set a wait after closing the expanded menu

  useEffect(() => {
    let timer;

    if (isVisible) {
      setNextAnimation(true); // set next animation state (slide-up) as true
      animationRef.current?.classList.add("slide-down");
      timer = setTimeout(() => setAppeared(true), 280);
    } else {
      setAppeared(false); // clear appeared state
      animationRef.current?.classList.replace("slide-down", "slide-up"); // set animation slide up (collapse)
      timer = setTimeout(() => setNextAnimation(false), 230);
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <ul
      ref={animationRef}
      aria-labelledby={parentId}
      className={clsx(
        isVisible || nextAnimation
          ? [
              "h-80 w-full",
              "lg:absolute lg:top-0 lg:left-0 lg:w-full lg:mt-10 lg:pt-12",
              "lg:flex lg:bg-slate-300 lg:px-4 lg:pb-4 lg:z-[-1]",
              "lg:rounded-b-[32px]",
              "dark:lg:bg-slate-800",
            ]
          : "hidden h-0",
      )}
    >
      {isAppeared &&
        subMenu.map((item: NavBarItem) => (
          <li
            className="animate-short-slide-out-right lg:pl-2 w-fit lg:w-52"
            key={item.title}
          >
            <span className="py-2 font-bold lg:text-lg">{item.title}</span>
            <ul className="py-2 flex flex-col gap-2">
              {item.subMenu?.map((item: NavBarItem) =>
                item.url ? (
                  <li
                    key={item.title}
                    className="animate-short-slide-out-right w-fit"
                  >
                    <Link className="group" locale={locale} href={item.url}>
                      {item.title}
                      <Underline />
                    </Link>
                  </li>
                ) : (
                  <li key={item.title} className="w-fit">
                    <span className="group">
                      {item.title}
                      <Underline />
                    </span>
                  </li>
                ),
              )}
            </ul>
          </li>
        ))}
    </ul>
  );
}

export default function NavBarSubMenuItem({
  parentId,
  subMenu,
  isVisible,
  parentTitle,
  callback,
}: Props) {
  const isDesktop = useDesktopBreakpoint();
  return isDesktop ? (
    <div id="dropdown-desktop" className="pl-8">
      <UnorderedList
        parentId={parentId}
        subMenu={subMenu}
        isVisible={isVisible}
      />
    </div>
  ) : (
    <div id="slide-mobile" className="animate-slide pl-8">
      <button
        data-type="slide-submenu-mobile"
        data-testid="slide-submenu-mobile"
        onClick={callback}
        className="pb-2 flex items-center hover:text-gray-600 dark:hover:text-gray-200"
      >
        <ArrowLeftIcon className="size-6" />
        <span className="ml-2 font-bold text-lg">{parentTitle}</span>
      </button>
      <UnorderedList
        parentId={parentId}
        subMenu={subMenu}
        isVisible={isVisible}
      />
    </div>
  );
}
