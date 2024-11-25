import Modal, { FullscreenModal } from "@/app/components/layout/modal";
import useTabletBreakpoint from "@/app/lib/hooks/useTabletBreakpoint";
import { TwoFactorSchema, TwoFactorValidator } from "@/app/lib/schemas.z";
import FormDivider from "@/app/ui/form-divider";
import FormTitle from "@/app/ui/form-title";
import CustomInput from "@/app/ui/input-custom";
import { ScissorsIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const [copied, setCopied] = useState("");
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

  const [isPending, startTransition] = useTransition();
  const code = config_key?.split(/secret=(.*)&algorithm/)[1];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(t("profile.twofactor.copied"));
  };

  const onSubmit: SubmitHandler<TwoFactorValidator> = async (data) => {
    startTransition(() => {
      console.log(data);
      // TODO: add 2fa verification
    });
  };

  useEffect(() => {
    return () => {
      setCopied("");
    };
  }, []);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 lg:px-16 lg:py-6 flex flex-col items-center gap-y-4"
    >
      <FormTitle textSize="xl">{t("profile.twofactor.title")}</FormTitle>
      {detail ? (
        <p className="text-sm pl-2 text-red-500">{detail}</p>
      ) : (
        <>
          <QRCodeSVG value={config_key} className="max-lg:size-2/3 w-full" />
          <FormDivider placeholder={t("profile.twofactor.or")} />
          <div className="flex flex-col gap-y-2 items-center">
            <p className="text-sm font-bold">{code}</p>
            <button
              type="button"
              className="flex items-center gap-x-2 text-sm"
              onClick={copyToClipboard}
            >
              <ScissorsIcon className="size-6" />
              {t("profile.twofactor.copy")}
            </button>
          </div>
          <p className="px-2 text-sm text-center w-60 text-green-500">
            {copied}
          </p>
          <CustomInput
            labelText={`${t("profile.twofactor.input")}:`}
            placeholder={t("profile.twofactor.inputPlaceholder")}
            htmlFor="token"
            name="token"
            register={register}
            id="token"
            disabled={isPending}
          />
          <p className="px-2 text-xs w-60">{t("profile.twofactor.note")}</p>
        </>
      )}
    </form>
  );
}

export default function TwoFactorForm({
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
