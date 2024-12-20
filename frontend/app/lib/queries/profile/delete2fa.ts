"use server";

import { PasswordSchema } from "@/app/lib/schemas.z";
import { z } from "zod";
import getTranslations from "../../helpers/getTranslations";
import getUserDataJson from "../../helpers/getUserDataJson";
import protectedQuery from "../../helpers/protectedQuery";

export default async function delete2fa(data: z.infer<typeof PasswordSchema>) {
  const t = await getTranslations();
  const validatedData = PasswordSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: null,
      error: validatedData.error.message,
      userData: null,
    };
  }

  const result = await protectedQuery({
    url: `/2fa/delete_totp_device/`,
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: validatedData.data,
    credentials: "include",
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: t("error.somethingWentWrong"),
      userData: null,
    };
  }

  if (result?.ok) {
    const { access, refresh } = (await result.json()) as {
      access: string;
      refresh: string;
    };

    const updatedUserData = await getUserDataJson(access, refresh);

    return {
      success: t("profile.twofactor.deleted"),
      error: null,
      userData: updatedUserData,
    };
  }

  if (!result?.ok) {
    return {
      success: null,
      error: t("profile.twofactor.notDeleted"),
      userData: null,
    };
  }

  return {
    success: null,
    error: null,
    userData: null,
  };
}
