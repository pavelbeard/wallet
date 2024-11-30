"use server";

import parseCookies from "@/app/lib/helpers/parseCookies";
import getUserDataCookies from "./getUserDataCookies";

export default async function updateUserData(response: Response) {
  // if verifying 2fa (creating new token / verifying existing token)
  if (response.ok) {
    const parsedCookies = await parseCookies(response);
    const updatedUserData = await getUserDataCookies(parsedCookies);

    return { ...updatedUserData };
  }
}
