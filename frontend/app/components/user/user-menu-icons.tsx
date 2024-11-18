import { UserMenuItem } from "@/app/lib/types";
import {
  ArrowLeftStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export const USER_MENU: UserMenuItem[] = [
  {
    icon: <UserIcon className="size-6" />,
    title: "profile",
    url: "/profile",
  },
  {
    icon: <ArrowLeftStartOnRectangleIcon className="size-6" />,
    title: "signOut",
    url: "/auth/sign-out",
    fontBold: true,
  },
];
