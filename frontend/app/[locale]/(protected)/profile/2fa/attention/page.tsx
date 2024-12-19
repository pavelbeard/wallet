import { Link, routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: `Cartera | ${t("profile.twofactor.2faAttention.title")}`,
    description: t("profile.twofactor.2faAttention.description"),
  };
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Attention({ params: { locale } }: LocaleProps) {
  const t = await getTranslations({
    locale,
  });

  return (
    <div className="flex items-center gap-4 rounded-xl border border-yellow-500 bg-yellow-100 p-4 dark:bg-yellow-500/40">
      {t("profile.twofactor.2faAttention.text")}
      <Link
        href="/profile/2fa"
        locale={locale}
        className={clsx(
          "rounded-xl border border-slate-300 bg-slate-100 p-2",
          "dark:border-slate-600 dark:hover:bg-slate-500",
          "hover:bg-slate-200"
        )}
      >
        {t("profile.twofactor.configure")}
      </Link>
    </div>
  );
}
