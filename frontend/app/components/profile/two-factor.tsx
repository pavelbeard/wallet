"use client";

import { TOTPData } from "@/app/lib/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import TwoFactorForm from "./two-factor-form";

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
    <div className="grid grid-cols-2 grid-rows-2">
      <button
        className={clsx(
          "bg-white hover:bg-slate-300  p-4 rounded-xl font-bold ",
          "dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-600",
          "dark:border dark:border-slate-600",
        )}
        onClick={() => setForm(true)}
      >
        {t("profile.twofactor.title")}
      </button>
      {isOpen &&
        createPortal(
          <TwoFactorForm
            config_key={config_key}
            detail={detail}
            closeForm={() => setForm(false)}
          />,
          document.body,
        )}
    </div>
  );
}
