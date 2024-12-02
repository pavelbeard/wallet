"use server";

import getUser from "@/app/lib/getUser";
import { TOTPData } from "@/app/lib/types";
import protectedQuery from "../helpers/protectedQuery";

export default async function createTotpDevice(): Promise<TOTPData | null> {
  const user = await getUser();
  if (user?.provider == "credentials") {
    // TODO: Something is wrong with the session access_token in server side
    const result = await protectedQuery({
      url: "/2fa/create_totp_device/",
      method: "POST",
      credentials: "include",
    });

    if (result instanceof Error) {
      return null;
    }

    if (result?.response.ok) {
      return result.json;
    }

    if (result?.response.status === 400) {
      return null;
    }
  }

  return null;
}
