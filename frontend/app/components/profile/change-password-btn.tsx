"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import ChangePasswordForm from "./change-password-form";

export default function ChangePasswordBtn({ disabled }: { disabled: boolean }) {
  const [isOpen, setForm] = useState(false);
  const t = useTranslations();
  return (
    <div
      className="flex items-center"
      data-testid="change-password-btn"
      aria-label="change password"
    >
      <button disabled={disabled} onClick={() => setForm(true)}>
        {t("profile.userCard.changePassword")}
      </button>
      {isOpen &&
        createPortal(
          <ChangePasswordForm closeForm={() => setForm(false)} />,
          document.body,
        )}
    </div>
  );
}
