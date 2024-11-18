import Card from "@/app/ui/card";
import { auth } from "@/auth";
import { Link } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Underline from "@/app/ui/underline";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "mainPage",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Home({ params: { locale } }: LocaleProps) {
  const session = await auth();
  const t = await getTranslations({
    locale,
    namespace: "mainPage",
  });
  return (
    <div className="flex flex-col items-center h-[800px] mt-12 w-full">
      <section className="flex flex-col items-center gap-4 max-w-[300px] lg:max-w-[600px]">
        <h1 className="text-xl lg:text-3xl text-slate-800 dark:text-gray-100 font-bold text-center">
          {t("page.title")}
        </h1>
        <p className="text-xl lg:text-3xl text-slate-800 dark:text-gray-100 font-bold text-center">
          {t("page.appDescription")}
        </p>
      </section>
      <Card className="p-6 my-12 w-3/4 lg:w-1/3">
        <div className="flex flex-col lg:flex-row gap-4 lg:justify-center p-4">
          {session?.expires ? (
            <Link className="main-links group" locale={locale} href={"/dashboard"}>
              {t('page.toDashboard')}
              <Underline />
            </Link>
          ) : (
            <>
              <Link
                locale={locale}
                className="main-links group"
                href={"/auth/sign-in"}
              >
                {t("page.signIn")}
                <Underline />
              </Link>
              <Link
                locale={locale}
                className="main-links group"
                href={"/auth/sign-up"}
              >
                {t("page.signUp")}
                <Underline />
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
