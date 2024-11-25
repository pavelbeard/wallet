import {
  useInnerHeaderContext,
  useOuterHeaderContext,
} from "@/app/lib/providers/header";
import { RefObject, useEffect, useRef } from "react";

/**
 * Hook for controlling dropdown menu logic like opening/closing, height animations, etc.
 */
const useDropdownMenu = () => {
  const { isVisible } = useInnerHeaderContext();
  const { visibilityState } = useOuterHeaderContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    dropdownMenuRef,
  }: {
    dropdownMenuRef: RefObject<HTMLElement>;
  } = useOuterHeaderContext();

  useEffect(() => {
    // Set dropdown menu height value which depends on header height
    if (containerRef.current && isVisible) {
      dropdownMenuRef.current?.style.setProperty(
        "--dropdown-height",
        `${containerRef.current.offsetHeight}px`,
      );
    }
  }, [containerRef, dropdownMenuRef, isVisible]);

  useEffect(() => {
    // Setting dropdown menu height to 0 when any header item is hidden
    if (visibilityState == "closed") {
      dropdownMenuRef.current?.style.setProperty("--dropdown-height", "0px");
    }
  }, [visibilityState, dropdownMenuRef]);

  return { containerRef, dropdownMenuRef, isVisible };
};

export default useDropdownMenu;
