import { API_PATH } from "./constants";
import getAccessToken from "./getAccessToken";

export default async function protectedQuery({
  url,
  method = "GET",
  body,
  headers = new Headers(),
  credentials = "include",
}: {
  url: string;
  method?: string;
  body?: unknown;
  headers?: Headers;
  credentials?: "omit" | "include" | "same-origin";
}): Promise<Error | Response | null> {
  const accessToken = await getAccessToken();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch(`${API_PATH}/api${url}`, {
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
