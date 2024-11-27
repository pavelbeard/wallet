import { AuthData, RefreshToken } from "@/app/lib/types";
import { User } from "next-auth";
import { z } from "zod";
import { UpdateSessionSchema } from "../schemas.z";
import getCurrentEpochTime from "./getCurrentEpochTime";

/**
 * Helps to set auth data from different sources and being an only source of truth
 * @param user - user object [optional]
 * @param session - session object [optional]
 * @param refreshResult - refresh token object [optional]
 */
export default function setAuthData({
  user,
  session,
  refreshResult,
}: {
  user?: User;
  session?: z.infer<typeof UpdateSessionSchema>;
  refreshResult?: RefreshToken["tokens"];
}): AuthData {
  let access_token: string | undefined;
  let access_token_exp: number | undefined;

  let refresh_token: string | undefined;
  let refresh_token_exp: number | undefined;

  if (user) {
    access_token = user.access_token?.value;
    const accessTokenMaxAge = user.access_token?.maxAge as number;
    access_token_exp = getCurrentEpochTime() + accessTokenMaxAge;

    if (user.refresh_token) {
      refresh_token = user.refresh_token.value;
      const refreshTokenMaxAge = user.refresh_token?.maxAge as number;
      refresh_token_exp = getCurrentEpochTime() + refreshTokenMaxAge;
    }
  }

  if (session) {
    access_token = session?.access_token;
    const accessTokenMaxAge = session?.access_token_exp as number;
    access_token_exp = getCurrentEpochTime() + accessTokenMaxAge;

    if (session?.refresh_token) {
      refresh_token = session?.refresh_token;
      const refreshTokenMaxAge = session?.refresh_token_exp as number;
      refresh_token_exp = getCurrentEpochTime() + refreshTokenMaxAge;
    }
  }

  if (refreshResult) {
    access_token = refreshResult?.accessToken.value;
    const accessTokenMaxAge = refreshResult?.accessToken.maxAge as number;
    access_token_exp = getCurrentEpochTime() + accessTokenMaxAge;

    refresh_token = refreshResult?.accessToken.value;
    const refreshTokenMaxAge = refreshResult?.refreshToken.maxAge as number;
    refresh_token_exp = getCurrentEpochTime() + refreshTokenMaxAge;
  }

  return {
    access_token,
    access_token_exp,
    refresh_token,
    refresh_token_exp,
  };
}
