"use server"

import { SignInSchema } from "@/app/lib/schemas.z";

export default async function signIn(state: unknown, formData: FormData) {
    const validatedData = SignInSchema.safeParse(Object.fromEntries(formData));

    if (validatedData.error) {
        return {
            errors: validatedData.error.flatten().fieldErrors
        }
    }
}