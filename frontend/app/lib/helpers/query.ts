"use server";

import { API_PATH } from "./constants";
import getAccessToken from "./getAccessToken";

export default async function query({
  url,
  method = "GET",
  body,
}: {
  url: string;
  method?: string;
  body?: any;
}): Promise<Error | { json: any; response: Response } | null> {
  const accessToken = await getAccessToken();

  return fetch(`${API_PATH}/api${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `__clientid=${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  })
    .then((response) => {
      return {
        json: response.json(),
        response,
      };
    })
    .then((data) => data)
    .catch((error) => {
      console.error(error);
      return error;
    });
}
