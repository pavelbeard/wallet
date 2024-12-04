"use client";

import useVerify from "@/app/lib/hooks/auth/useVerify";
import useUser from "@/app/lib/hooks/useUser";
import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import Messages from "../../ui/messages";
import FormError from "../form/form-error";

const twoFactorResolver = zodResolver(TwoFactorSchema);

export default function VerifyTwoFactorForm() {
  const t = useTranslations();
  const user = useUser();
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
  const { onSubmit, isPending, formMessages } = useVerify();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormTitle textSize="md">{t("auth.form.verify2fa")}</FormTitle>
      <p className="text-sm">
        {t("auth.form.2faForUser")}: {user?.username}
      </p>
      <CustomInput
        ariaLabel="2FA token"
        labelText={`${t("auth.form.2faInput")}:`}
        htmlFor="token"
        name="token"
        id="token"
        register={register}
        disabled={isPending}
      />
      <Messages errorMessage={errors?.token?.message} />
      <FormError
        ariaLabel="Form error (2FA token)"
        message={formMessages.error}
      />
      <Submit
        ariaLabel="2FA submit"
        color="bg-slate-800 hover:bg-slate-300 hover:text-black"
      >
        {t("auth.form.2faSubmit")}
      </Submit>
    </form>
  );
}
