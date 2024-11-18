import UserCard from "@/app/components/profile/user-card";
import { LocaleProps } from "@/i18n/types";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "profile",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page({ params: { locale } }: LocaleProps) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3">
      <UserCard />
    </div>
  );
}
