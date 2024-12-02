import AccountSettings from "@/app/components/profile/account-settings";
import Devices from "@/app/components/profile/devices";
import UserCard from "@/app/components/profile/user-card";
import CustomButton from "@/app/ui/button-custom";
import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";

type ProtectedPageProps = {
  params: { locale: string };
};

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

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Page({ params: { locale } }: ProtectedPageProps) {
  return (
    <div className="relative flex flex-col xl:grid xl:grid-cols-[2fr_1fr] xl:grid-rows-[1fr_1fr_1fr] gap-4 w-full">
      <UserCard params={{ locale }} />
      <AccountSettings params={{ locale }} />
      <Devices params={{ locale }} />
      {/* TODO: into client component */}
      <div className="bg-slate-400 row-start-3 col-span-2 h-24 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center w-full border border-slate-700 dark:border-slate-600 [&>button]:bg-red-500 hover:[&>button]:bg-red-600">
        Zone of risk
        <CustomButton>Delete account</CustomButton>
      </div>
    </div>
  );
}
