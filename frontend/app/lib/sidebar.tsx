import {
  CreditCardIcon,
  HomeIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { SideBarItem } from "./types";

export const sideMenu: SideBarItem[] = [
  {
    title: "sidebar.profile",
    url: "/profile",
    icon: <UserIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />,
  },
  {
    title: "sidebar.main",
    url: "/dashboard",
    icon: <HomeIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />,
  },
  {
    title: "sidebar.passwords",
    url: "/passwords",
    icon: <KeyIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />,
  },
  {
    title: "sidebar.cards",
    url: "/cards",
    icon: <CreditCardIcon className="size-5 group-hover:text-black dark:group-hover:text-slate-400" />,
  },
];
