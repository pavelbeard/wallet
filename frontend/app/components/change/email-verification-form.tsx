"use client";

import useEmailVerify from "@/app/lib/hooks/verify-email/useEmailVerify";
import FormTitle from "@/app/ui/form-title";
import Submit from "@/app/ui/submit";
import { LocaleProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import FormError from "../form/form-error";
import FormSuccess from "../form/form-success";

type EmailVerificationFormProps = { token: string } & LocaleProps;

export default function EmailVerificationForm({
  token,
  params: { locale },
}: EmailVerificationFormProps) {
  const t = useTranslations();
  const { handleSubmit, formMessages } = useEmailVerify(token);
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormTitle textSize="md">{t("verify.email.formTitle")}</FormTitle>
      <Submit
        ariaLabel="Submit email verification"
        color="bg-slate-800 hover:bg-slate-300 hover:text-black"
      >
        {t("verify.email.submit")}
      </Submit>
      <FormError
        ariaLabel="Form error (email verification)"
        message={formMessages.error}
      />
      <FormSuccess
        ariaLabel="Form error (email verification)"
        message={formMessages.success}
      />
    </form>
  );
}
