import Footer from "@/app/components/footer";
import "@/app/globals.css";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Because this component uses the useIsomorphicLayoutEffect hook,
// that is trying to first render on the server side,
// and that is provoking the hydration errors, so we need to use dynamic import.
const Header = dynamic(() => import("@/app/components/header"), {
  ssr: false,
});

type RootPublicLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function RootPublicLayout({
  children,
  params: { locale },
}: RootPublicLayoutProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LayoutPublicContainer color="container-bg">
        <Header />
        {children}
        <Footer params={{ locale }} />
      </LayoutPublicContainer>
    </NextIntlClientProvider>
  );
}
