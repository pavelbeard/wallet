import LayoutSideElementsDesktop from "@/app/components/dashboard/layout-side-elements-desktop";
import LayoutSideElementsMobile from "@/app/components/dashboard/layout-side-elements-mobile";
import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import { routing } from "@/i18n/routing";
import clsx from "clsx";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

type RootProtectedLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function RootProtectedLayout({ children, params: { locale } }: RootProtectedLayoutProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* desktop layout */}
      <main
        className={clsx(
          "hidden",
          "min-h-screen",
          "lg:grid lg:grid-cols-[200px_1fr] lg:grid-rows-[100px_1fr]",
          "dashboard-bg",
        )}
      >
        <LayoutSideElementsDesktop />
        <div className="p-4 h-full lg:mx-32">{children}</div>
      </main>

      {/* mobile layout */}
      <main
        className={clsx(
          "lg:hidden",
          "min-h-screen",
          "flex flex-col",
          "dashboard-bg",
        )}
      >
        <LayoutSideElementsMobile />
        <div className="p-4 h-full">{children}</div>
      </main>
    </NextIntlClientProvider>
  );
}
