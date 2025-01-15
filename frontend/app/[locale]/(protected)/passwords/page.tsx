import { Password } from "@/app/lib/types";
import { routing } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: LocaleProps & { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
  });

  return {
    title: t("passwords.title"),
    description: t("passwords.description"),
  };
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({
    locale,
  }));
};

export default function Page({ params: { locale } }: LocaleProps) {
  setRequestLocale(locale);

  const passwords: Password[] = [
    {
      id: 1,
      wallet_user: 1,
      label: "test",
      url: "test",
      login: "test",
      password: "test",
      notes: "test",
      tags: ["test"],
      created_at: "12.12.2022 12:12",
      updated_at: "12.12.2022 12:12",
    },
    {
      id: 2,
      wallet_user: 1,
      label: "test",
      url: "test",
      login: "test",
      password: "test",
      notes: "test",
      tags: ["test"],
      created_at: "13.12.2022 12:12",
      updated_at: "14.12.2022 12:12",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {passwords.map((password) => (
        <div>
          <h3>{password.label}</h3>
          {/* <p>{password.login}</p>
          <input type="password" value={password.password} />
          <p>{password.notes}</p>
          <p>{password.tags}</p>
          <p>{password.created_at}</p>
          <p>{password.updated_at}</p> */}
        </div>
      ))}
    </div>
  );
}
