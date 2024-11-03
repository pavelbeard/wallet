import clsx from "clsx";
import { User } from "next-auth";
import UserAvatar from "./user-avatar";

type Props = {
  user: User | undefined;
};

function UserInfo({ user }: Props) {
  const image = user?.image;
  const provider = user?.provider ?? "credentials"

  return (
    <div
      className={clsx(
        "p-4 border-b-[1px] border-gray-300 bg-slate-100 drop-shadow-xl shadow-black",
        "relative flex items-center",
        "lg:drop-shadow-sm lg:justify-end",
      )}
    >
      <UserAvatar
        src={image}
        provider={provider}
      />
    </div>
  );
}

export default UserInfo;
