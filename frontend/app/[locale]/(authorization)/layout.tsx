import "@/app/globals.css";
import LayoutContainer from "@/app/ui/layout-container";
import LogoMain from "@/app/ui/logo-main";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import React from "react";

type Props = { children: React.ReactNode };

export default async function Layout({ children }: Props) {
  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <LayoutContainer color="auth-bg">
        <LogoMain />
        {children}
      </LayoutContainer>
    </NextIntlClientProvider>
  );
}
