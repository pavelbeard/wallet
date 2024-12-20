"use server";

import { z } from "zod";
import getTranslations from "../../helpers/getTranslations";
import query from "../../helpers/query";
import { NewPasswordSchema } from "../../schemas.z";

export default async function createNewPassword(
  data: z.infer<typeof NewPasswordSchema>,
  token: string,
) {
  const validatedData = NewPasswordSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: validatedData.error.message,
      success: null,
    };
  }

  const t = await getTranslations();
  const result = await query({
    url: "/users/create_new_password/",
    method: "POST",
    body: { ...validatedData.data, token },
  });

  if (result instanceof Error) {
    return {
      error: t("error.somethingWentWrong"),
      success: null,
    };
  }

  if (!result?.ok) {
    return {
      error: t("verify.password.error"),
      success: null,
    };
  }

  if (result?.ok) {
    return {
      error: null,
      success: t("verify.password.creationSuccess"),
    };
  }

  return {
    error: null,
    success: null,
  };
}
