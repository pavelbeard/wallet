"use server";

import getTranslations from "@/app/lib/helpers/getTranslations";
import protectedQuery from "@/app/lib/helpers/protectedQuery";

export default async function getPasswords() {
  const t = await getTranslations();
  const result = await protectedQuery({
    url: "/passwords/",
    method: "GET",
  });

  if (result instanceof Error) {
    return {
      error: t("error.somethingWentWrong"),
      totalPasswords: null,
      data: null,
    };
  }

  if (!result?.ok) {
    return {
      error: t("error.somethingWentWrong"),
      totalPasswords: null,
      data: null,
    };
  }

  if (result?.ok) {
    const { data } = await result.json();
    return {
      error: null,
      totalPasswords: `${t("dashboard.passwords.total")}: ${data?.length ?? 0}`,
      data,
    };
  }

  return {
    totalPasswords: null,
    error: null,
    data: null,
  };
}
