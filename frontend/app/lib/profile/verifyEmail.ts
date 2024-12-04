import protectedQuery from "../helpers/protectedQuery";

export default async function verifyEmail(token: string) {
  const response = await protectedQuery({
    url: `/users/verify_email/`,
    method: "POST",
    body: { token },
  });

  if (response instanceof Error) {
    return {
      success: null,
      error: "Something went wrong...",
    };
  }

  if (!response?.response.ok) {
    return {
      success: null,
      error: "profile.userCard.changeEmail.error",
    };
  }

  if (response?.response.ok) {
    return {
      success: "profile.userCard.changeEmail",
      error: null,
    };
  }

  return {
    success: null,
    error: null,
  };
}
