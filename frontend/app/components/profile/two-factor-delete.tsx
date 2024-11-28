"use client";

import useUser from "@/app/lib/hooks/useUser";
import Button from "@/app/ui/button-custom";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TwoFactorIcon from "../icons/two-factor-icon";
import TwoFactorConfigurationForm from "./two-factor-configuration-form";
import TwoFactorDeleteForm from "./two-factor-delete-form";

export default function TwoFactorDelete() {
  const t = useTranslations();
  const user = useUser();
  const [formState, setFormState] = useState({
    isOpenChange: false,
    isOpenDelete: false,
  });

  useEffect(() => {
    if (formState.isOpenChange) {
      
    }
  }, [formState]);

  return (
    <>
      <TwoFactorIcon className="size-[48px]" />
      <div className="w-full">
        <p className="font-bold text-sm">{t("profile.twofactor.appTitle")}</p>
        <p className="text-xs">
          {t("profile.twofactor.added")} {user?.created_at}
        </p>
      </div>
      <Button
        color="bg-red-500 dark:bg-red-500 hover:bg-red-400 dark:hover:bg-red-700"
        onClick={() =>
          setFormState((prev) => ({ ...prev, isOpenChange: true }))
        }
      >
        {t("profile.twofactor.change2fa")}
      </Button>
      <Button
        onClick={() =>
          setFormState((prev) => ({ ...prev, isOpenDelete: true }))
        }
      >
        {t("profile.twofactor.delete2fa")}
      </Button>
      {formState.isOpenDelete &&
        createPortal(
          <TwoFactorDeleteForm
            closeForm={() =>
              setFormState({ ...formState, isOpenDelete: false })
            }
          />,
          document.body,
        )}
      {formState.isOpenChange &&
        createPortal(
          <TwoFactorConfigurationForm
            closeForm={() =>
              setFormState({ ...formState, isOpenChange: false })
            }
          />,
          document.body,
        )}
    </>
  );
}
