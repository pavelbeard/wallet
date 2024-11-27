"use client";

import { TOTPData } from "@/app/lib/types";
import Button from "@/app/ui/button-custom";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import TwoFactorIcon from "../icons/two-factor-icon";
import TwoFactorConfigurationForm from "./two-factor-configuration-form";

/**
 * Component for displaying 2fa configuration key
 * @param config_key - totp configuration key
 * @param detail - error message
 */
export default function TwoFactorConfiguration({
  config_key,
  detail,
}: TOTPData) {
  const t = useTranslations();
  const [isOpen, setForm] = useState(false);

  return (
    <>
      <TwoFactorIcon className="size-[64px]" />
      <div className="w-full">
        <p className="font-bold">{t("profile.twofactor.appTitle")}</p>
        <p className="text-sm">{t("profile.twofactor.title")}</p>
      </div>
      <Button onClick={() => setForm(true)}>
        {t("profile.twofactor.configure")}
      </Button>
      {isOpen &&
        createPortal(
          <TwoFactorConfigurationForm
            config_key={config_key}
            detail={detail}
            closeForm={() => setForm(false)}
          />,
          document.body,
        )}
    </>
  );
}
