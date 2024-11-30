"use server";

import { API_PATH } from "./constants";

export default async function query({
  url,
  method = "GET",
  headers,
  body,
  credentials = "include",
}: {
  url: string;
  method?: string;
  body?: unknown;
  headers?: Headers;
  credentials?: "omit" | "include" | "same-origin";
}): Promise<Error | { json: unknown; response: Response } | null> {
  return fetch(`${API_PATH}/api${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials,
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
