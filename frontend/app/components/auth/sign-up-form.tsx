"use client";

import FormError from "@/app/components/form/form-error";
import FormSuccess from "@/app/components/form/form-success";
import registration from "@/app/lib/registration";
import { SignUpSchema, SignUpValidator } from "@/app/lib/schemas.z";
import AuthQuestion from "@/app/ui/auth-question";
import EmailInput from "@/app/ui/input-email";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import OauthButtons from "@/app/ui/oauth-buttons";
import PasswordInput from "@/app/ui/input-password";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const signUpResolver = zodResolver(SignUpSchema);

export default function SignUpForm() {
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValidator>({
    resolver: signUpResolver,
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });
  const issues = Array.isArray(Object.values(errors)) && Object.values(errors);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<SignUpValidator> = (data) => {
    setAuthError(null);
    setAuthSuccess(null);

    startTransition(() => {
      registration(data).then((result) => {
        setAuthError(result?.error);
        setAuthSuccess(result?.success);
      });
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormTitle>{t("form.formTitle.signUp")}</FormTitle>
        <EmailInput
          labelText={t("form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
          register={register}
          autoComplete="email"
        />
        {errors.email?.message && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
        <PasswordInput
          labelText={t("form.passwordInput")}
          htmlFor="credentials-password"
          name="password"
          id="credentials-password"
          register={register}
          autoComplete="new-password"
        />
        {errors.password?.message && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <PasswordInput
          labelText={t("form.passwordInput")}
          htmlFor="credentials-password2"
          name="password2"
          id="credentials-password2"
          register={register}
          autoComplete="new-password"
        />
        <div className="flex flex-col gap-y-2">
          {issues &&
            issues.map((issue, index) => (
              <p key={index} className="text-red-500">
                {issue.message}
              </p>
            ))}
        </div>
        <FormError message={authError} />
        <FormSuccess message={authSuccess} />
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
