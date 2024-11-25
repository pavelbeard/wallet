"use client";

import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { ChangeEmailSchema, ChangeEmailValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import EmailInput from "@/app/ui/input-email";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "../form/form-error";
import FormSuccess from "../form/form-success";
import Modal, { FullscreenModal } from "../layout/modal";

type Props = { closeForm: () => void };

const changeEmailResolver = zodResolver(ChangeEmailSchema);

function FormComponent() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeEmailValidator>({
    resolver: changeEmailResolver,
    defaultValues: {
      email: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const [formMessages, setFormMessages] = useState({
    success: "",
    error: "",
  });

  const onSubmit: SubmitHandler<ChangeEmailValidator> = async (data) => {
    startTransition(() => {
      console.log(data);
      // TODO: change email
    });
  };
  return (
    <form
      className="p-4 lg:px-16 lg:pb-20  flex flex-col gap-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormTitle textSize="xl">{t("profile.userCard.modal.title")}</FormTitle>
      <EmailInput
        labelText={`${t("profile.userCard.modal.form.emailField")}:`}
        placeholder={t("profile.userCard.modal.form.emailPlaceholder")}
        htmlFor="email"
        name="email"
        register={register}
        id="email"
        autoComplete="email"
      />
      {errors.email?.message && (
        <p className="field-error">{errors.email.message}</p>
      )}
      <FormError message={formMessages.error} />
      <FormSuccess message={formMessages.success} />
      <Submit
        disabled={isPending}
        color="bg-slate-800 hover:bg-slate-300 hover:text-black"
      >
        {t("profile.useCard.modal.form.submit")}
      </Submit>
    </form>
  );
}

export default function ChangeEmailForm({ closeForm }: Props) {
  const isTabletBreakpoint = useTabletBreakpoint();

  if (isTabletBreakpoint) {
    return (
      <Modal closeCallback={closeForm}>
        <FormComponent />
      </Modal>
    );
  }
  return (
    <FullscreenModal closeCallback={closeForm}>
      <FormComponent />
    </FullscreenModal>
  );
}
