"use client";

import protectedQuery from "@/app/lib/helpers/protectedQuery";
import FormTitle from "@/app/ui/form-title";
import Submit from "@/app/ui/submit";
import { useRouter } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FormError from "../form/form-error";
import FormSuccess from "../form/form-success";

type EmailVerificationFormProps = { token: string } & LocaleProps;

export default function EmailVerificationForm({
  params: { locale },
  token,
}: EmailVerificationFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { data: session, update } = useSession();
  const [formMessages, setFormMessages] = useState({
    error: null as string | null,
    success: null as string | null,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await protectedQuery({
      url: "/users/verify_email_change/",
      method: "POST",
      body: {
        token,
      },
    });

    if (result instanceof Error) {
      setFormMessages({
        error: t("error.somethingWentWrong"),
        success: null,
      });
      return;
    }

    if (!result?.ok) {
      setFormMessages({
        error: t("verify.email.emailError"),
        success: null,
      });
      return;
    }

    if (result?.ok) {
      const json = await result.json();
      const newEmail = json.email;

      update({ ...session, user: { ...session?.user, email: newEmail } }).then(
        () =>
          router.push({
            pathname: "/profile",
          }),
      );
    }
  };

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
