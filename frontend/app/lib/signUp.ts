"use server";

import { SignUpSchema } from "@/app/lib/schemas.z";

export default async function signUp(state: unknown, formData: FormData) {
  const validatedData = SignUpSchema.safeParse(Object.fromEntries(formData));

  if (validatedData.error) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      issues: validatedData.error.issues,
    };
  }
}
