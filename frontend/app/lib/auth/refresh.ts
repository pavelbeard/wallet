import refreshToken from "@/app/lib/auth/refreshToken";
import { JWT } from "next-auth";

const refresh = async (token: JWT): Promise<JWT | null> => {
  const now = Date.now() / 1000;
  const { access_token_exp, refresh_token, refresh_token_exp } = token as {
    access_token_exp: number;
    refresh_token: string;
    refresh_token_exp: number;
  };

  // if the refresh token is expired, the session is down.
  if (!refresh_token || now > refresh_token_exp) return null;

  // it necessary to have access token exp and refresh token value
  if (now > access_token_exp) {
    const refreshResult = await refreshToken(refresh_token);
    if (refreshResult.success && refreshResult.tokens) {
      const { tokens } = refreshResult;
      return tokens;
    } else {
      return null;
    }
  }

  return token as JWT;
};

export default refresh;
