import refreshToken from "@/app/lib/auth/refreshToken";
import { JWT } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

const refresh = async (
  token: JWT | NextAuthJWT,
): Promise<JWT | NextAuthJWT | null> => {
  const now = Date.now() / 1000;
  const { access_token_exp, refresh_token, expires_at } = token as {
    access_token_exp: number;
    refresh_token: string;
    expires_at: number;
  };

  // if the refresh token is expired, the session is down.
  if (!refresh_token || now > expires_at) return null;

  // it necessary to have access token exp and refresh token value
  if (now > access_token_exp && refresh_token) {
    try {
      const refreshResult = await refreshToken(refresh_token);

      if (!refreshResult) {
        throw new Error("RefreshTokenError");
      }

      token.user = refreshResult.user;
      //@ts-ignore
      token.user.provider = "credentials";
      token.access_token = refreshResult.access_token;
      token.refresh_token = refreshResult.refresh_token;
      token.expires_at = refreshResult.expires_at;
      token.access_token_exp = refreshResult.access_token_exp;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return token as NextAuthJWT;
};

export default refresh;
