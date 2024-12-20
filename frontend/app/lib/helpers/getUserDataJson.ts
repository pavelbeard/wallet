import { WalletUser } from "@/auth";
import { jwtDecode } from "jwt-decode";

export default async function getUserDataJson(
  access_token: string,
  refresh_token: string,
) {
  const decodedToken = jwtDecode(access_token) as WalletUser & { exp: number };
  const decodedRefreshToken = jwtDecode(refresh_token);

  const userData = {
    public_id: decodedToken.public_id,
    username: decodedToken.username,
    first_name: decodedToken.first_name,
    last_name: decodedToken.last_name,
    image: decodedToken.image,
    email: decodedToken.email,
    orig_iat: decodedToken.orig_iat,
    otp_device_id: decodedToken.otp_device_id,
    created_at: decodedToken.created_at,
    verified: decodedToken.verified,
    is_two_factor_enabled: decodedToken.is_two_factor_enabled,
    is_email_verified: decodedToken.is_email_verified,
    is_oauth_user: decodedToken.is_oauth_user,
  } as WalletUser;

  return {
    user: userData,
    access_token,
    refresh_token,
    access_token_exp: decodedToken.exp,
    expires_at: decodedRefreshToken.exp,
  };
}
