"use server";

import { getTranslations } from "next-intl/server";
import protectedQuery from "../helpers/protectedQuery";

export default async function emailVerify(token: string) {
  const t = await getTranslations();
  const result = await protectedQuery({
    url: `/users/verify_email_change/`,
    method: "POST",
    body: { token },
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: t("error.somethingWentWrong"),
    };
  }

  if (!result?.ok) {
    return {
      success: null,
      error: t("verify.emailError"),
    };
  }

  if (result?.ok) {
    const { new_email } = await result.json();

    return {
      success: t("verify.verifySuccess"),
      error: null,
      newEmail: new_email,
    };
  }

  return {
    success: null,
    error: null,
  };
}
