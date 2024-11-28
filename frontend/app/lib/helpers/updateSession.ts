"use server";

import parseCookies from "@/app/lib/helpers/parseCookies";
import { WalletUser } from "@/auth";
import { jwtDecode } from "jwt-decode";

export default async function updateUserData(response: Response) {
  // if verifying 2fa (creating new token / verifying existing token)
  if (response.ok) {
    const parsedCookies = await parseCookies(response);
    const [access_token, refresh_token] = parsedCookies.map((cookie) => {
      if (cookie.name === "__clientid" || cookie.name === "__rclientid") {
        return cookie;
      }
    });

    const decodedToken = jwtDecode(access_token?.value as string) as WalletUser;

    const userData = {
      public_id: decodedToken.public_id,
      username: decodedToken.username,
      email: decodedToken.email,
      orig_iat: decodedToken.orig_iat,
      otp_device_id: decodedToken.otp_device_id,
      created_at: decodedToken.created_at,
      verified: decodedToken.verified,
    } as WalletUser;

    return {
      user: userData,
      access_token: access_token?.value,
      access_token_exp: access_token?.maxAge,
      refresh_token: refresh_token?.value,
      refresh_token_exp: refresh_token?.maxAge,
    };
  }
}
