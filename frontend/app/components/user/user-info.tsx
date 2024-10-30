"use client";

import { useSession } from "next-auth/react";
import UserAvatar from "./user-avatar";
import clsx from "clsx";

type Props = {};

function DropdownUserMenu() {
    return(
        <div className="absolute"></div>
    )
}

function UserInfo({}: Props) {
  const session = useSession();
  console.log(session.data);
  
  return (
    <div className={clsx(
        "p-4 border-b-[1px] border-gray-300 bg-slate-100 drop-shadow-xl shadow-black",
        "relative flex items-center",
        "lg:drop-shadow-sm lg:justify-end"
    )}>
      <UserAvatar src={session?.data?.user?.image} provider={session.data?.user?.provider || "Credentials"} />
    </div>
  );
}

export default UserInfo;
