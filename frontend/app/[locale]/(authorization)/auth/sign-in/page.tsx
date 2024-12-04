import SignInForm from "@/app/components/auth/sign-in-form";
import Card from "@/app/ui/card";
import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const BreakpointWrapper = dynamic(
  () => import("@/app/components/utils/breakpoint-wrapper"),
  {
    ssr: false,
  },
);

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
    title: t("auth.title.signIn"),
    description: t("auth.description.signIn"),
  };
}

export default async function Page({ params: { locale } }: LocaleProps) {
  setRequestLocale(locale);

  return (
    <>
      <BreakpointWrapper query="(min-width: 420px)">
        <Card className="my-12 w-3/4 p-6 lg:w-1/3 animate-appear">
          <SignInForm />
        </Card>
      </BreakpointWrapper>
      <BreakpointWrapper query="(max-width: 420px)">
        <div className="my-12 max-sm:px-4 animate-appear">
          <SignInForm />
        </div>
      </BreakpointWrapper>
    </>
  );
}
