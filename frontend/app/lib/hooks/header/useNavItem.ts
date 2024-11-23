import { useOuterHeaderContext } from "@/app/lib/providers/header";
import { VisibilityState } from "@/app/lib/types/header/index.d";
import { ReactNode, useEffect, useRef, useState } from "react";
import useDesktopBreakpoint from "../useDesktopBreakpoint";

const useNavItem = (children: ReactNode, animationOrder?: number) => {
  const navItemRef = useRef<HTMLLIElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isDesktop = useDesktopBreakpoint();
  const { setVisibilityMain } = useOuterHeaderContext();

  const opening = () => {
    if (children) {
      setIsVisible(true);
      setVisibilityMain(VisibilityState.OPENED);
    }
  };

  const closing = () => {
    if (children) {
      setIsVisible(false);
      setVisibilityMain(VisibilityState.CLOSED);
    }
  };

  useEffect(() => {
    if (animationOrder) {
      const navItem = navItemRef.current;
      if (navItem) {
        navItem.style.setProperty(
          "--animation-order",
          animationOrder.toString(),
        );
      }
    }
  }, [isVisible, animationOrder]);

  return { opening, closing, isVisible, navItemRef, isDesktop };
};

export default useNavItem;
