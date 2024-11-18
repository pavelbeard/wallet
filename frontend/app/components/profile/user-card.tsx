import getUser from "@/app/lib/getUser";
import Card from "@/app/ui/card";
import clsx from "clsx";
import { User } from "next-auth";
import ChangeEmailBtn from "./change-email-btn";

type UserProps = { user?: User };

const Email = ({ user }: UserProps) => {
  if (user?.email) {
    return (
      <>
        <p>Email:</p>
        <p className="justify-self-end">{user?.email}</p>
        {user.provider == "credentials" && <ChangeEmailBtn user={user} />}
      </>
    );
  }

  return null;
};

const Username = ({ user }: UserProps) => {
  const username = user?.name ?? user?.username
  if (username) {
    return (
      <>
        <p>Username:</p>
        <p className="justify-self-end">{username}</p>
      </>
    );
  }

  return null;
};

export default async function UserCard() {
  const user = await getUser();
  return (
    <Card className="p-6 grid grid-cols-2 gap-y-2">
      <Username user={user} />
      <Email user={user} />
    </Card>
  );
}
