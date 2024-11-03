import useClickOutside from "@/app/lib/hooks/useClickOutside";
import useUserMenuStore from "@/app/lib/store/useUserMenuStore";
import { UserMenuItem } from "@/app/lib/types";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

export default function useUserMenu() {
  const isOpenDesktop = useUserMenuStore((state) => state.isOpenDesktop);
  const toggleOpenDesktop = useUserMenuStore(
    (state) => state.toggleOpenDesktop,
  );
  const closeDesktop = useUserMenuStore((state) => state.closeDesktop);
  const isOpenMobile = useUserMenuStore((state) => state.isOpenMobile);
  const toggleOpenMobile = useUserMenuStore((state) => state.toggleOpenMobile);

  const desktopRef = useRef<HTMLElement>(null);
  const [isDelayActive, setDelay] = useState(false);
  const ref = useClickOutside(closeDesktop) as RefObject<HTMLDivElement>;

  useEffect(() => {
    if (isOpenDesktop) {
      setDelay(true);
      desktopRef.current?.classList.add("animate-short-expand");
    } else {
      desktopRef.current?.classList.replace(
        "animate-short-expand",
        "animate-short-collapse",
      );
      const timer = setTimeout(() => setDelay(false), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpenDesktop]);

  const userMenu: UserMenuItem[] = useMemo(
    () => [
      {
        title: "Settings",
        url: "/Settings",
      },
      {
        title: "Profile",
        url: "/Profile",
      },
      {
        title: "Logout",
        url: "/Logout",
      },
    ],
    [],
  );

  return {
    desktopRef,
    ref,
    isOpen: isOpenDesktop || isDelayActive,
    toggleOpen: toggleOpenDesktop,
    isOpenMobile,
    toggleOpenMobile,
    userMenu,
  };
}
