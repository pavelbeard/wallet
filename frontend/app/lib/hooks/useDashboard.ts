import { useEffect, useRef, useState } from "react";
import useBurgerMenu from "./useBurgerMenu";
import { useEffectOverflow, useToggleOverflow } from "../store/useOverflowControlStore";

export default function useDashboard() {
  const { isBurgerOpen, toggleBurgerMenu: toggleBM } = useBurgerMenu();
  const toggleOverflow = useToggleOverflow();
  const mobileRef = useRef<HTMLDivElement>(null);
  const [delayIsActive, setDelay] = useState(false);
  const [isAppeared, setAppeared] = useState(false);

  useEffect(() => {
    let timer;

    // slide to right side bar (expand) animation (-50ms)
    if (isBurgerOpen) {
      setDelay(true);
      mobileRef.current?.classList.add("animate-medium-slide-to-right");
      timer = setTimeout(() => setAppeared(true), 450);

    // slide to left side bar (collapse) animations (-50ms)
    } else {
      setAppeared(false);
      mobileRef.current?.classList.replace(
        "animate-medium-slide-to-right",
        "animate-medium-slide-to-left",
      );
      timer = setTimeout(() => setDelay(false), 450);
    }

    return () => clearTimeout(timer);
  }, [isBurgerOpen]);

  useEffectOverflow();

  const toggleBurgerMenu = () => {
    toggleBM();
    toggleOverflow();
  }

  return {
    mobileRef,
    isAppeared,
    isBurgerOpen: isBurgerOpen || delayIsActive,
    toggleBurgerMenu,
  };
}
