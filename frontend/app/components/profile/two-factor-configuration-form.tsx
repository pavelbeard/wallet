import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import useTwoFactorAuth from "@/app/lib/hooks/profile/useTwoFactorAuth";
import useDebounce from "@/app/lib/hooks/useDebounce";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import Button from "@/app/ui/button-custom";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TwoFactorCodeDisplay from "./two-factor-code-display";
import Messages from "./two-factor-form-messages";

type Props = { config_key: string; detail?: string; closeForm: () => void };

const twoFactorResolver = zodResolver(TwoFactorSchema);

function FormComponent({
  config_key,
  detail,
}: {
  config_key: string;
  detail?: string;
}) {
  const t = useTranslations();
  const {
    copied,
    setCopied,
    verify2faState,
    handleSubmit2FA: onSubmit,
    resetCopied,
    isPending,
  } = useTwoFactorAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TwoFactorValidator>({
    resolver: twoFactorResolver,
    defaultValues: {
      token: "",
    },
  });

  const [next, setNext] = useState(false);

  useDebounce(
    () => {
      const token = watch("token");
      if (token?.length == 6) {
        handleSubmit(onSubmit)();
      }
    },
    300,
    [watch("token")],
  );

  useEffect(() => resetCopied, []);

  return (
    <form className="px-8 py-4 flex flex-col items-center gap-y-4 border-t dark:border-slate-600 dark:text-slate-300">
      <div className="flex w-full justify-center md:justify-start">
        <FormTitle textSize="md">{t("profile.twofactor.title")}</FormTitle>
      </div>

      {detail ? (
        <p className="max-md:text-xs text-sm text-red-500">{detail}</p>
      ) : (
        <>
          {next ? (
            <>
              <CustomInput
                labelText={`${t("profile.twofactor.input")}:`}
                placeholder={t("profile.twofactor.inputPlaceholder")}
                htmlFor="token"
                name="token"
                register={register}
                id="token"
                disabled={isPending}
              />
              <p className="px-2 text-xs">{t("profile.twofactor.note")}</p>
            </>
          ) : (
            <>
              <TwoFactorCodeDisplay
                config_key={config_key}
                copiedMessage={copied}
                setCopied={setCopied}
              />

              <Button onClick={() => setNext(true)}>
                {t("profile.twofactor.next")}
              </Button>
            </>
          )}

          <Messages
            errorMessage={errors?.token?.message || verify2faState.error}
            successMessage={verify2faState.success}
          />
        </>
      )}
    </form>
  );
}

export default function TwoFactorConfigurationForm({
  closeForm,
  config_key,
  detail,
}: Props) {
  const isTabletBreakpoint = useTabletBreakpoint();

  if (isTabletBreakpoint)
    return (
      <Modal closeCallback={closeForm}>
        <FormComponent config_key={config_key} detail={detail} />
      </Modal>
    );

  return (
    <FullscreenModal closeCallback={closeForm}>
      <FormComponent config_key={config_key} detail={detail} />
    </FullscreenModal>
  );
}
