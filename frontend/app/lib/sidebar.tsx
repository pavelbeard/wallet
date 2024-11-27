import { CreditCardIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/solid";
import { SideBarItem } from "./types";

export const sideMenu: SideBarItem[] = [
  {
    title: "Main",
    url: "/dashboard",
    icon: <HomeIcon className="size-5 hover:text-black" />
  },
  {
    title: "Passwords",
    url: "/passwords",
    icon: <KeyIcon className="size-5 hover:text-black" />,
  },
  {
    title: "Cards",
    url: "/cards",
    icon: <CreditCardIcon className="size-5 hover:text-black" />,
  },
];
