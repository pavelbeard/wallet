import ChangeEmailBtn from "@/app/components/profile/change-email-btn";
import TwoFactorBtn from "@/app/components/profile/two-factor-btn";
import UserCard from "@/app/components/profile/user-card";
import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: t("profile.title"),
    description: t("profile.description"),
  };
}

export default async function Page() {
  return (
    <div className="flex flex-col xl:grid xl:grid-cols-[2fr_1fr_1fr] gap-4">
      <UserCard />
      <div
        className={clsx(
          "flex flex-col",
          "[&>*]:p-6 [&>*]:h-full",
          "[&>*]:text-sm [&>*]:bg-white dark:[&>*]:dark:bg-slate-800 dark:text-gray-100",
          "[&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl",
          "[&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-slate-600 dark:[&>*:not(:first-child)]:border-slate-600",
          "[&>:hover]:bg-slate-500 dark:[&>:hover]:bg-slate-700",
          "[&>:hover]:text-slate-100",
          "border border-slate-600 rounded-xl",
          "shadow-black drop-shadow-lg lg:drop-shadow-2xl",
        )}
      >
        <ChangeEmailBtn />
        <ChangePasswordBtn />
        <TwoFactorBtn />
      </div>
    </div>
  );
}
