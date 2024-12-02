"use server";

import { PasswordValidator } from "@/app/lib/schemas.z";
import getUserDataJson from "../helpers/getUserDataJson";
import protectedQuery from "../helpers/protectedQuery";

export default async function delete2fa(data: PasswordValidator) {
  // TODO: Something is wrong with the session access_token in server side
  const result = await protectedQuery({
    url: `/2fa/delete_totp_device/`,
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: data,
    credentials: "include",
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
    const { access, refresh } = (await result.json) as {
      access: string;
      refresh: string;
    };
    const updatedUserData = await getUserDataJson(access, refresh);
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
