"use server";

import query from "../helpers/query";

export default async function changeEmail(data: { email: string }) {
  const result = await query({
    url: "/users/change_email/",
    method: "POST",
    body: data,
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: "Something went wrong...",
    };
  }

  if (result?.response.ok) {
    const data = await result.json;

    return {
      success: "profile.userCard.changeEmail",
      error: null,
      newEmail: data?.new_email,
    };
  }

  if (result?.response.status === 400) {
    return {
      success: null,
      error: "profile.userCard.changeEmail.error",
      newEmail: null,
    };
  }

  return {
    success: null,
    error: null,
    newEmail: null,
  };
}
