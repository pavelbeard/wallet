import TwoFactorSkeleton from "@/app/components/profile/two-factor-skeleton";
import getUser from "@/app/lib/getUser";
import { redirect, routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const TwoFactor = dynamic(() => import("@/app/components/profile/two-factor"), {
  ssr: false,
  loading: () => <TwoFactorSkeleton />,
});

type PageProps = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: `Cartera | ${t("profile.twofactor.title")}`,
    description: t("profile.twofactor.description"),
  };
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Page({ params: { locale } }: PageProps) {
  const t = await getTranslations({
    locale,
  });
  const user = await getUser();

  if (user?.is_oauth_user) {
    redirect({ href: "/profile", locale });
  }

  return (
    <section className="flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
      <div className="flex flex-col gap-4 max-w-[600px] mx-auto h-full">
        <p className="">{t("profile.twofactor.description")}</p>

        <TwoFactor />
      </div>
    </section>
  );
}
