import FormError from "@/app/components/form/form-error";
import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import useChangePassword from "@/app/lib/hooks/profile/useChangePassword";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import {
  ChangePasswordSchema,
  ChangePasswordValidator,
} from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import PasswordInput from "@/app/ui/input-password";
import Messages from "@/app/ui/messages";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

type ChangePasswordFormProps = { closeForm: () => void };

const changePasswordResolver = zodResolver(ChangePasswordSchema);

function FormComponent() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordValidator>({
    resolver: changePasswordResolver,
    defaultValues: {
      actualPassword: "",
      password: "",
      password2: "",
    },
  });
  const { onSubmit, isPending, formMessages } = useChangePassword(reset);
  const issues = Array.isArray(Object.values(errors)) && Object.values(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "p-8 flex flex-col gap-y-4",
        "border-t border-slate-800 dark:border-slate-600",
        "[&>label>span]:text-sm",
        "[&>label>div>input]:p-2 [&>label>div>div]:pr-2",
        "[&>label>div>input]:text-sm",
        "[&>button]:p-2 [&>button]:text-sm",
      )}
    >
      <FormTitle textSize="md">
        {t("profile.userCard.modal.changePassword.title")}
      </FormTitle>
      <PasswordInput
        labelText={`${t("profile.userCard.modal.changePassword.form.actualPassword")}:`}
        htmlFor="actualPassword"
        name="actualPassword"
        register={register}
        id="actualPassword"
        disabled={isPending}
      />
      <PasswordInput
        labelText={`${t("profile.userCard.modal.changePassword.form.newPassword")}:`}
        htmlFor="password"
        name="password"
        register={register}
        id="password"
        disabled={isPending}
      />
      <p className="p-2 rounded-xl border border-yellow-500 bg-yellow-200 text-sm dark:text-slate-800">
        {t("profile.userCard.modal.changePassword.form.passwordNote")}
      </p>
      <PasswordInput
        labelText={`${t("profile.userCard.modal.changePassword.form.confirmPassword")}:`}
        htmlFor="password2"
        name="password2"
        register={register}
        id="password2"
        disabled={isPending}
      />
      <Messages errorMessage={formMessages.error} />
      <Messages successMessage={formMessages.success} />
      {issues && (
        <div className="flex flex-col gap-y-2">
          {issues.map((issue) => (
            <FormError key={issue.message} message={issue.message as string} />
          ))}
        </div>
      )}
      <Submit
        disabled={isPending}
        color="bg-slate-800 hover:bg-slate-300 hover:text-black dark:text-slate-800 dark:bg-gray-100"
      >
        {t("profile.userCard.modal.changePassword.form.submit")}
      </Submit>
    </form>
  );
}

export default function ChangePasswordForm({
  closeForm,
}: ChangePasswordFormProps) {
  const isTabletBreakpoint = useTabletBreakpoint();

  if (isTabletBreakpoint) {
    return (
      <Modal closeCallback={closeForm}>
        <FormComponent />
      </Modal>
    );
  } else {
    return (
      <FullscreenModal closeCallback={closeForm}>
        <FormComponent />
      </FullscreenModal>
    );
  }
}
