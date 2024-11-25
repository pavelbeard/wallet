"use client";

import useBurgerMenuStore from "@/app/lib/hooks/useBurgerMenuStore";
import { useOverflowControlStore } from "@/app/lib/store/useOverflowControlStore";
import useUserMenuStore from "@/app/lib/store/useUserMenuStore";
import { usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isOverflowHidden, setOverflowAuto } = useOverflowControlStore(
    useShallow((state) => ({
      isOverflowHidden: state.isOverflowHidden,
      setOverflowAuto: state.setOverflowAuto,
    })),
  );

  const { isBurgerOpen, setIsBurgerOpen } = useBurgerMenuStore(
    useShallow((state) => ({
      isBurgerOpen: state.isBurgerOpen,
      setIsBurgerOpen: state.setIsBurgerOpen,
    })),
  );

  const { isOpenMobile, closeMobile } = useUserMenuStore(
    useShallow((state) => ({
      isOpenMobile: state.isOpenMobile,
      closeMobile: state.closeMobile,
    })),
  );

  useEffect(() => {
    // those things are for close any modal/burger/sidebar while navigation
    process.env.NODE_ENV === "development" && console.log("pathname", pathname);

    if (isOverflowHidden) setOverflowAuto();
    if (isBurgerOpen) setIsBurgerOpen(false);
    if (isOpenMobile) closeMobile();
  }, [pathname, searchParams]);

  return null;
}
