"use server";

import { API_PATH } from "@/app/lib/constants";
import parseCookies from "@/app/lib/parseCookies";
import { Cookie } from "set-cookie-parser";

type RefreshToken = {
  success: boolean;
  tokens?: {
    accessToken: Cookie;
    refreshToken: Cookie;
  };
  error?: string;
};

export default async function refreshToken(
  refreshTokenValue: string,
): Promise<RefreshToken> {
  try {
    const response = await fetch(`${API_PATH}/api/stuff/refresh/`, {
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
