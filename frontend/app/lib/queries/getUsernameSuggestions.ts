"use server";

import getTranslations from "../helpers/getTranslations";
import query from "../helpers/query";

export default async function getUsernameSuggestions(username: string) {
  const t = await getTranslations();
  const result = await query({
    url: "/users/username_suggestions/",
    method: "POST",
    body: { username, count: 5 },
    credentials: "omit",
  });

  if (result instanceof Error) {
    return {
      error: t("error.somethingWentWrong"),
      data: null,
      loading: false,
      isTaken: false,
    };
  }

  if (!result?.ok) {
    return {
      error: t("usernameSuggestions.error"),
      data: null,
      loading: false,
      isTaken: false,
    };
  }

  if (result?.ok) {
    const json = await result.json();
    return {
      error: null,
      data: json.username as string[],
      loading: false,
      isTaken: true,
    };
  }

  return {
    error: null,
    data: null,
    loading: false,
    isTaken: false,
  };
}
