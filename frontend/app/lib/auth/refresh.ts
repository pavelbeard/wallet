import refreshToken from "@/app/lib/auth/refreshToken";
import setAuthData from "@/app/lib/helpers/setAuthData";
import { JWT } from "@auth/core/jwt";

const refresh = async (token: JWT) => {
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
    if (refreshResult.success) {
      return {
        ...token,
        ...setAuthData({
          refreshResult: refreshResult.tokens,
        }),
      };
    } else {
      return null;
    }
  }

  return token;
};

export default refresh;
