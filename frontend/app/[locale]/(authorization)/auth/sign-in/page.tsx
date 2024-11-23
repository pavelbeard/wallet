import SignInForm from "@/app/components/auth/sign-in-form";
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
    title: t("title.signIn"),
    description: t("description.signIn"),
  };
}

export default async function Page() {
  return (
    <>
      <Card className="hidden md:block p-6 my-12 w-3/4 lg:w-1/3">
        <SignInForm />
      </Card>
      <div className="md:hidden max-sm:px-4 my-12">
        <SignInForm />
      </div>
    </>
  );
}
