"use client";

import logger from "@/app/lib/helpers/logger";
import { ScissorsIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

type TwoFactorCodeDisplayProps = {
  config_key: string;
};

export default function TwoFactorCodeDisplay({
  config_key,
}: TwoFactorCodeDisplayProps) {
  const t = useTranslations();
  const code = config_key?.split(/secret=(.*)&algorithm/)[1];

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (copied) {
        setCopied(null);
      }
    };
  }, []);

  const copyToClipboard = async () => {
    logger("copied", code);
    await navigator.clipboard.writeText(code);
    setCopied(t("profile.twofactor.copied"));
  };

  return (
    <div className="flex w-full items-center justify-between gap-4 max-md:flex-col md:items-start">
      <QRCodeSVG value={config_key} className="size-[128px] max-lg:size-2/3" />
      <div className="flex flex-col items-start gap-y-2 [&_p]:w-72 [&_p]:text-sm [&_p]:max-md:text-center [&_p]:max-md:text-xs">
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
        {copied && <p className="text-green-500">{copied}</p>}
      </div>
    </div>
  );
}
