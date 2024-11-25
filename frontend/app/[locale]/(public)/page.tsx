import ScrambleTextSkeleton from "@/app/components/public/page/scramble-text-skeleton";
import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const className = clsx(
  "text-start tracking-wider",
  "self-start text-md md:text-4xl lg:text-6xl py-6",
  "text-slate-800 dark:text-gray-100 font-light",
);

// Dynamically imports ScrambleText component with fallback and by seamless way.
const ScrambleText = dynamic(
  () => import("@/app/components/public/page/scramble-text"),
  {
    ssr: false,
    // @ts-expect-error | It needs for translate aims
    loading: async () => {
      const t = await getTranslations();
      return (
        <ScrambleTextSkeleton
          className={className}
          initialText={t("mainPage.page.text1")}
        />
      );
    },
  },
);

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });
  return {
    title: t("mainPage.title"),
    description: t("mainPage.description"),
  };
}

export default async function Home({ params: { locale } }: LocaleProps) {
  const t = await getTranslations({
    locale,
  });

  return (
    <section className="flex flex-col h-[800px] mt-56 w-full">
      <div className="flex flex-col md:grid md:grid-cols-[3fr,2fr] md:grid-rows-[450px,150px] items-center gap-6 px-8 md:px-32">
        <ScrambleText
          // upperCase
          className={className}
          initialText={t("mainPage.page.text1")}
          textArray={[t("mainPage.page.text1"), t("mainPage.page.text2")]}
        />
      </div>
    </section>
  );
}
