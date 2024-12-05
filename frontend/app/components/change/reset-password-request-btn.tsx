import useResetPasswordRequest from "@/app/lib/hooks/reset-password/useResetPasswordRequest";
import { ResetPasswordRequestSchema } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import EmailInput from "@/app/ui/input-email";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import FormError from "../form/form-error";
import FormSuccess from "../form/form-success";
import Modal from "../layout/modal";

const resetPasswordRequestResolver = zodResolver(ResetPasswordRequestSchema);

export default function ResetPasswordRequestBtn() {
  const t = useTranslations();
  const [isOpen, setForm] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch
  } = useForm({
    resolver: resetPasswordRequestResolver,
    defaultValues: {
      email: "",
    },
  });

  const { isPending, formMessages, onSubmit } = useResetPasswordRequest(watch, clearErrors);

  return (
    <div className="flex items-center justify-end text-xs text-slate-600 dark:text-slate-400">
      <button
        className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-500"
        onClick={() => setForm(true)}
      >
        {t("auth.form.resetPassword")}
      </button>
      {isOpen &&
        createPortal(
          <Modal closeCallback={() => setForm(false)}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-2 border-t border-slate-800 p-4 dark:border-slate-600"
            >
              <FormTitle textSize="md">
                {t("auth.form.resetPassword")}
              </FormTitle>
              <EmailInput
                labelText={t("auth.form.email")}
                htmlFor="send-email"
                name="email"
                register={register}
                id="send-email"
                ariaLabel="Email input for reset password"
                testId="reset-password-email"
                autocomplete="email"
              />
              <FormError
                message={errors?.email?.message as string}
                ariaLabel="Email input for reset password"
              />
              <Submit
                ariaLabel="Send password reset request"
                type="submit"
                testId="reset-password-submit"
                disabled={isPending}
              >
                {t("auth.form.sendEmail")}
              </Submit>
              <FormError
                message={formMessages?.error}
                ariaLabel="Form error message (reset password request)"
              />
              <FormSuccess
                message={formMessages?.success}
                ariaLabel="Form success message (reset password request)"
              />
            </form>
          </Modal>,
          document.body,
        )}
    </div>
  );
}
