import { getLocale, getTranslations as intl } from "next-intl/server";

export default async function getTranslations() {
  const locale = await getLocale();
  const t = await intl({
    locale,
  });
  return t;
}
