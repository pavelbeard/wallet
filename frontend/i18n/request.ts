import { i18nConfig } from "@/i18n/routing";
import { Locales } from "@/i18n/types";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !i18nConfig.locales.includes(locale as Locales)) {
    locale = i18nConfig.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
