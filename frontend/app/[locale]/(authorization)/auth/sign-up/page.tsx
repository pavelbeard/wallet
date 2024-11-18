import SignUpForm from "@/app/components/auth/sign-up-form";
import Card from "@/app/ui/card";
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
      <Card className="hidden md:block p-6 my-12 w-3/4 lg:w-1/3">
        <SignUpForm />
      </Card>
      <div className="md:hidden my-12">
        <SignUpForm />
      </div>
    </>
  );
}
