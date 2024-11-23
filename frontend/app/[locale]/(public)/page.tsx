import ScrambleText from "@/app/components/public/page/scramble-text";
import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
          className={clsx(
            "text-start tracking-wider",
            "self-start text-md md:text-4xl lg:text-6xl py-6",
            "text-slate-800 dark:text-gray-100 font-light",
          )}
          initialText={t("mainPage.page.text1")}
          textArray={[t("mainPage.page.text1"), t("mainPage.page.text2")]}
        />
      </div>
      {/* <div>
        <p className="text-xl lg:text-3xl text-slate-800 dark:text-gray-100 font-bold text-center">
          {t("mainPage.page.appDescription")}
        </p>
      </div> */}
    </section>
  );
}

// <Card className="p-6 my-12 w-3/4 lg:w-1/3">
//   <div className="flex flex-col lg:flex-row gap-4 lg:justify-center p-4">
//     {session?.expires ? (
//       <Link
//         className="main-links group"
//         locale={locale}
//         href={"/dashboard"}
//       >
//         {t("mainPage.page.toDashboard")}
//         <Underline />
//       </Link>
//     ) : (
//       <>
//         <Link
//           locale={locale}
//           className="main-links group"
//           href={"/auth/sign-in"}
//         >
//           {t("mainPage.page.signIn")}
//           <Underline />
//         </Link>
//         <Link
//           locale={locale}
//           className="main-links group"
//           href={"/auth/sign-up"}
//         >
//           {t("mainPage.page.signUp")}
//           <Underline />
//         </Link>
//       </>
//     )}
//   </div>
// </Card>
