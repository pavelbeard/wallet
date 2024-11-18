import LayoutSideElementsDesktop from "@/app/components/dashboard/layout-side-elements-desktop";
import LayoutSideElementsMobile from "@/app/components/dashboard/layout-side-elements-mobile";
import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import clsx from "clsx";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export default async function RootProtectedLayout({ children }: Props) {
  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
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
        <div className="p-4 h-full">{children}</div>
      </main>

      {/* mobile layout */}
      <main
        className={clsx(
          "lg:hidden",
          "min-h-screen",
          "flex flex-col",
          "dashboard-bg"
        )}>
        <LayoutSideElementsMobile />
        <div className="p-4 h-full">{children}</div>
      </main>

      {/* modals */}
    </NextIntlClientProvider>
  );
}
