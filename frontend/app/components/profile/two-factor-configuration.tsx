"use client";

import Button from "@/app/ui/button-custom";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import TwoFactorIcon from "../icons/two-factor-icon";
import TwoFactorConfigurationForm from "./two-factor-configuration-form";

/**
 * Component for displaying 2fa configuration key
 */
export default function TwoFactorConfiguration() {
  const t = useTranslations();
  const [isOpen, setForm] = useState(false);

  return (
    <>
      <TwoFactorIcon className="size-[48px]" />
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
            closeForm={() => setForm(false)}
          />,
          document.body,
        )}
    </>
  );
}
