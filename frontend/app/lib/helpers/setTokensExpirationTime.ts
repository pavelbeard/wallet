"use server";

import getCurrentEpochTime from "./getCurrentEpochTime";

export default async function setTokensExpirationTime(
  access_token: number,
  refresh_token: number,
) {
  return {
    access_token_exp: getCurrentEpochTime() + (access_token as number),
    refresh_token_exp: getCurrentEpochTime() + (refresh_token as number),
  };
}
