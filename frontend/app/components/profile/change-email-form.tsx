"use client";

import FormError from "@/app/components/form/form-error";
import FormSuccess from "@/app/components/form/form-success";
import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import useChangeEmail from "@/app/lib/hooks/profile/useChangeEmail";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { ChangeEmailSchema, ChangeEmailValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import EmailInput from "@/app/ui/input-email";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

type ChangeEmailFormProps = { closeForm: () => void };

const changeEmailResolver = zodResolver(ChangeEmailSchema);

function FormComponent() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangeEmailValidator>({
    resolver: changeEmailResolver,
    defaultValues: {
      email: "",
    },
  });
  const { onSubmit, isPending, formMessages } = useChangeEmail(watch, reset);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "p-8 flex flex-col gap-y-4",
        "border-t border-slate-800 dark:border-slate-600",
        "[&>label>span]:text-sm",
        "[&>label>input]:p-2 [&>label>input]:text-sm",
        "[&>button]:p-2 [&>button]:text-sm",
      )}
    >
      <FormTitle textSize="md">{t("profile.userCard.modal.title")}</FormTitle>
      <EmailInput
        labelText={`${t("profile.userCard.modal.form.emailField")}:`}
        placeholder={t("profile.userCard.modal.form.emailPlaceholder")}
        htmlFor="email"
        name="email"
        register={register}
        id="email"
        autoComplete="email"
      />
      <FormError message={errors.email?.message as string} />
      <FormError message={formMessages.error} />
      {formMessages.pending && (
        <p className="field-pending">{formMessages.pending}</p>
      )}
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

export default function ChangeEmailForm({ closeForm }: ChangeEmailFormProps) {
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
