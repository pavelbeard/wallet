import getUser from "@/app/lib/getUser";
import Card from "@/app/ui/card";
import { User } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";

type UserProps = { user?: User; title: string };

const Email = ({ user, title }: UserProps) => {
  if (user?.email) {
    return (
      <div className="flex flex-col">
        <p>{title}:</p>
        <p className="justify-self-end text-wrap">{user?.email}</p>
      </div>
    );
  }

  return null;
};

const Username = ({ user, title }: UserProps) => {
  const username = user?.name ?? user?.username;
  if (username) {
    return (
      <div className="flex flex-col">
        <p>{title}:</p>
        <p className="justify-self-end text-wrap">{username}</p>
      </div>
    );
  }

  return null;
};

export default async function UserCard() {
  const user = await getUser();
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
  });
  return (
    <Card className="p-6 w-f flex flex-col lg:grid lg:grid-cols-2 gap-y-2">
      <Username user={user} title={t("profile.userCard.username")} />
      <Email user={user} title={t("profile.userCard.email")} />
    </Card>
  );
}
