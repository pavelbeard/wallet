"use server";

import { API_PATH } from "@/app/lib/helpers/constants";
import { SignUpSchema, SignUpValidator } from "@/app/lib/schemas.z";

export default async function registration(values: SignUpValidator) {
  const validatedData = SignUpSchema.safeParse(values);

  if (validatedData.error) {
    return {
      success: null,
      error: "Invalid data.",
    };
  }

  const response = await fetch(`${API_PATH}/api/auth/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedData.data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    return {
      success: null,
      // @ts-expect-error itemType as {error: {<field>: [ '<message>' ]}}
      error: Object.values(Object.values(errorData)[0])[0][0],
    };
  }

  return {
    success: `Mail with validation code has been sent on your mail: ${validatedData.data.email}`,
    error: null,
  };
}
