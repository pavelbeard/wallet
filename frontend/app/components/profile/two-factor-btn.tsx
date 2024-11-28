import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type TwoFactorBtnProps = {
  params: { locale: string };
  disabled: boolean;
};

export default async function TwoFactorBtn({
  params: { locale },
  disabled,
}: TwoFactorBtnProps) {
  const t = await getTranslations({
    locale,
  });
  return (
    <div
      className="flex items-center"
      data-testid="two-factor-btn"
      aria-label="two factor btn"
    >
      {disabled ? (
        <button disabled={disabled}>{t("profile.main.twoFactorBtn")}</button>
      ) : (
        <Link locale={locale} href="/profile/2fa">
          {t("profile.main.twoFactorBtn")}
        </Link>
      )}
    </div>
  );
}
