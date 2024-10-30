"use client";


import signInFormValidator from "@/app/lib/signInFormValidator";
import AuthQuestion from "@/app/ui/auth-question";
import EmailInput from "@/app/ui/email-input";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import OauthButtons from "@/app/ui/oauth-buttons";
import PasswordInput from "@/app/ui/password-input";
import Submit from "@/app/ui/submit";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
// import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";

export default function SignInForm() {
  const t = useTranslations("auth");
  const [state, signInAction, isPending] = useFormState(signInFormValidator, null);

  const credAction = (formData: FormData) => {
    try {
      signInAction(formData)
      signIn("credentials", { ...Object.fromEntries(formData), redirectTo: `/es${DEFAULT_SIGNED_IN_PATH}`})
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <>
      <form action={signInAction} className="flex flex-col gap-4">
        <FormTitle>{t("form.formTitle.signIn")}</FormTitle>
        <EmailInput
          labelText={t("form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
        />
        {state?.errors?.email &&
          state.errors.email.map((message) => (
            <p key={message} className="field-error">
              {message}
            </p>
          ))}
        <PasswordInput
          labelText={t("form.passwordInput")}
          htmlFor="credentials-password"
          name="password"
          id="credentials-password"
        />
        {state?.errors?.password &&
          state.errors.password.map((message) => (
            <p key={message} className="field-error">
              {message}
            </p>
          ))}
        {state?.message && <p className="field-error">{state.message}</p>}
        <Submit
          disabled={isPending}
          color="bg-slate-800 hover:bg-slate-300 hover:text-black"
        >
          {t("form.signIn")}
        </Submit>
      </form>
      <FormDivider />
      <OauthButtons />
      <AuthQuestion href={"/auth/sign-up"} type="without-account" />
    </>
  );
}
