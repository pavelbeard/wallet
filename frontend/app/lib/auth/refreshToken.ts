"use server";

import { WalletUser } from "@/auth";
import CustomHeaders from "../helpers/getHeaders";
import getUserDataJson from "../helpers/getUserDataJson";
import query from "../helpers/query";

type RefreshTokenResult = {
  user?: WalletUser;
  access_token?: string;
  refresh_token?: string;
  access_token_exp?: number;
  expires_at?: number;
  refresh_token_err?: "RefreshTokenError";
};

export default async function refreshToken(
  refresh_token: string,
): Promise<RefreshTokenResult | null> {
  const result = await query({
    url: "/refresh/",
    method: "POST",
    headers: await CustomHeaders.getHeaders(),
    body: { refresh: refresh_token },
    credentials: "include",
  });

  if (result instanceof Error) return null;
  if (result?.response.status !== 200) throw "RefreshTokenError";

  // const cookies = await parseCookies(response);
  const { access, refresh } = (await result.json) as {
    access: string;
    refresh: string;
  };
  const {
    user,
    access_token: res_access_token,
    refresh_token: res_refresh_token,
    access_token_exp,
    expires_at,
  } = await getUserDataJson(access, refresh);

  return {
    user: user as WalletUser,
    access_token: res_access_token,
    refresh_token: res_refresh_token,
    access_token_exp,
    expires_at,
  };
}
