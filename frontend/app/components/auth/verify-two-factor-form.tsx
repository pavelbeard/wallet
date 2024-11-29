"use client";

import verify2fa from "@/app/lib/queries/verify2fa";
import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import Submit from "@/app/ui/submit";
import { useRouter } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Messages from "../../ui/messages";
import FormError from "../form/form-error";

const twoFactorResolver = zodResolver(TwoFactorSchema);

export default function VerifyTwoFactorForm({
  params: { locale },
}: LocaleProps) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorValidator>({
    resolver: twoFactorResolver,
    defaultValues: {
      token: "",
    },
  });
  const { update } = useSession();
  const router = useRouter();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<TwoFactorValidator> = (data) => {
    startTransition(async () => {
      const { error, success, userData } = await verify2fa(data);

      if (success) {
        update({ ...userData }).then(
          () => router.push(DEFAULT_SIGNED_IN_PATH),
        );
      }

      setFormMessages({
        ...formMessages,
        success: success || null,
        error: error || null,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormTitle>{t("auth.form.verify2fa")}</FormTitle>
      <CustomInput
        labelText={`${t("auth.form.2faInput")}:`}
        htmlFor="token"
        name="token"
        id="token"
        register={register}
        disabled={isPending}
      />
      <Messages errorMessage={errors?.token?.message} />
      <FormError message={formMessages.error} />
      <Submit color="bg-slate-800 hover:bg-slate-300 hover:text-black">
        {t("auth.form.2faSubmit")}
      </Submit>
    </form>
  );
}
