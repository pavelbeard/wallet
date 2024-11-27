"use server";

import { SignInSchema, SignInValidator } from "@/app/lib/schemas.z";
import { signIn } from "@/auth";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";

export default async function authenticate(values: SignInValidator) {
  const locale = await getLocale();
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
      redirectTo: `/${locale}${DEFAULT_SIGNED_IN_PATH}`,
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
