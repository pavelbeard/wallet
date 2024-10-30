import {
  ToggleVisibilityMobile,
  useHeaderContext,
} from "@/app/components/header/header-provider";
import { NavBarItem, NavBarItems } from "@/app/lib/types";
import Underline from "@/app/ui/underline";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  parentId: string;
  subMenu: NavBarItems;
  isVisible: boolean;
  parentTitle: string;
  cb: ToggleVisibilityMobile;
};

export default function NavBarSubMenuItem({
  parentId,
  subMenu,
  isVisible,
  parentTitle,
  cb,
}: Props) {
  const animationRef = useRef<HTMLUListElement>(null);
  const { isDesktopScreen } = useHeaderContext();
  const locale = useLocale();
  const [isAppeared, setAppeared] = useState(false);
  // it needs for set a wait after closing the expanded menu
  const [nextAnimationSlideUp, setNextAnimation] = useState(false);

  useEffect(() => {
    let timer;

    if (isVisible) {
      // set next animation state (slide-up) as true
      setNextAnimation(true);
      animationRef.current?.classList.add("animate-slide-down");
      timer = setTimeout(() => setAppeared(true), 280);
    } else {
      // clear appeared state
      setAppeared(false);
      // set animation slide up (collapse)
      animationRef.current?.classList.remove("animate-slide-down");
      animationRef.current?.classList.add("animate-slide-up");
      timer = setTimeout(() => setNextAnimation(false), 230);
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  const unorderedList = (
    <ul
      ref={animationRef}
      aria-labelledby={parentId}
      className={clsx(
        isVisible || nextAnimationSlideUp
          ? [
              "h-80",
              "lg:absolute lg:top-0 lg:left-0 lg:w-full lg:mt-8 lg:pt-12",
              "lg:flex lg:bg-slate-300 lg:px-4 lg:pb-4 lg:z-[-1]",
              "lg:rounded-b-[32px]",
            ]
          : "hidden h-0",
      )}
    >
      {isAppeared &&
        subMenu.map((item: NavBarItem) => (
          <li
            className="animate-short-slide-to-right lg:pl-2 w-80"
            key={item.title}
          >
            <span className="py-2 font-bold lg:text-lg">{item.title}</span>
            <ul className="py-2 flex flex-col gap-2">
              {item.subMenu?.map((item: NavBarItem) =>
                item.url ? (
                  <li
                    key={item.title}
                    className="animate-short-slide-to-right w-fit"
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

  const desktop = <div>{unorderedList}</div>;
  const mobile = (
    <>
      <button
        onClick={() => cb(parentTitle, false)}
        className="pb-2 flex items-center hover:text-gray-100"
      >
        <ArrowLeftIcon className="size-6" />
        <span className="ml-2 font-bold text-lg">{parentTitle}</span>
      </button>
      {unorderedList}
    </>
  );

  return (
    <div
      id="dropdown"
      className={clsx(!isDesktopScreen && "animate-slide", "pl-8")}
    >
      {isDesktopScreen ? desktop : mobile}
    </div>
  );
}
