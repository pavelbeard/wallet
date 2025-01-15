import DashboardCard from "@/app/components/dashboard/passwords-card";
import getPasswords from "@/app/lib/queries/dashboard/getPasswords";
import Card from "@/app/ui/card";
import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { KeyIcon } from "@heroicons/react/24/solid";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: t("dashboard.title"),
    description: t("dashboard.description"),
  };
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Page({ params: { locale } }: LocaleProps) {
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
  });

  const { error: passwordsError, totalPasswords } = await getPasswords();

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:grid-rows-[300px_300px] lg:gap-6">
      {/* TODO: add cards */}
      <Card className="col-start-1 h-full w-full p-4">Cards</Card>
      <DashboardCard href="/passwords" locale={locale}>
        <div className="flex flex-col gap-4 p-4">
          {totalPasswords && (
            <div className="flex items-center gap-2">
              <KeyIcon className="size-5" /> {totalPasswords}
            </div>
          )}
          {passwordsError && <p>{passwordsError}</p>}
          {t("dashboard.passwords.title")}
        </div>
      </DashboardCard>
      <Card className="col-start-1 row-start-2 h-full w-full p-4">Notes</Card>
      <Card className="col-start-2 row-start-2 h-full w-full p-4">Others</Card>
    </div>
  );
}
