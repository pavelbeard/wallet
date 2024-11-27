import { routing } from "@/i18n/routing";
import { Locales } from "@/i18n/types";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locales)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}/translation.json`)).default,
  };
});
