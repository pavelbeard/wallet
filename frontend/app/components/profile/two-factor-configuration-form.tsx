import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import useTotpData from "@/app/lib/hooks/profile/useTotpData";
import useTwoFactorAuth from "@/app/lib/hooks/profile/useTwoFactorAuth";
import useDebounce from "@/app/lib/hooks/useDebounce";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import Button from "@/app/ui/button-custom";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Messages from "../../ui/messages";
import TwoFactorCodeDisplay from "./two-factor-code-display";

type Props = { closeForm: () => void };

const twoFactorResolver = zodResolver(TwoFactorSchema);

function FormComponent({
  config_key,
  detail,
}: {
  config_key: string | undefined;
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
    <form
      className={clsx(
        "p-8 flex flex-col items-center gap-y-4",
        "border-t dark:border-slate-600 dark:text-slate-300",
        "[&>label>span]:text-sm",
        "[&>label>input]:p-2",
        "[&>label>input]:text-sm",
        "[&>button]:p-2 [&>button]:text-sm",
      )}
    >
      <div className="flex w-full justify-center md:justify-start">
        <FormTitle textSize="md">{t("profile.twofactor.title")}</FormTitle>
      </div>

      {detail ? (
        <p className="text-sm text-red-500">{detail}</p>
      ) : (
        config_key && (
          <>
            {next ? (
              <>
                <CustomInput
                  labelText={`${t("profile.twofactor.input")}:`}
                  htmlFor="token"
                  name="token"
                  register={register}
                  id="token"
                  disabled={isPending}
                />
                <p className="text-xs">{t("profile.twofactor.note")}</p>
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
        )
      )}
    </form>
  );
}

export default function TwoFactorConfigurationForm({ closeForm }: Props) {
  const isTabletBreakpoint = useTabletBreakpoint();
  const { data } = useTotpData();

  if (isTabletBreakpoint)
    return (
      <Modal closeCallback={closeForm}>
        <FormComponent config_key={data?.config_key} detail={data?.detail} />
      </Modal>
    );

  return (
    <FullscreenModal closeCallback={closeForm}>
      <FormComponent config_key={data?.config_key} detail={data?.detail} />
    </FullscreenModal>
  );
}
