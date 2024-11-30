"use client";

import FormError from "@/app/components/form/form-error";
import FormSuccess from "@/app/components/form/form-success";
import useSignUp from "@/app/lib/hooks/auth/useSignUp";
import { SignUpSchema, SignUpValidator } from "@/app/lib/schemas.z";
import AuthQuestion from "@/app/ui/auth-question";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import EmailInput from "@/app/ui/input-email";
import PasswordInput from "@/app/ui/input-password";
import Messages from "@/app/ui/messages";
import OauthButtons from "@/app/ui/oauth-buttons";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

const signUpResolver = zodResolver(SignUpSchema);

export default function SignUpForm() {
  const t = useTranslations();
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
  const { onSubmit, isPending, formMessages } = useSignUp();
  const issues = Array.isArray(Object.values(errors)) && Object.values(errors);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormTitle textSize="md">{t("auth.form.formTitle.signUp")}</FormTitle>
        <CustomInput
          labelText={`${t("form.usernameInput")}:`}
          htmlFor="credentials-username"
          name="username"
          id="credentials-username"
          register={register}
          autoComplete="username"
        />
        <EmailInput
          labelText={t("auth.form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
          register={register}
          autoComplete="email"
        />
        <FormError message={errors.email?.message as string} />
        <PasswordInput
          labelText={t("auth.form.passwordInput")}
          htmlFor="credentials-password"
          name="password"
          id="credentials-password"
          register={register}
          autoComplete="new-password"
        />
        <FormError message={errors.password?.message as string} />
        <PasswordInput
          labelText={`${t("auth.form.password2Input")}:`}
          htmlFor="credentials-password2"
          name="password2"
          id="credentials-password2"
          register={register}
          autoComplete="new-password"
        />
        <div className="flex flex-col gap-y-2">
          {issues &&
            issues.map((issue, index) => (
              <Messages errorMessage={issue.message} key={index} />
            ))}
        </div>
        <FormError message={formMessages.error} />
        <FormSuccess message={formMessages.success} />
        <Submit
          disabled={isPending}
          color="bg-slate-800 hover:bg-slate-300 hover:text-black"
        >
          {t("auth.form.signUp")}
        </Submit>
      </form>
      <FormDivider />
      <OauthButtons />
      <AuthQuestion type="with-account" href={"/auth/sign-in"} />
    </>
  );
}
