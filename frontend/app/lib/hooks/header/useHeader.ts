import { VisibilityState } from "@/app/lib/types/header/index.d";
import { useEffect, useRef, useState } from "react";
import useBurgerMenu from "../useBurgerMenu";
import useDesktopBreakpoint from "../useDesktopBreakpoint";

const useHeader = () => {
  const [visibilityState, setVisibilityMain] = useState<VisibilityState>(
    VisibilityState.CLOSED,
  );
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarSection, setSidebarSection] = useState<string | null>(null);
  const { isBurgerOpen, toggleBurgerMenu } = useBurgerMenu();
  const isDesktop = useDesktopBreakpoint();

  const toggleSidebarSection = (section: string) => {
    if (sidebarSection) {
      setSidebarSection(null);
    } else {
      setSidebarSection(section);
    }
  };

  useEffect(() => {
    if (isBurgerOpen) {
      sidebarMenuRef.current?.style.setProperty(
        "--header-height",
        `${document.querySelector("header")?.offsetHeight}px`,
      );
    }
  }, [isBurgerOpen, sidebarMenuRef]);

  useEffect(() => {
    if (isDesktop) {
      if (sidebarSection) {
        setSidebarSection(null);
      }
    }
  }, [isDesktop, sidebarSection]);

  return {
    visibilityState,
    setVisibilityMain,
    dropdownMenuRef,
    sidebarMenuRef,
    sidebarSection,
    toggleSidebarSection,
    isBurgerOpen,
    toggleBurgerMenu,
    isDesktop,
  };
};

export default useHeader;
