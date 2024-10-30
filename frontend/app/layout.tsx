import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import { pick } from "lodash";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export default async function ErrorLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cartera | Error!</title>
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={pick(messages, "error")}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
