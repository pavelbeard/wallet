import "@/app/globals.css";
import getSession from "@/app/lib/helpers/getSession";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import Logo from "@/app/ui/logo";
import ToMainPageBtn from "@/app/ui/to-main-page-btn";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Layout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const messages = await getMessages();
  const session = await getSession();

  // TODO: remove all redirections
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LayoutPublicContainer color="auth-bg">
        {!session && (
          <>
            <Logo />
            <ToMainPageBtn />
          </>
        )}
        {children}
      </LayoutPublicContainer>
    </NextIntlClientProvider>
  );
}
