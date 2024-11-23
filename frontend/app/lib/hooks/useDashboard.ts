import { useEffect, useRef, useState } from "react";
import useUserMenuStore from "../store/useUserMenuStore";
import useBurgerMenu from "./useBurgerMenu";

const SLIDE_RIGHT = "animate-medium-slide-to-right";
const SLIDE_LEFT = "animate-medium-slide-to-left";

export default function useDashboard() {
  const { isBurgerOpen, toggleBurgerMenu, setIsBurgerOpen } = useBurgerMenu();
  const isOpenMobile = useUserMenuStore((state) => state.isOpenMobile);
  const closeMobile = useUserMenuStore((state) => state.closeMobile);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [delayIsActive, setDelay] = useState(false);
  const [isAppeared, setAppeared] = useState(false);

  useEffect(() => {
    let timer;

    // slide to right side bar (expand) animation (-50ms)
    if (isBurgerOpen) {
      setDelay(true);
      mobileRef.current?.classList.add(SLIDE_RIGHT);
      timer = setTimeout(() => setAppeared(true), 450);

      // slide to left side bar (collapse) animations (-50ms)
    } else {
      setAppeared(false);
      mobileRef.current?.classList.replace(SLIDE_RIGHT, SLIDE_LEFT);
      timer = setTimeout(() => {
        setDelay(false);
        closeMobile();
      }, 450);
    }

    return () => {
      mobileRef.current?.classList.remove(SLIDE_LEFT);
      clearTimeout(timer);
    };
  }, [isOpenMobile, closeMobile, isBurgerOpen, setIsBurgerOpen]);

  return {
    mobileRef,
    isAppeared,
    isBurgerOpen: isBurgerOpen || delayIsActive,
    toggleBurgerMenu,
  };
}
