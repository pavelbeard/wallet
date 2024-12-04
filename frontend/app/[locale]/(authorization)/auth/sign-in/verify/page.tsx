import VerifyTwoFactorForm from "@/app/components/auth/verify-two-factor-form";
import Card from "@/app/ui/card";
import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });
  return {
    title: t("auth.title.verify"),
    description: t("auth.description.verify"),
  };
}

export default async function Page({ params: { locale } }: LocaleProps) {
  setRequestLocale(locale);

  return (
    <>
      <Card className="my-12 hidden w-3/4 p-6 md:block lg:w-1/3">
        <VerifyTwoFactorForm params={{ locale }} />
      </Card>
      <div className="my-12 max-sm:px-4 md:hidden">
        <VerifyTwoFactorForm params={{ locale }} />
      </div>
    </>
  );
}
