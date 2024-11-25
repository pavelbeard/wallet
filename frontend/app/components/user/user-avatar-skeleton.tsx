import { UserCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function UserAvatarSkeleton() {
  return (
    <div
      className={clsx(
        "hidden relative lg:flex justify-center items-center",
        "bg-gray-100 size-16 border-[1px] border-gray-300 rounded-full",
        "dark:bg-slate-800 dark:border-slate-600",
      )}
    >
      <UserCircleIcon className="size-12" />
    </div>
  );
}
