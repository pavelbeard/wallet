import { CreditCardIcon, KeyIcon } from "@heroicons/react/24/solid";
import { SideBarItem } from "./types";

export const sideMenu: SideBarItem[] = [
  {
    title: "Passwords",
    url: "/passwords",
    icon: <KeyIcon className="size-6 mr-2 hover:text-black" />,
  },
  {
    title: "Cards",
    url: "/cards",
    icon: <CreditCardIcon className="size-6 mr-2 hover:text-black" />,
  },
];
