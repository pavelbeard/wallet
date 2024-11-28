import { CreditCardIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/solid";
import { SideBarItem } from "./types";

export const sideMenu: SideBarItem[] = [
  {
    title: "sidebar.main",
    url: "/dashboard",
    icon: <HomeIcon className="size-5 hover:text-black" />
  },
  {
    title: "sidebar.passwords",
    url: "/passwords",
    icon: <KeyIcon className="size-5 hover:text-black" />,
  },
  {
    title: "sidebar.cards",
    url: "/cards",
    icon: <CreditCardIcon className="size-5 hover:text-black" />,
  },
];
