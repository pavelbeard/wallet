import { type UserMenuItem } from "@/app/lib/types";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import useUserMenu from "../lib/hooks/useUserMenu";

function UserMenuItem({ item }: { item: UserMenuItem }) {
  return (
    <li
      className={clsx(
        "p-2 text-sm",
        "flex justify-between items-center",
        "hover:bg-white hover:text-black hover:rounded-md",
      )}
    >
      <p>{item.title}</p>
      <p>{item.title}</p>
    </li>
  );
}

export function UserMenuMobile() {
  const { userMenu, toggleOpenMobile } = useUserMenu();

  return (
    <nav className={clsx("w-full p-2 flex-1 bg-slate-100")}>
      <div className="animate-short-slide-out-left">
        <button
          className="p-2 flex items-center gap-x-2"
          onClick={toggleOpenMobile}
        >
          <ArrowLeftIcon className="size-6" />
          Back
        </button>
        <ul>
          {userMenu.map((item) => (
            <UserMenuItem key={item.title} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default function UserMenuDesktop() {
  const { desktopRef, userMenu } = useUserMenu();

  return (
    <nav
      ref={desktopRef}
      className={clsx(
        "block absolute right-0 top-24",
        "py-4 p-4 w-64 max-w-96",
        "bg-slate-100 shadow-black drop-shadow-md border-[1px] border-slate-300 rounded-md",
      )}
    >
      <ul>
        {userMenu.map((item) => (
          <UserMenuItem key={item.title} item={item} />
        ))}
      </ul>
    </nav>
  );
}
