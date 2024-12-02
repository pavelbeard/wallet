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
}) {
  const accessToken = await getAccessToken();

  headers?.append("Content-Type", "application/json");
  headers?.append("Accept", "application/json");
  headers?.append("Authorization", `Bearer ${accessToken}`);

  return fetch(`${API_PATH}/api${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  })
    .then(async (response) => {
      const json = await response.json();

      return {
        json: JSON.parse(JSON.stringify(json)),
        response,
      };
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
}
