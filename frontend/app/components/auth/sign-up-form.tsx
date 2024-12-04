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
        <div role="fieldset" className="flex flex-col gap-2">
          {usernameSuggestions.isTaken && (
            <FormError
              ariaLabel="Username is taken"
              message={t("form.usernameSuggestions")}
            />
          )}
          <CustomInput
            ariaLabel="Username (cuckoo_dragon)"
            labelText={`${t("form.usernameInput")}:`}
            htmlFor="credentials-username"
            name="username"
            id="credentials-username"
            register={register}
            autoComplete="username"
            testId="sign-up-username-input"
          />
          {Array.isArray(usernameSuggestions.data) && (
            <div className="relative">
              <ul
                className={clsx(
                  "absolute left-0 top-2/3 my-2 w-full p-2 text-sm",
                  "flex flex-col gap-y-2 text-slate-800",
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
        <FormError
          ariaLabel="Username field"
          message={errors.username?.message as string}
        />
        <div role="fieldset" className="flex flex-col gap-2 lg:flex-row">
          <CustomInput
            ariaLabel="First name (John)"
            labelText={`${t("form.firstNameInput")}:`}
            htmlFor="credentials-firstName"
            name="first_name"
            id="credentials-firstName"
            register={register}
            autoComplete="first_name"
            testId="sign-up-first-name-input"
          />
          <FormError
            ariaLabel="First name field"
            message={errors.first_name?.message as string}
          />
          <CustomInput
            ariaLabel="Last name (Doe)"
            labelText={`${t("form.lastNameInput")}:`}
            htmlFor="credentials-lastName"
            name="last_name"
            id="credentials-lastName"
            register={register}
            autoComplete="last_name"
            testId="sign-up-last-name-input"
          />
        </div>
        <FormError
          ariaLabel="Last name field"
          message={errors.last_name?.message as string}
        />
        <EmailInput
          ariaLabel="Email (test@test.com)"
          labelText={t("auth.form.emailInput")}
          htmlFor="credentials-email"
          name="email"
          id="credentials-email"
          register={register}
          autoComplete="email"
          testId="sign-up-email-input"
        />
        <FormError
          ariaLabel="Email field"
          message={errors.email?.message as string}
        />
        <PasswordInput
          ariaLabel="Password (min 8 characters)"
          labelText={`${t("auth.form.passwordInput")}:`}
          htmlFor="credentials-password"
          name="password"
          id="credentials-password"
          register={register}
          autoComplete="new-password"
          testId="sign-up-password-input"
        />
        <FormError
          ariaLabel="Password field"
          message={errors.password?.message as string}
        />
        <PasswordInput
          ariaLabel="Confirm password (min 8 characters)"
          labelText={`${t("auth.form.password2Input")}:`}
          htmlFor="credentials-password2"
          name="password2"
          id="credentials-password2"
          register={register}
          autoComplete="new-password-confirmation"
          testId="sign-up-password-input-confirm"
        />
        <div className="flex flex-col gap-y-2">
          {issues &&
            issues.map((issue, index) => (
              <Messages errorMessage={issue.message} key={index} />
            ))}
        </div>
        <FormError
          ariaLabel="Form error"
          message={formMessages.error}
          testId="sign-up-error"
        />
        <FormSuccess
          ariaLabel="Form success"
          message={formMessages.success}
          testId="sign-up-success"
        />
        <Submit
          ariaLabel="Sign up"
          disabled={isPending}
          color="bg-slate-800 hover:bg-slate-300 hover:text-black"
          testId="sign-up-btn"
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
