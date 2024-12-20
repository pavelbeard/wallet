"use server";

import { MasterPasswordSchema } from "@/app/lib/schemas.z";
import { WalletUser } from "@/auth";
import { z } from "zod";
import getTranslations from "../helpers/getTranslations";
import getUserDataJson from "../helpers/getUserDataJson";
import protectedQuery from "../helpers/protectedQuery";

export default async function sendMasterPassword(
  data: z.infer<typeof MasterPasswordSchema>,
): Promise<{
  error: string | null;
  success: string | null;
  userData: {
    user: WalletUser;
    access_token: string;
    refresh_token: string;
    access_token_exp: number;
    expires_at: number | undefined;
  } | null;
}> {
  const t = await getTranslations();
  const result = await protectedQuery({
    url: `/users/check_master_password/`,
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: data,
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: t("error.somethingWentWrong"),
      userData: null,
    };
  }

  if (!result?.ok) {
    const errorData = await result?.json();
    return {
      // @ts-expect-error itemType as {error: {<field>: [ '<message>' ]}}
      error: Object.values(Object.values(errorData)[0])[0][0],
      success: null,
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
      error: null,
      success: t("auth.masterPassword.send.success"),
      userData: updatedUserData,
    };
  }

  return {
    success: null,
    error: null,
    userData: null,
  };
}
