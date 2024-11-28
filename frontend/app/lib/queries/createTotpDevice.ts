"use server";

import getUser from "@/app/lib/getUser";
import query from "@/app/lib/helpers/query";
import { TOTPData } from "@/app/lib/types";

export default async function createTotpDevice(): Promise<TOTPData | null> {
  const user = await getUser();
  if (user?.provider == "credentials") {
    const result = await query({
      url: "/2fa/create_totp_device/",
      method: "POST",
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
