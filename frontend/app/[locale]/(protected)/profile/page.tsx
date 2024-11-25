import TwoFactorCard from "@/app/components/profile/two-factor-wrapper";
import UserCard from "@/app/components/profile/user-card";
import getTotpData from "@/app/lib/getTotpData";
import { LocaleProps } from "@/i18n/types";
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
  const totpData = await getTotpData();

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-[2fr_1fr_1fr] gap-4">
      <UserCard />
      <TwoFactorCard totpData={totpData} />
    </div>
  );
}
