"use server";

import { API_PATH } from "@/app/lib/helpers/constants";
import parseCookies from "@/app/lib/helpers/parseCookies";
import { RefreshToken } from "@/app/lib/types";
import { WalletUser } from "@/auth";
import { JWT } from "next-auth";
import getUserData from "../helpers/getUserData";

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
    const {
      user,
      access_token,
      refresh_token,
      access_token_exp,
      refresh_token_exp,
    } = await getUserData(responseCookies);

    const tokens = {
      user: user as WalletUser,
      access_token,
      refresh_token,
      access_token_exp,
      refresh_token_exp,
    } as JWT;

    return {
      success: true,
      tokens,
    };
  } catch (error) {
    console.error(error);
    return { success: false, tokens: null, error: "RefreshTokenError" };
  }
}
