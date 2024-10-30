"use server";

import setCookie, { Cookie } from "set-cookie-parser";

export default async function parseCookies(
  response: Response,
): Promise<Cookie[]> {
  const responseCookies: Cookie[] = [];
  const cookies = response.headers.getSetCookie();
  cookies.forEach((cookie) => {
    responseCookies.push(setCookie(cookie)[0]);
  });
  return responseCookies;
}
