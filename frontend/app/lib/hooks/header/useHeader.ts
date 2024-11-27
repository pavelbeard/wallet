import { VisibilityState } from "@/app/lib/types/header/index.d";
import { useEffect, useRef, useState } from "react";
import useDesktopBreakpoint from "../useDesktopBreakpoint";

/**
 * Hook for controlling header logic like animations, opening/closing accordion menu, etc.
 */
const useHeader = () => {
  const [visibilityState, setVisibilityMain] = useState<VisibilityState>(
    VisibilityState.CLOSED,
  );
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarSection, setSidebarSection] = useState<string | null>(null);
  // Burger menu for landing page
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };
  const isDesktop = useDesktopBreakpoint();

  /**
   * Controls opening/closing accordion menu
   * @param section - accordion menu section
   */
  const toggleSidebarSection = (section: string) => {
    if (sidebarSection) {
      setSidebarSection(null);
    } else {
      setSidebarSection(section);
    }
  };

  useEffect(() => {
    // Set side bar menu height value which depends on header height
    if (isBurgerOpen) {
      sidebarMenuRef.current?.style.setProperty(
        "--header-height",
        `${document.querySelector("header")?.offsetHeight}px`,
      );
    }
  }, [isBurgerOpen, sidebarMenuRef]);

  useEffect(() => {
    // Close any opened accordion menu when changing to desktop view
    if (isDesktop) {
      if (sidebarSection) {
        setSidebarSection(null);
      }
    }
  }, [isDesktop, sidebarSection]);

  useEffect(() => {
    // Use polyfill for browsers that don't support scroll-timeline
    try {
      const $navigation = dropdownMenuRef.current;
      const $rootStyle = getComputedStyle(document.documentElement);

      if ($navigation) {
        $navigation.animate(
          [
            {
              backdropFilter: "blur(5px)",
              backgroundColor: $rootStyle.getPropertyValue(
                "--header-background-color",
              ),
            },
          ],
          {
            // @ts-expect-error | Linter doesn't know about scroll-timeline-polyfill
            timeline: new ScrollTimeline({
              source: document.documentElement,
            }),
          },
        );
      }
      // On safari iOS (17.5), the polyfill doesn't work
    } catch (error) {
      console.log("Error loading scroll-timeline-polyfill");
      console.error(error);
    }
  }, []);

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
