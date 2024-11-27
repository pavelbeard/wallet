import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";

type Props = {};

export default async function TwoFactorBtn({}: Props) {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
  });
  return <Link href="/profile/2fa">{t("profile.main.twoFactorBtn")}</Link>;
}
