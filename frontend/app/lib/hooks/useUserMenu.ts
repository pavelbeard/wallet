import { USER_MENU } from "@/app/components/user/user-menu-icons";
import useClickOutside from "@/app/lib/hooks/useClickOutside";
import useUserMenuStore from "@/app/lib/store/useUserMenuStore";
import { UserMenuItem } from "@/app/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

const EXPAND = "animate-short-expand";
const COLLAPSE = "animate-short-collapse";
const SLIDE_IN_LEFT = "animate-short-slide-in-left";
const SLIDE_OUT_LEFT = "animate-short-slide-out-left";

/**
 * Manages a state of the user menu, allows to be open to only on menu item.
 */
export default function useUserMenu() {
  const isOpenDesktop = useUserMenuStore((state) => state.isOpenDesktop);
  const toggleOpenDesktop = useUserMenuStore(
    (state) => state.toggleOpenDesktop,
  );
  const closeDesktop = useUserMenuStore((state) => state.closeDesktop);
  const isOpenMobile = useUserMenuStore((state) => state.isOpenMobile);
  const toggleOpenMobile = useUserMenuStore((state) => state.toggleOpenMobile);
  const closeMobile = useUserMenuStore((state) => state.closeMobile);

  const desktopRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [isDelayActive, setDelay] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(closeDesktop);

  useEffect(() => {
    if (isOpenDesktop) {
      setDelay(true);
      desktopRef.current?.classList.add(EXPAND);
    } else {
      desktopRef.current?.classList.replace(EXPAND, COLLAPSE);
      const timer = setTimeout(() => setDelay(false), 120);
      return () => clearTimeout(timer);
    }

    return () => desktopRef.current?.classList.remove(COLLAPSE);
  }, [isOpenDesktop]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.log("isOpenMobile", isOpenMobile);

    if (isOpenMobile) {
      setDelay(true);
      mobileRef.current?.classList.add(SLIDE_OUT_LEFT);
    } else {
      mobileRef.current?.classList.replace(SLIDE_OUT_LEFT, SLIDE_IN_LEFT);
      const timer = setTimeout(() => setDelay(false), 100);
      return () => {
        mobileRef.current?.classList.remove(SLIDE_OUT_LEFT);
        clearTimeout(timer);
      };
    }

    return () => mobileRef.current?.classList.remove(SLIDE_OUT_LEFT);
  }, [isOpenMobile]);

  const userMenu: UserMenuItem[] = useMemo(
    () => USER_MENU.map((item) => ({ ...item, title: item.title })),
    [],
  );

  return {
    desktopRef,
    mobileRef,
    ref,
    isOpen: isOpenDesktop || isDelayActive,
    toggleOpen: toggleOpenDesktop,
    isOpenMobile: isOpenMobile || isDelayActive,
    toggleOpenMobile,
    closeMobile,
    userMenu,
  };
}
