"use client";

import FormError from "@/app/components/form/form-error";
import FormSuccess from "@/app/components/form/form-success";
import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import useCreateEmailVerificationRequest from "@/app/lib/hooks/profile/useCreateEmailVerificationRequest";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { RequestEmailSchema, RequestEmailValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import EmailInput from "@/app/ui/input-email";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

type RequestEmailFormProps = { closeForm: () => void };

const requestEmailResolver = zodResolver(RequestEmailSchema);

function FormComponent() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RequestEmailValidator>({
    resolver: requestEmailResolver,
    defaultValues: {
      email: "",
    },
  });
  const { onSubmit, isPending, formMessages } =
    useCreateEmailVerificationRequest(watch, reset);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "flex flex-col gap-y-4 p-8",
        "border-t border-slate-800 dark:border-slate-600",
        "[&>label>span]:text-sm",
        "[&>label>input]:p-2 [&>label>input]:text-sm",
        "[&>button]:p-2 [&>button]:text-sm",
      )}
    >
      <FormTitle textSize="md">{t("profile.userCard.modal.title")}</FormTitle>
      <EmailInput
        ariaLabel="New email"
        labelText={`${t("profile.userCard.modal.form.emailField")}:`}
        placeholder={t("profile.userCard.modal.form.emailPlaceholder")}
        htmlFor="email"
        name="email"
        register={register}
        id="email"
        autoComplete="email"
      />
      <FormError
        ariaLabel="Error message (email)"
        message={errors.email?.message as string}
      />
      <FormError
        ariaLabel="Error message (form)"
        message={formMessages.error}
      />
      {formMessages.pending && (
        <p className="field-pending">{formMessages.pending}</p>
      )}
      <FormSuccess ariaLabel="Success message" message={formMessages.success} />
      <Submit
        ariaLabel="Submit button"
        disabled={isPending || Boolean(formMessages.success)}
        color="bg-slate-800 not(:disabled):hover:bg-slate-300 not(:disabled):hover:text-black disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {t("profile.useCard.modal.form.submit")}
      </Submit>
    </form>
  );
}

export default function RequestEmailVerificationForm({
  closeForm,
}: RequestEmailFormProps) {
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
