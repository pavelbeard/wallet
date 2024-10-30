"use client";

import signUp from "@/app/lib/signUp";
import AuthQuestion from "@/app/ui/auth-question";
import EmailInput from "@/app/ui/email-input";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import OauthButtons from "@/app/ui/oauth-buttons";
import PasswordInput from "@/app/ui/password-input";
import Submit from "@/app/ui/submit";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";

export default function SignUpForm() {
  const t = useTranslations("auth");
  const [state, signUpAction, isPending] = useFormState(signUp, null);

  return (
    <>
      <form action={signUpAction} className="flex flex-col gap-4">
        <FormTitle>{t("form.formTitle.signUp")}</FormTitle>
        <EmailInput
          labelText={t("form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
        />
        {state?.errors?.email &&
          state.errors.email.map((message) => (
            <p key={message} className="text-red-500">
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
            <p key={message} className="text-red-500">
              {message}
            </p>
          ))}
        <PasswordInput
          labelText={t("form.passwordInput")}
          htmlFor="credentials-password2"
          name="password2"
          id="credentials-password2"
        />
        {state?.errors?.password2 &&
          state.errors.password2.map((message) => (
            <p key={message} className="text-red-500">
              {message}
            </p>
          ))}
        {state?.issues &&
          state.issues.map((issue) => (
            <p key={issue.message} className="text-red-500">
              {issue.message}
            </p>
          ))}
        <Submit
          disabled={isPending}
          color="bg-slate-800 hover:bg-slate-300 hover:text-black"
        >
          {t("form.signUp")}
        </Submit>
      </form>
      <FormDivider />
      <OauthButtons />
      <AuthQuestion type="with-account" href={"/auth/sign-in"} />
    </>
  );
}
