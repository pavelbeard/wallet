import {
  useInnerHeaderContext,
  useOuterHeaderContext,
} from "@/app/lib/providers/header";
import { RefObject, useEffect, useRef } from "react";

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
    if (containerRef.current && isVisible) {
      dropdownMenuRef.current?.style.setProperty(
        "--dropdown-height",
        `${containerRef.current.offsetHeight}px`,
      );
    }
  }, [containerRef, dropdownMenuRef, isVisible]);

  useEffect(() => {
    if (visibilityState == "closed") {
      dropdownMenuRef.current?.style.setProperty("--dropdown-height", "0px");
    }
  }, [visibilityState]);

  return { containerRef, dropdownMenuRef, isVisible };
};

export default useDropdownMenu;
