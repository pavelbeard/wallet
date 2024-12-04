import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

type RootVerifyProps = {
  params: { locale: string };
  children: React.ReactNode;
};

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function RootVerifyLayout({
  params: { locale },
  children,
}: RootVerifyProps) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <main className="min-h-screen grid grid-cols-3 grid-rows-3 auth-bg">{children}</main>
    </NextIntlClientProvider>
  );
}
