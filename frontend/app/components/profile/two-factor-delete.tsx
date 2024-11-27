"use client";

import useUser from "@/app/lib/hooks/useUser";
import Button from "@/app/ui/button-custom";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import TwoFactorIcon from "../icons/two-factor-icon";
import TwoFactorDeleteForm from "./two-factor-delete-form";

export default function TwoFactorDelete() {
  const t = useTranslations();
  const user = useUser();
  const [isOpen, setForm] = useState(false);
  return (
    <>
      <TwoFactorIcon className="size-[64px]" />
      <div className="w-full">
        <p className="font-bold">{t("profile.twofactor.appTitle")}</p>
        <p className="text-xs">
          {t("profile.twofactor.added")} {user?.created_at}
        </p>
      </div>
      <Button onClick={() => setForm(true)}>
        {t("profile.twofactor.delete2fa")}
      </Button>
      {isOpen &&
        createPortal(
          <TwoFactorDeleteForm closeForm={() => setForm(false)} />,
          document.body,
        )}
    </>
  );
}
