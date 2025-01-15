import MasterPasswordForm from "@/app/components/auth/master-password-form";
import Card from "@/app/ui/card";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: t("auth.masterPassword.page.title"),
    description: t("auth.masterPassword.page.description"),
  };
}

export default function MasterPassword() {
  return (
    <Card>
      <MasterPasswordForm />
    </Card>
  );
}
