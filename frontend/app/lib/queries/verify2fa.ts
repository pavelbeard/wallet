"use server";

import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import getUserDataJson from "../helpers/getUserDataJson";
import protectedQuery from "../helpers/protectedQuery";

export default async function verify2fa(data: TwoFactorValidator) {
  const locale = await getLocale();
  const validatedData = TwoFactorSchema.safeParse(data);

  if (validatedData.error) {
    return {
      success: null,
      error: "Invalid data.",
      userData: null,
    };
  }

  const result = await protectedQuery({
    url: "/2fa/verify_totp_device/",
    method: "POST",
    body: data,
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    credentials: "include",
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: "profile.twofactor.notVerified",
      userData: null,
    };
  }

  if (result?.response.ok) {
    // TODO: apply new access token with a TOTP device to session
    const { access, refresh } = (await result.json) as {
      access: string;
      refresh: string;
    };
    const updatedUserData = await getUserDataJson(access, refresh);
    revalidatePath(`/${locale}/profile/2fa`);
    return {
      success: "profile.twofactor.verified",
      error: null,
      userData: updatedUserData,
    };
  }

  return {
    success: null,
    error: "profile.twofactor.notVerified",
    userData: null,
  };
}
