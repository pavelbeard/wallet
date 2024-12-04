"use server";

import { getLocale, getTranslations } from "next-intl/server";
import protectedQuery from "../helpers/protectedQuery";

export default async function createChangeEmailRequest(data: {
  email: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
  });
  const result = await protectedQuery({
    url: "/users/create_change_email_request/",
    method: "POST",
    body: data,
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
      error: t("profile.userCard.emailRequest.error"),
    };
  }

  if (result?.ok) {
    return {
      success: t("profile.userCard.emailRequest.success"),
      error: null,
    };
  }

  return {
    success: null,
    error: null,
  };
}
