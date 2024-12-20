import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:grid-rows-[300px_300px] lg:gap-6">
      <div className="col-start-1 h-full w-full bg-slate-400">Cards</div>
      <div className="col-start-2 h-full w-full bg-slate-400">Passwords</div>
      <div className="col-start-1 row-start-2 h-full w-full bg-slate-400">
        Notes
      </div>
      <div className="col-start-2 row-start-2 h-full w-full bg-slate-400">
        Others
      </div>
    </div>
  );
}
