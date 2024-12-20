"use server";

import { getTranslations } from "next-intl/server";
import query from "../../helpers/query";
import { ResetPasswordRequestValidator } from "../../schemas.z";

export default async function requestResetPassword(
  data: ResetPasswordRequestValidator,
) {
  const t = await getTranslations();
  const result = await query({
    url: "/users/create_reset_password_request/",
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
      error: t("error.requestFailed"),
    };
  }

  if (result?.ok) {
    return {
      success: t("resetPassword.success"),
      error: null,
    };
  }

  return {
    success: null,
    error: null,
  };
}
