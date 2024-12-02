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

export default async function Page({ params: { locale } }: LocaleProps) {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:grid-rows-[300px_300px] lg:gap-6">
      <div className="col-start-1 w-full h-full bg-slate-400">
        Cards
      </div>
      <div className="col-start-2 w-full h-full bg-slate-400">
        Passwords
      </div>
      <div className="row-start-2 col-start-1 w-full h-full bg-slate-400">
        Notes
      </div>
      <div className="row-start-2 col-start-2 w-full h-full bg-slate-400">
        Others
      </div>
    </div>
  );
}
