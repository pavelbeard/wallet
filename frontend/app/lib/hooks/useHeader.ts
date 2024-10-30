import { NavBarItems } from "@/app/lib/types";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

export default function useHeader() {
  const t = useTranslations("header");
  const session = useSession();

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
            url: "/cards",
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
          title: "Cerrar session",
          url: "/auth/sign-out",
        },
      ];
    } else {
      return [
        {
          title: t('signIn'),
          url: "/auth/sign-in"
        }
      ];
    }
  }, [t]);

  const [titles, setTitles] = useState<Record<string, boolean>>(
    Object.fromEntries(leftMenu.concat(rightMenu).map((i) => [i.title, false])),
  );

  const isVisible = useCallback(
    (title: string) => {
      return titles[title];
    },
    [titles],
  );

  const changeVisibility = useCallback((title: string, open: boolean) => {
    setTitles((prevState) => {
      let newState = { ...prevState };
      newState = Object.fromEntries(
        Object.entries(newState).map((i) => [i[0], false]),
      );
      newState[title] = open;

      return newState;
    });
  }, []);

  return { leftMenu, rightMenu, visibility: isVisible, changeVisibility };
}
