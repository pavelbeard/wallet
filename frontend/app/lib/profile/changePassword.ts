"use server";

import { ChangePasswordSchema } from "@/app/lib/schemas.z";
import { z } from "zod";
import getTranslations from "../helpers/getTranslations";
import getUser from "../helpers/getUser";
import protectedQuery from "../helpers/protectedQuery";

export default async function changePassword(
  data: z.infer<typeof ChangePasswordSchema>,
) {
  const t = await getTranslations();
  const user = await getUser();
  const result = await protectedQuery({
    url: `/users/${user?.public_id}/change_password/`,
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: data,
  });

  if (result instanceof Error) {
    return {
      error: t("error.somethingWentWrong"),
      success: null,
    };
  }

  if (!result?.ok) {
    const errorData = await result?.json();
    return {
      // @ts-expect-error itemType as {error: {<field>: [ '<message>' ]}}
      error: Object.values(Object.values(errorData)[0])[0][0],
      success: null,
    };
  }

  if (result?.ok) {
    return {
      error: null,
      success: t("changePassword.success"),
    };
  }

  return {
    success: null,
    error: null,
  };
}
