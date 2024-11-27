"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import ChangeEmailForm from "./change-email-form";

export default function ChangeEmailBtn() {
  const [isOpen, setForm] = useState(false);
  const t = useTranslations();

  return (
    <div className="flex items-center" data-testid="change-email-btn" aria-label="change email">
      <button onClick={() => setForm(true)}>
        {t("profile.userCard.changeEmail")}
      </button>
      {isOpen &&
        createPortal(
          <ChangeEmailForm closeForm={() => setForm(false)} />,
          document.body,
        )}
    </div>
  );
}
