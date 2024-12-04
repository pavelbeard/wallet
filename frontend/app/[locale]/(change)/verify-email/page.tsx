import EmailVerificationForm from "@/app/components/change/email-verification-form";
import Card from "@/app/ui/card";
import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import clsx from "clsx";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type EmailVerifyProps = {
  searchParams: Promise<{ [key: string]: string }>;
} & LocaleProps;

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
};

export async function generateMetadata({
  params: { locale },
}: LocaleProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: t("verify.email.title"),
    description: t("verify.email.description"),
  };
}

export default async function Page({
  params: { locale },
  searchParams,
}: EmailVerifyProps) {
  const t = await getTranslations({
    locale,
  });
  const token = (await searchParams).token;

  const className = clsx(
    "col-span-3 col-start-1 row-start-2 mx-8 p-4 lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:mx-0",
    "border border-slate-300 dark:border-slate-600",
  );

  if (!token) {
    return (
      <Card className={className}>
        <div className="flex flex-col gap-4">
          <h1 className="text-md font-bold text-red-500">
            {t("verify.tokenIsMissing")}
          </h1>
        </div>
      </Card>
    );
  }

  return (
    <Card className={clsx(className, "h-fit")}>
      <EmailVerificationForm params={{ locale }} token={token} />
    </Card>
  );
}
