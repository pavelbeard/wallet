"use server";

import { SignUpSchema, SignUpValidator } from "@/app/lib/schemas.z";
import { API_PATH } from "./helpers/constants";

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
    return { success: null, error: "Error while registration" };
  }

  return {
    success: `Mail with validation code has been sent on your mail: ${validatedData.data.email}`,
    error: null,
  };
}
