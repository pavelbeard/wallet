import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  useEffectOverflow,
  useOverflow,
} from "../store/useOverflowControlStore";
import useBurgerMenuStore from "./useBurgerMenuStore";

export default function useBurgerMenu() {
  const { isBurgerOpen, setIsBurgerOpen } = useBurgerMenuStore(
    useShallow((state) => ({
      isBurgerOpen: state.isBurgerOpen,
      setIsBurgerOpen: state.setIsBurgerOpen,
    })),
  );
  // const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const { isOverflowHidden, setOverflowAuto, setOverflowHidden } =
    useOverflow();

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  useEffect(() => {
    const listenWindowWidth = () => {
      if (window.innerWidth > 768) setIsBurgerOpen(false);
    };

    addEventListener("resize", listenWindowWidth);

    return () => {
      window.removeEventListener("resize", listenWindowWidth);
    };
  });

  useEffect(() => {
    if (isBurgerOpen) {
      setOverflowHidden();
    } else {
      setOverflowAuto();
    }

    return () => {
      if (isOverflowHidden) setOverflowAuto();
    };
  }, [isBurgerOpen, isOverflowHidden, setOverflowAuto, setOverflowHidden]);

  useEffectOverflow();

  return {
    isBurgerOpen,
    toggleBurgerMenu,
    setIsBurgerOpen, // in very rare cases it need to use
  };
}
