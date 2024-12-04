import getSession from "@/app/lib/helpers/getSession";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import AccountSettingsIcon from "../icons/account-settings-icon";
import ChangePasswordBtn from "./change-password-btn";
import RequestEmailVerificationBtn from "./request-email-verification-btn";
import TwoFactorBtn from "./two-factor-btn";

type AccountSettingsProps = { params: { locale: string } };

export default async function AccountSettings({
  params: { locale },
}: AccountSettingsProps) {
  const session = await getSession();
  const t = await getTranslations({
    locale,
  });
  const isProviderCredentials = session?.user?.provider != "credentials";
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 p-2">
        <AccountSettingsIcon className="size-6" />
        <h1 className="text-lg font-bold">{t("profile.settings.title")}</h1>
      </div>
      <div
        className={clsx(
          "flex flex-col bg-white dark:bg-slate-800",
          "rounded-xl border border-slate-200 dark:border-slate-600",
          "shadow-black drop-shadow-lg lg:drop-shadow-2xl",
          "[&>*]:h-20 [&>*]:p-4",
          "[&>div>*]:rounded-lg [&>div>*]:p-2",
          "[&>div>*:not(:disabled):hover]:bg-slate-300 dark:[&>div>*:not(:disabled):hover]:bg-slate-700",
          "[&>div>*:disabled]:bg-slate-500 [&>div>*:disabled]:text-slate-300",
          "dark:text-gray-100 [&>*]:text-sm",
          "[&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-slate-200",
          "dark:[&>*:not(:first-child)]:border-slate-600",
          "[&>*>:disabled]:cursor-not-allowed",
        )}
      >
        <RequestEmailVerificationBtn disabled={isProviderCredentials} />
        <ChangePasswordBtn disabled={isProviderCredentials} />
        <TwoFactorBtn disabled={isProviderCredentials} params={{ locale }} />
      </div>
    </section>
  );
}
