import { WalletUser } from "@/auth";
import { jwtDecode } from "jwt-decode";
import { Cookie } from "set-cookie-parser";
import setTokensExpirationTime from "./setTokensExpirationTime";

export default async function getUserData(parsedCookies: Cookie[]) {
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
    is_two_factor_enabled: decodedToken.is_two_factor_enabled,
    is_email_verified: decodedToken.is_email_verified,
    is_oauth_user: decodedToken.is_oauth_user,
  } as WalletUser;

  const { access_token_exp, refresh_token_exp } = await setTokensExpirationTime(
    access_token?.maxAge as number,
    refresh_token?.maxAge as number,
  );

  return {
    user: userData,
    access_token: access_token?.value,
    refresh_token: refresh_token?.value,
    access_token_exp,
    refresh_token_exp,
  };
}
