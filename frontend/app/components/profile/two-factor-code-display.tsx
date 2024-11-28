import { ScissorsIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";

type TwoFactorCodeDisplayProps = {
  config_key: string;
  copiedMessage: string | null;
  setCopied: (state: string | null) => void;
};

export default function TwoFactorCodeDisplay({
  config_key,
  copiedMessage,
  setCopied,
}: TwoFactorCodeDisplayProps) {
  const t = useTranslations();
  const code = config_key?.split(/secret=(.*)&algorithm/)[1];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(t("profile.twofactor.copied"));
  };

  return (
    <div className="flex w-full items-center md:items-start justify-between max-md:flex-col gap-4">
      <QRCodeSVG value={config_key} className="max-lg:size-2/3 size-[128px]" />
      <div className="flex flex-col gap-y-2 items-start [&_p]:max-md:text-center [&_p]:max-md:text-xs [&_p]:text-sm [&_p]:w-72">
        <p>{t("profile.twofactor.attention")}</p>
        <p className="font-bold">{code}</p>
        <button
          type="button"
          className="flex items-center gap-x-2 text-sm"
          onClick={copyToClipboard}
        >
          <ScissorsIcon className="size-6" />
          {t("profile.twofactor.copy")}
        </button>
        {copiedMessage && <p className="text-green-500">{copiedMessage}</p>}
      </div>
    </div>
  );
}
