import SignUpForm from "@/app/components/auth/sign-up-form";
import Card from "@/app/ui/card";
import ToMainPageBtn from "@/app/ui/to-main-page-btn";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "auth",
  });
  return {
    title: t("title.signUp"),
    description: t("description.signUp"),
  };
}

export default async function Page() {
  return (
    <>
      <ToMainPageBtn />
      <Card>
        <SignUpForm />
      </Card>
    </>
  );
}
