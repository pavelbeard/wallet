import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import { pick } from "lodash";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Roboto_Mono } from "next/font/google";
import { Suspense } from "react";
import NavigationEvents from "./components/layout/navigation-events";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export default async function ErrorLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className={robotoMono.className}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="favicon.ico" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          data-meta="react-devtools/safari"
          src="http://localhost:8097"
        ></script>
        {/* Use polyfill for browsers that don't support scroll-timeline */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js"></script>
      </head>
      <body>
        <SessionProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={pick(messages, "error")}
          >
            {children}
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
