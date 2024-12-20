"use server";

import getTranslations from "@/app/lib/helpers/getTranslations";
import query from "@/app/lib/helpers/query";
import { SignUpSchema, SignUpValidator } from "@/app/lib/schemas.z";

export default async function registration(values: SignUpValidator) {
  const t = await getTranslations();
  const validatedData = SignUpSchema.safeParse(values);

  if (validatedData.error) {
    return {
      success: null,
      error: "Invalid data.",
    };
  }

  const response = await query({
    url: "/auth/signup/",
    method: "POST",
    body: validatedData.data,
  });

  if (response instanceof Error) {
    return {
      success: null,
      error: response.message,
    };
  }

  if (response && !response.ok) {
    const errorData = await response.json();

    return {
      success: null,
      // @ts-expect-error itemType as {error: {<field>: [ '<message>' ]}}
      error: Object.values(Object.values(errorData)[0])[0][0],
    };
  }

  return {
    success: `${t("auth.signUp.success")} ${validatedData.data.email}`,
    error: null,
  };
}
