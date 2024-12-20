"use client";

import FormError from "@/app/components/form/form-error";
import FormSuccess from "@/app/components/form/form-success";
import useMasterPassword from "@/app/lib/hooks/auth/useMasterPassword";
import { MasterPasswordSchema } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import Messages from "@/app/ui/messages";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

const masterPasswordResolver = zodResolver(MasterPasswordSchema);

export default function MasterPasswordForm() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: masterPasswordResolver,
    defaultValues: {
      masterPassword: "",
    },
  });

  const { formMessages, onSubmit, isPending } = useMasterPassword();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <FormTitle textSize="md">
        {t("auth.masterPassword.send.formTitle")}
      </FormTitle>
      <CustomInput
        ariaLabel="Master password"
        labelText={`${t("auth.masterPassword.send.inputLabel")}:`}
        htmlFor="credentials-masterPassword"
        name="masterPassword"
        id="credentials-masterPassword"
        type="password"
        autoComplete="masterPassword"
        register={register}
      />
      <Messages errorMessage={errors.masterPassword?.message as string} />
      <Submit color="bg-slate-800" disabled={isPending} ariaLabel="Generate master password">
        {t("auth.masterPassword.send.submit")}
      </Submit>
      <FormSuccess ariaLabel="Form success" message={formMessages.success} />
      <FormError ariaLabel="Form error" message={formMessages.error} />
    </form>
  );
}
