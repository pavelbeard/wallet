import Email from "@/app/components/profile/user-card-email";
import getUser from "@/app/lib/helpers/getUser";
import Card from "@/app/ui/card";
import { WalletUser } from "@/auth";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";

type UserProps = { user?: WalletUser; title: string };

const row =
  "flex flex-col md:flex-row md:justify-between md:items-center [&>span]:h-[20px]";

const Username = ({ user, title }: UserProps) => {
  const username = user?.username;
  if (username) {
    return (
      <div className={row}>
        <span>{title}:</span>
        <span>{username}</span>
      </div>
    );
  }

  return null;
};

function TwoFactorStatus({ user, title, note }: UserProps & { note: string }) {
  const twoFactorStatus = user?.is_two_factor_enabled;
  const isProviderCredentials = user?.provider == "credentials";
  return (
    <div className="flex items-center justify-between">
      <span>{title}:</span>
      <span
        className={clsx(
          "p-1 rounded-lg flex items-center",
          twoFactorStatus
            ? "text-green-500 bg-green-500/40"
            : isProviderCredentials
              ? "text-red-500 bg-red-500/40"
              : "text-yellow-800 dark:text-yellow-300 bg-yellow-500/40",
        )}
      >
        {twoFactorStatus ? (
          <CheckIcon className="size-[12px]" />
        ) : isProviderCredentials ? (
          <XMarkIcon className="size-[12px]" />
        ) : (
          <div className="flex items-center gap-2 h-[12px]">
            <ExclamationTriangleIcon className="size-[12px]" />
            {note}
          </div>
        )}
      </span>
    </div>
  );
}

type UserCardProps = {
  params: { locale: string };
};

export default async function UserCard({ params: { locale } }: UserCardProps) {
  const user = await getUser();
  const t = await getTranslations({
    locale,
  });
  return (
    <section className="flex flex-col gap-4">
      <div className="p-2 flex gap-2 items-center">
        <UserIcon className="size-6" />
        <h1 className="text-lg font-bold">{t("profile.userCard.title")}</h1>
      </div>
      <Card
        className={clsx(
          "w-full flex flex-col lg:grid lg:grid-rows-3",
          "border border-slate-200",
          "[&>*]:p-6 [&>*]:text-sm [&>*]:h-20",
          "[&>*:not(:first-child)]:border-t",
          "[&>*]:border-slate-200 [&>*]:dark:border-slate-600",
        )}
      >
        <Username user={user} title={t("profile.userCard.username")} />
        <Email title={t("profile.userCard.email")} />
        <TwoFactorStatus
          user={user}
          title={`${t("profile.userCard.twoFactor")}`}
          note={t("profile.twofactor.oauth2note")}
        />
      </Card>
    </section>
  );
}
