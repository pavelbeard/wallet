"use server";

import query from "@/app/lib/helpers/query";
import updateUserData from "@/app/lib/helpers/updateSession";
import { PasswordValidator } from "@/app/lib/schemas.z";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export default async function delete2fa(data: PasswordValidator) {
  // TODO: Something is wrong with the session access_token in server side
  const locale = getLocale();
  const { response } = await query({
    url: `/2fa/delete_totp_device/`,
    method: "DELETE",
    body: data,
  });

  if (response) {
    // TODO: apply new access token without TOTP device to session
    const updatedUserData = await updateUserData(response);

    return {
      success: "profile.twofactor.deleted",
      error: null,
      userData: updatedUserData,
    };
  }

  revalidatePath(`/${locale}/profile/2fa`);

  return {
    success: null,
    error: "profile.twofactor.notDeleted",
    userData: null,
  };
}
