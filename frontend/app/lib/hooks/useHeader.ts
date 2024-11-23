import useActiveMenuItem from "@/app/lib/hooks/useActiveMenuItem";
import useBurgerMenu from "@/app/lib/hooks/useBurgerMenu";
import {
  useEffectOverflow,
  useToggleOverflow,
} from "@/app/lib/store/useOverflowControlStore";
import useUserMenuStore from "@/app/lib/store/useUserMenuStore";
import { NavBarItems } from "@/app/lib/types";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

export default function useHeader() {
  const t = useTranslations("header");
  const session = useSession();
  const { isBurgerOpen, toggleBurgerMenu: toggleBM } = useBurgerMenu();
  const { activeItem, handleToggle: toggleActiveItem } = useActiveMenuItem();
  const isOpenMobile = useUserMenuStore((state) => state.isOpenMobile);
  const closeMobile = useUserMenuStore((state) => state.closeMobile);
  const toggleOverflow = useToggleOverflow();

  const mobileRef = useRef<HTMLElement>(null); // for expand/collapse mobile side bar
  const [isAppeared, setAppeared] = useState(false);
  const [isDelayActive, setDelay] = useState(false);

  useEffect(() => {
    let timer;

    if (isBurgerOpen) {
      setDelay(true);
      mobileRef.current?.classList.add("animate-medium-slide-in-right");
      timer = setTimeout(() => setAppeared(true), 500);
    } else {
      setAppeared(false);
      mobileRef.current?.classList.replace(
        "animate-medium-slide-in-right",
        "animate-medium-slide-out-right",
      );
      timer = setTimeout(() => setDelay(false), 450);
    }

    return () => clearTimeout(timer);
  }, [isBurgerOpen]);

  useEffectOverflow();

  const toggleBurgerMenu = () => {
    toggleBM();

    if (isOpenMobile) closeMobile();

    toggleOverflow();
  };
  const leftMenu: NavBarItems = useMemo(
    () => [
      {
        title: t("why"),
        subMenu: [
          {
            title: t("advantages"),
            url: "/advantages",
            subMenu: [
              {
                title: "Change password",
                url: "/change-password",
              },
              {
                title: "Create password",
                url: "/create-password",
              },
            ],
          },
          {
            title: "Cards",
            subMenu: [
              {
                title: "New card",
                url: "/new-card",
              },
            ],
          },
          {
            title: "About",
          },
        ],
      },
      {
        title: "Seguridad",
        subMenu: [
          {
            title: "Como nos preocupamos",
            url: "/how-we-worry-about",
          },
        ],
      },
    ],
    [t],
  );
  const rightMenu: NavBarItems = useMemo(() => {
    if (session.status == "authenticated") {
      return [
        {
          title: t("signOut"),
          url: "/auth/sign-out",
        },
      ];
    } else {
      return [
        {
          title: t("signIn"),
          url: "/auth/sign-in",
        },
      ];
    }
  }, [t, session.status]);

  return {
    mobileRef,
    isAppeared,
    leftMenu,
    rightMenu,
    isBurgerOpen: isBurgerOpen || isDelayActive,
    toggleBurgerMenu,
    activeItem,
    toggleActiveItem,
  };
}
