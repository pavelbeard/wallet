"use server";

import { API_PATH } from "@/app/lib/helpers/constants";
import parseCookies from "@/app/lib/helpers/parseCookies";
import { RefreshToken } from "@/app/lib/types";
import { Cookie } from "set-cookie-parser";

export default async function refreshToken(
  refreshTokenValue: string,
): Promise<RefreshToken> {
  try {
    const response = await fetch(`${API_PATH}/api/refresh/`, {
      method: "POST",
      headers: { Cookie: `__rclientid=${refreshTokenValue}` },
      credentials: "include",
    });

    if (!response.ok) throw new Error();

    const responseCookies = await parseCookies(response);
    const [accessToken, refreshToken] = responseCookies.map((cookie) => {
      if (cookie.name === "__clientid" || cookie.name === "__rclientid") {
        return cookie;
      }
    }) as Cookie[];

    return { success: true, tokens: { accessToken, refreshToken } };
  } catch (error) {
    console.error(error);
    return { success: false, error: "RefreshTokenError" };
  }
}
