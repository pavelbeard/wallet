"use server";

import { API_PATH } from "./constants";
import logger from "./logger";

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
    .then(async (response) => {
      return {
        json: JSON.parse(JSON.stringify(await response.json())),
        response,
      };
    })
    .then((data) => {
      logger("data", data);
      return data;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
}
