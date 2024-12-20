"use server";

import getUser from "@/app/lib/helpers/getUser";
import { TOTPData } from "@/app/lib/types";
import protectedQuery from "../../helpers/protectedQuery";

export default async function createTotpDevice(): Promise<TOTPData | null> {
  const user = await getUser();
  if (user?.provider == "credentials") {
    const result = await protectedQuery({
      url: "/2fa/create_totp_device/",
      method: "POST",
      credentials: "include",
    });

    if (result instanceof Error) {
      return null;
    }

    if (result?.ok) {
      const json = await result.json();
      return json;
    }

    if (result?.status === 400) {
      return null;
    }
  }

  return null;
}
