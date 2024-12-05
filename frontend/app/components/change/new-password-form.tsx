"use client";

import useResetPassword from "@/app/lib/hooks/reset-password/useResetPassword";
import { NewPasswordSchema, NewPasswordValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import PasswordInput from "@/app/ui/input-password";
import Submit from "@/app/ui/submit";
import { Link } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import FormError from "../form/form-error";
import FormSuccess from "../form/form-success";

type NewPasswordForm = { token: string } & LocaleProps;

const newPasswordResolver = zodResolver(NewPasswordSchema);

export default function NewPasswordForm({ token }: NewPasswordForm) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<NewPasswordValidator>({
    resolver: newPasswordResolver,
    defaultValues: {
      password: "",
      password2: "",
    },
  });
  const { isPending, onSubmit, formMessages } = useResetPassword(
    token,
    watch,
    clearErrors,
  );

  const issues = Array.isArray(Object.values(errors)) && Object.values(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormTitle textSize="md">{t("verify.password.form.title")}</FormTitle>
      <PasswordInput
        ariaLabel="New password"
        labelText={`${t("verify.password.form.newPassword")}:`}
        htmlFor="new-password"
        name="password"
        id="new-password"
        register={register}
        autoComplete="new-password"
        testId="new-password-input"
      />
      <FormError
        ariaLabel="New password error"
        message={errors.password?.message as string}
      />
      <PasswordInput
        ariaLabel="Confirm new password"
        labelText={`${t("verify.password.form.confirmPassword")}:`}
        htmlFor="confirm-new-password"
        name="password2"
        id="confirm-new-password"
        register={register}
        autoComplete="new-password-confirmation"
        testId="new-password-input-confirm"
      />
      <FormError
        ariaLabel="Confirm new password error"
        message={errors.password2?.message as string}
      />
      {issues &&
        issues.map((issue) => (
          <FormError
            ariaLabel={`password-change-error-${issue.type}`}
            key={issue.message}
            message={issue.message as string}
          />
        ))}
      <Submit
        ariaLabel="Submit new password creation"
        color="bg-slate-800 hover:bg-slate-300 hover:text-black"
        disabled={isPending || Boolean(formMessages.success)}
        testId="new-password-submit"
      >
        {t("verify.email.submit")}
      </Submit>
      <FormError
        ariaLabel="Form error (password creation)"
        message={formMessages.error}
        testId="new-password-error"
      />
      <FormSuccess
        ariaLabel="Form success (password creation)"
        message={formMessages.success}
        testId="new-password-success"
      />
      {Boolean(formMessages.success) && (
        <Link
          className="text-xs text-green-500 hover:text-green-300"
          href="/auth/sign-in"
        >
          {t("verify.password.form.signIn")}
        </Link>
      )}
    </form>
  );
}
