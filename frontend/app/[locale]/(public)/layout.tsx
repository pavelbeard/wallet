import Footer from "@/app/components/footer/footer";
import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Header from "@/app/components/header/header";
import HeaderProvider from "@/app/components/header/header-provider";

export default async function RootPublicLayout({ children }: Props) {
  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <LayoutPublicContainer color="container-bg">
        <HeaderProvider>
          <Header />
        </HeaderProvider>
        {children}
        <Footer />
      </LayoutPublicContainer>
    </NextIntlClientProvider>
  );
}
