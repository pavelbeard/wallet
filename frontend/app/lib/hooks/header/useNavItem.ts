import { useOuterHeaderContext } from "@/app/lib/providers/header";
import { VisibilityState } from "@/app/lib/types/header/index.d";
import { ReactNode, useEffect, useRef, useState } from "react";
import useDesktopBreakpoint from "../useDesktopBreakpoint";

/**
 * This hook is used to control the opening and closing dropdown menu items
 * @param children - dropdown menu items
 * @param animationOrder - timeline animation order
 */
const useNavItem = (children: ReactNode, animationOrder?: number) => {
  const navItemRef = useRef<HTMLLIElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isDesktop = useDesktopBreakpoint();
  const { setVisibilityMain } = useOuterHeaderContext();

  /**
   * Opens dropdown menu item
   */
  const opening = () => {
    if (children) {
      setIsVisible(true);
      setVisibilityMain(VisibilityState.OPENED);
    }
  };

  /**
   * Closes dropdown menu item
   */
  const closing = () => {
    if (children) {
      setIsVisible(false);
      setVisibilityMain(VisibilityState.CLOSED);
    }
  };

  useEffect(() => {
    // Play animation due an animation order while dropdown menu is visible
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
