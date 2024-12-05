"use server";

import { API_PATH } from "./constants";

export default async function query({
  url,
  method = "GET",
  headers = new Headers(),
  body,
  credentials = "include",
}: {
  url: string;
  method?: string;
  body?: unknown;
  headers?: Headers;
  credentials?: "omit" | "include" | "same-origin";
}): Promise<Error | Response | null> {
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  return fetch(`${API_PATH}/api-v1${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
}
