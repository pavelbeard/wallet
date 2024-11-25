import clsx from "clsx";
import { User } from "next-auth";
import dynamic from "next/dynamic";
import UserAvatarSkeleton from "./user-avatar-skeleton";

// Because this component uses the useIsomorphicLayoutEffect hook,
// that is trying to first render on the server side,
// and that is provoking the hydration errors, so we need to use dynamic import.
const UserAvatar = dynamic(() => import("@/app/components/user/user-avatar"), {
  ssr: false,
  loading: () => <UserAvatarSkeleton />,
});

type Props = {
  user: User | undefined;
};

function UserInfo({ user }: Props) {
  const image = user?.image;
  const provider = user?.provider ?? "credentials";

  return (
    <div
      className={clsx(
        "p-4 border-b-[1px] border-gray-300 bg-slate-100 drop-shadow-xl shadow-black",
        "dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600",
        "relative flex items-center gap-x-4",
        "lg:drop-shadow-sm lg:justify-end",
      )}
    >
      <span className="hidden lg:block text-lg font-bold">{user?.name}</span>
      <UserAvatar src={image} provider={provider} />
      <span className="lg:hidden text-lg font-bold">{user?.name}</span>
    </div>
  );
}

export default UserInfo;
