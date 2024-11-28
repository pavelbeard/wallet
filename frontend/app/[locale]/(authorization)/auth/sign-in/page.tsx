import SignInForm from "@/app/components/auth/sign-in-form";
import getSession from "@/app/lib/helpers/getSession";
import Card from "@/app/ui/card";
import { redirect, routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });
  return {
    title: t("auth.title.signIn"),
    description: t("auth.description.signIn"),
  };
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Page({ params: { locale } }: LocaleProps) {
  const session = await getSession();

  if (session?.user) {
    redirect({ href: DEFAULT_SIGNED_IN_PATH, locale });
  }

  return (
    <>
      <Card className="hidden md:block p-6 my-12 w-3/4 lg:w-1/3">
        <SignInForm />
      </Card>
      <div className="md:hidden max-sm:px-4 my-12">
        <SignInForm />
      </div>
    </>
  );
}
