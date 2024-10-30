"use client";

import useBurgerMenu from "@/app/lib/hooks/useBurgerMenu";
import useHeader from "@/app/lib/hooks/useHeader";
import useMediaBreakpoint from "@/app/lib/hooks/useMediaBreakpoint";
import { NavBarItems, Props } from "@/app/lib/types";
import { createContext, useContext, useState } from "react";

type HeaderContext = {
  leftMenu: NavBarItems;
  rightMenu: NavBarItems;
  isBurgerOpen: boolean;
  isDesktopScreen: boolean;
  isVisibleRest: boolean;
  toggleBurgerMenu: () => void;
  visibility: (title: string) => boolean;
  changeVisibility: (title: string, open: boolean) => void;
  toggleVisibility: (title: string, open: boolean) => void;
};

export type ToggleVisibilityMobile = HeaderContext["toggleVisibility"];

const HeaderContext = createContext<HeaderContext>({} as HeaderContext);

export default function HeaderProvider({ children }: Props) {
  const { leftMenu, rightMenu, visibility, changeVisibility } = useHeader();
  const { isBurgerOpen, toggleBurgerMenu } = useBurgerMenu();
  const isDesktopScreen = useMediaBreakpoint(1024);
  // for mobile devices
  const [isVisibleRest, setIsVisibleRest] = useState(true);
  const toggleVisibility = (title: string, open: boolean) => {
    setIsVisibleRest(!isVisibleRest);
    changeVisibility(title, open);
  };

  const providerContext: HeaderContext = {
    leftMenu,
    rightMenu,
    isBurgerOpen,
    isDesktopScreen,
    toggleBurgerMenu,
    visibility,
    changeVisibility,
    isVisibleRest,
    toggleVisibility,
  };

  return (
    <HeaderContext.Provider value={providerContext}>
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeaderContext = () => {
  return useContext(HeaderContext);
};
