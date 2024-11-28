"use server";

import query from "@/app/lib/helpers/query";
import updateUserData from "@/app/lib/helpers/updateSession";
import { PasswordValidator } from "@/app/lib/schemas.z";

export default async function delete2fa(data: PasswordValidator) {
  // TODO: Something is wrong with the session access_token in server side
  const result = await query({
    url: `/2fa/delete_totp_device/`,
    method: "DELETE",
    body: data,
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: "profile.twofactor.notDeleted",
      userData: null,
    };
  }

  if (result?.response.ok) {
    // TODO: apply new access token without TOTP device to session
    const updatedUserData = await updateUserData(result.response);
    return {
      success: "profile.twofactor.deleted",
      error: null,
      userData: updatedUserData,
    };
  }

  if (result?.response.status === 400) {
    return {
      success: null,
      error: "profile.twofactor.notDeleted",
      userData: null,
    };
  }

  return {
    success: null,
    error: "profile.twofactor.notDeleted",
    userData: null,
  };
}
