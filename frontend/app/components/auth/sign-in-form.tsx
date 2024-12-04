"use client";

import FormError from "@/app/components/form/form-error";
import FormSuccess from "@/app/components/form/form-success";
import useSignIn from "@/app/lib/hooks/auth/useSignIn";
import { SignInSchema, SignInValidator } from "@/app/lib/schemas.z";
import AuthQuestion from "@/app/ui/auth-question";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import EmailInput from "@/app/ui/input-email";
import PasswordInput from "@/app/ui/input-password";
import OauthButtons from "@/app/ui/oauth-buttons";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import ResetPasswordRequestBtn from "../change/reset-password-request-btn";

const signInResolver = zodResolver(SignInSchema);

export default function SignInForm() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValidator>({
    resolver: signInResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { onSubmit, isPending, formMessages } = useSignIn();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormTitle textSize="md">{t("auth.form.formTitle.signIn")}</FormTitle>
        <EmailInput
          ariaLabel="Email input"
          labelText={t("auth.form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
          register={register}
          autoComplete="email"
          testId="sign-in-email-input"
        />
        <FormError
          ariaLabel="Form error (email)"
          message={errors.email?.message as string}
        />
        <PasswordInput
          ariaLabel="Password input"
          labelText={t("auth.form.passwordInput")}
          htmlFor="credentials-password"
          name="password"
          id="credentials-password"
          register={register}
          autoComplete="password"
          testId="sign-in-password-input"
        />
        <ResetPasswordRequestBtn />
        <FormError
          ariaLabel="Form error (password)"
          message={errors.password?.message as string}
        />
        <FormError
          ariaLabel="Form error"
          message={formMessages.error}
          testId="sign-in-error"
        />
        <FormSuccess
          ariaLabel="Form success"
          message={formMessages.success}
          testId="sign-in-success"
        />
        <Submit
          ariaLabel="Sign in button"
          disabled={isPending}
          color="bg-slate-800 hover:bg-slate-300 hover:text-black"
          testId="sign-in-btn"
        >
          {t("auth.form.signIn")}
        </Submit>
      </form>
      <FormDivider />
      <OauthButtons />
      <AuthQuestion href={"/auth/sign-up"} type="without-account" />
    </>
  );
}
