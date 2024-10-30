
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import LayoutContainer from "@/app/ui/layout-container";
import { Props } from "@/app/lib/types";
import getPathname from "@/app/lib/getPathname";
import './globals.css';
import { Link } from "@/i18n/routing";

export default async function RootLayout({ children }: Props){
    const pathname = await getPathname();
    const lang = await getLocale();
    const messages = await getMessages();

    const linkToDashboardDev =
        process.env.NODE_ENV == 'development' && <Link locale={lang} href={'/dashboard'}>To Dashboard</Link>

    return (
        <html lang={lang}>
          <head>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
                <title>Cartera</title>
          </head>
          <body>
              <NextIntlClientProvider messages={messages}>
                  {pathname == "/" || pathname == `/${lang}`
                    ? <LayoutContainer color="container-bg">
                          {children}
                          {linkToDashboardDev}
                      </LayoutContainer>
                    : <>
                          {children}
                          {linkToDashboardDev}
                      </>}
              </NextIntlClientProvider>
          </body>
        </html>
    );
}