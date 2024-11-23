import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export default async function RootPublicLayout({ children }: Props) {
  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <LayoutPublicContainer color="container-bg">
        <Header />
        {children}
        <Footer />
      </LayoutPublicContainer>
    </NextIntlClientProvider>
  );
}
