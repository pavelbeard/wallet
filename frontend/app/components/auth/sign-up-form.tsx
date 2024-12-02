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
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

const signUpResolver = zodResolver(SignUpSchema);

export default function SignUpForm() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpValidator>({
    resolver: signUpResolver,
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password2: "",
    },
  });
  const { onSubmit, isPending, formMessages, usernameSuggestions } =
    useSignUp(watch);

  const issues = Array.isArray(Object.values(errors)) && Object.values(errors);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormTitle textSize="md">{t("auth.form.formTitle.signUp")}</FormTitle>
        <div role="fieldset" className=" flex flex-col gap-2">
          {usernameSuggestions.isTaken && <FormError message={t("form.usernameSuggestions")} />}
          <CustomInput
            labelText={`${t("form.usernameInput")}:`}
            htmlFor="credentials-username"
            name="username"
            id="credentials-username"
            register={register}
            autoComplete="username"
          />
          {Array.isArray(usernameSuggestions.data) && (
            <div className="relative">
              <ul
                className={clsx(
                  "absolute top-2/3 left-0 w-full p-2 my-2 text-sm",
                  "text-slate-800 flex flex-col gap-y-2",
                  "bg-slate-100",
                )}
                id="suggestions-username"
              >
                {usernameSuggestions.data.map((suggestion) => (
                  <li
                    className="hover:bg-slate-600 hover:text-white"
                    onClick={(e) => {
                      setValue(
                        "username",
                        e.currentTarget.getAttribute("data-value") as string,
                      );
                    }}
                    key={suggestion}
                    data-value={suggestion}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <FormError message={errors.username?.message as string} />
        <div role="fieldset" className="flex flex-col lg:flex-row gap-2">
          <CustomInput
            labelText={`${t("form.firstNameInput")}:`}
            htmlFor="credentials-firstName"
            name="first_name"
            id="credentials-firstName"
            register={register}
            autoComplete="firstName"
          />
          <FormError message={errors.first_name?.message as string} />
          <CustomInput
            labelText={`${t("form.lastNameInput")}:`}
            htmlFor="credentials-lastName"
            name="last_name"
            id="credentials-lastName"
            register={register}
            autoComplete="lastName"
          />
        </div>
        <FormError message={errors.last_name?.message as string} />
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
