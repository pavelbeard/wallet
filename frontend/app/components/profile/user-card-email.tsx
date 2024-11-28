"use client";

import UserCardEmailSkeleton from "@/app/components/profile/user-card-email-skeleton";
import useUser from "@/app/lib/hooks/useUser";

type Props = { title: string };

const row =
  "flex flex-col md:flex-row md:justify-between md:items-center [&>span]:h-[20px]";

export default function UserCardEmail({ title }: Props) {
  const user = useUser();
  if (user?.email) {
    return (
      <div className={row}>
        <span>{title}:</span>
        <span>{user?.email}</span>
      </div>
    );
  }

  return <UserCardEmailSkeleton />;
}
