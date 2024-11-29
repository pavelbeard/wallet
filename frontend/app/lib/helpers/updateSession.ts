"use server";

import parseCookies from "@/app/lib/helpers/parseCookies";
import getUserData from "./getUserData";

export default async function updateUserData(response: Response) {
  // if verifying 2fa (creating new token / verifying existing token)
  if (response.ok) {
    const parsedCookies = await parseCookies(response);
    const updatedUserData = await getUserData(parsedCookies);

    return { ...updatedUserData };
  }
}
