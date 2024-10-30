import "@/app/globals.css";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import Logo from "@/app/ui/logo";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import React from "react";
import ToMainPageBtn from "@/app/ui/to-main-page-btn";

type Props = { children: React.ReactNode };

export default async function Layout({ children }: Props) {
  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <LayoutPublicContainer color="auth-bg">
        <Logo />
        <ToMainPageBtn />
        {children}
      </LayoutPublicContainer>
    </NextIntlClientProvider>
  );
}
