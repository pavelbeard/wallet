import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import Messages from "@/app/ui/messages";
import useTwoFactorAuthDelete from "@/app/lib/hooks/profile/useTwoFactorAuthDelete";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { PasswordSchema, PasswordValidator } from "@/app/lib/schemas.z";
import FormTitle from "@/app/ui/form-title";
import PasswordInput from "@/app/ui/input-password";
import Submit from "@/app/ui/submit";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

type FormComponentProps = { closeForm: () => void };

const verify2faResolver = zodResolver(PasswordSchema);

function FormComponent() {
  const t = useTranslations();
  const {
    delete2faState,
    deleteTwoFactorAuth: onSubmit,
    isPending,
  } = useTwoFactorAuthDelete();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValidator>({
    resolver: verify2faResolver,
    defaultValues: {
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "p-8 flex flex-col items-center gap-y-4",
        "text-slate-800 dark:text-slate-300",
        "border-t border-slate-800 dark:border-slate-600",
        "[&>label>span]:text-sm",
        "[&>label>div>input]:p-2 [&>label>div>div]:pr-2",
        "[&>label>div>input]:text-sm",
        "[&>button]:p-2 [&>button]:text-sm",
      )}
    >
      <div className="flex w-full justify-center md:justify-start">
        <FormTitle textSize="md">{t("profile.twofactor.delete2fa")}</FormTitle>
      </div>
      <p className="max-md:text-center text-sm md:w-80">
        {t("profile.twofactor.delete2faNote")}
      </p>
      <p className="text-sm md:w-80">
        {t("profile.twofactor.delete2faNote2")}
      </p>

      <PasswordInput
        ariaLabel="2FA delete password"
        placeholder={t("profile.twofactor.inputPlaceholder")}
        htmlFor="password"
        name="password"
        register={register}
        id="password"
        disabled={isPending}
      />

      <Submit
        ariaLabel="Submit 2FA delete"
        disabled={isPending}
        color="bg-red-500 dark:bg-red-500 hover:bg-red-400 dark:hover:bg-red-700"
      >
        {t("profile.twofactor.submitDelete2fa")}
      </Submit>

      <Messages
        errorMessage={errors?.password?.message || delete2faState.error}
        successMessage={delete2faState.success}
      />
    </form>
  );
}

export default function TwoFactorForm({ closeForm }: FormComponentProps) {
  const isTabletBreakpoint = useTabletBreakpoint();

  if (isTabletBreakpoint)
    return (
      <Modal closeCallback={closeForm}>
        <FormComponent />
      </Modal>
    );

  return (
    <FullscreenModal closeCallback={closeForm}>
      <FormComponent />
    </FullscreenModal>
  );
}
