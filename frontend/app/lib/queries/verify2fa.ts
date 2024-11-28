"use server";

import query from "@/app/lib/helpers/query";
import updateUserData from "@/app/lib/helpers/updateSession";
import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

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

  const result = await query({
    url: "/2fa/verify_totp_device/",
    method: "POST",
    body: data,
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
    const { response } = result;
    const updatedUserData = await updateUserData(response);
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
