import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import AccountSettingsIcon from "../icons/account-settings-icon";
import ChangeEmailBtn from "./change-email-btn";
import ChangePasswordBtn from "./change-password-btn";
import TwoFactorBtn from "./two-factor-btn";
import getSession from "@/app/lib/helpers/getSession";

type AccountSettingsProps = { params: { locale: string } };

export default async function AccountSettings({
  params: { locale },
}: AccountSettingsProps) {
  const session = await getSession();
  const t = await getTranslations({
    locale,
  });
  return (
    <section className="flex flex-col gap-4">
      <div className="p-2 flex gap-2 items-center">
        <AccountSettingsIcon className="size-6" />
        <h1 className="text-lg font-bold">{t("profile.settings.title")}</h1>
      </div>
      <div
        className={clsx(
          "flex flex-col bg-white dark:bg-slate-800",
          "border border-slate-200 dark:border-slate-600 rounded-xl",
          "shadow-black drop-shadow-lg lg:drop-shadow-2xl",
          "[&>*]:p-4 [&>*]:h-20",
          "[&>div>*]:p-2 [&>div>*]:rounded-lg",
          "[&>div>*:not(:disabled):hover]:bg-slate-300 dark:[&>div>*:not(:disabled):hover]:bg-slate-700",
          "[&>div>*:disabled]:bg-slate-500 [&>div>*:disabled]:text-slate-300",
          "[&>*]:text-sm dark:text-gray-100",
          "[&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-slate-200 ",
          "dark:[&>*:not(:first-child)]:border-slate-600",
        )}
      >
        <ChangeEmailBtn disabled={session?.user?.provider != "credentials"} />
        <ChangePasswordBtn
          disabled={session?.user?.provider != "credentials"}
        />
        <TwoFactorBtn
          disabled={session?.user?.provider != "credentials"}
          params={{ locale }}
        />
      </div>
    </section>
  );
}
