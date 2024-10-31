"use client";

import FormError from "@/app/components/form/form-error";
import authenticate from "@/app/lib/authenticate";
import { SignInSchema, SignInValidator } from "@/app/lib/schemas.z";
import AuthQuestion from "@/app/ui/auth-question";
import EmailInput from "@/app/ui/email-input";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import OauthButtons from "@/app/ui/oauth-buttons";
import PasswordInput from "@/app/ui/password-input";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSuccess from "../form/form-success";

const signInResolver = zodResolver(SignInSchema);

export default function SignInForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<SignInValidator> = async (data) => {
    setAuthError(null);
    setAuthSuccess(null);

    startTransition(() => {
      authenticate(data).then((result) => {
        setAuthSuccess(result?.success);
        setAuthError(result?.error);
      });
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormTitle>{t("form.formTitle.signIn")}</FormTitle>
        <EmailInput
          labelText={t("form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
          register={register}
        />
        {errors.email?.message && (
          <p className="field-error">{errors.email.message}</p>
        )}
        <PasswordInput
          labelText={t("form.passwordInput")}
          htmlFor="credentials-password"
          name="password"
          id="credentials-password"
          register={register}
        />
        {errors.password?.message && (
          <p className="field-error">{errors.password.message}</p>
        )}
        <FormError message={authError} />
        <FormSuccess message={authSuccess} />
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
