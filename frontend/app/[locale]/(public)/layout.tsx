import Footer from "@/app/components/footer";
import "@/app/globals.css";
import { Props } from "@/app/lib/types";
import LayoutPublicContainer from "@/app/ui/layout-public-container";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import dynamic from "next/dynamic";

// Because this component uses the useIsomorphicLayoutEffect hook, 
// that is trying to first render on the server side,
// and that is provoking the hydration errors, so we need to use dynamic import.
const Header = dynamic(() => import("@/app/components/header"), {
  ssr: false,
});

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
