"use server";

import { SignInSchema } from "@/app/lib/schemas.z";
import { signIn as signin } from "@/auth";
import { redirect } from "@/i18n/routing";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
import { log } from "console";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";
// import { redirect } from "next/navigation";

export default async function signInFormValidator(prevState: unknown, formData: FormData) {
  const locale = await getLocale();
  const validatedData = SignInSchema.safeParse(Object.fromEntries(formData));

  if (validatedData.error) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    await signin("credentials", { ...validatedData.data, redirect: false });
    // await signin("credentials", { ...validatedData.data, callbackUrl: `/${locale}${DEFAULT_SIGNED_IN_PATH}` }); // <- here doesn't redirect an user to the dashboard
    log('redirected...')
  } catch (e) {
    if (e instanceof AuthError) {
      return { message: e.message.split(".")[0].concat(".") };
    } else if (e instanceof TypeError) {
      return { message: "Server is not working!" };
    }
  }

  redirect({ href: DEFAULT_SIGNED_IN_PATH, locale });
  // redirect(`/${locale}${DEFAULT_SIGNED_IN_PATH}`);
}
