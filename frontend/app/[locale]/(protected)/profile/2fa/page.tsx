import createTotpDevice from "@/app/lib/queries/createTotpDevice";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const TwoFactor = dynamic(() => import("@/app/components/profile/two-factor"), {
  ssr: false,
});

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

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
  });
  const totpData = await createTotpDevice();

  return (
    <section className="flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
      <div className="flex flex-col gap-4 max-w-[600px] mx-auto h-full">
        <p className="">{t("profile.twofactor.description")}</p>

        {totpData && <TwoFactor totpData={totpData} />}
      </div>
    </section>
  );
}
