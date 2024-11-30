"use server";

import { SignInSchema, SignInValidator } from "@/app/lib/schemas.z";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export default async function authenticate(values: SignInValidator) {
  const validatedData = SignInSchema.safeParse(values);

  if (validatedData.error) {
    return {
      success: null,
      error: "Invalid fields",
    };
  }

  try {
    await signIn("credentials", {
      ...validatedData.data,
    });

    return { success: "Signed in.", error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type == "CredentialsSignin") {
        return { success: null, error: "Bad credentials" };
      }
    }

    if (error instanceof TypeError) {
      return { success: null, error: "Server is not working!" };
    }

    throw error;
  }
}
