import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { pick } from "lodash";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Roboto_Mono } from "next/font/google";
import { Suspense } from "react";
import NavigationEvents from "./components/layout/navigation-events";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

type ErrorProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function Layout({
  children,
  params: { locale },
}: ErrorProps) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={robotoMono.className}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="%PUBLIC_URL%/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="%PUBLIC_URL%/favicon-32x32.png"
        />
        <link
          rel="android-chrome"
          sizes="192x192"
          href="%PUBLIC_URL%/android-chrome-192x192.png"
        />
        <link
          rel="android-chrome"
          sizes="512x512"
          href="%PUBLIC_URL%/android-chrome-512x512.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="%PUBLIC_URL%/apple-touch-icon.png"
        />
        <link rel="manifest" href="%PUBLIC_URL%/site.webmanifest" />
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
        <NextIntlClientProvider
          locale={locale}
          messages={pick(messages, "error")}
        >
          <ThemeProvider
            themes={["dark", "light", "system"]}
            attribute="class"
            defaultTheme="system"
          >
            <SessionProvider>
              {children}
              <Suspense fallback={null}>
                <NavigationEvents />
              </Suspense>
            </SessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
