"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import RequestEmailVerificationForm from "./request-email-verification-form";

export default function RequestEmailVerificationBtn({ disabled }: { disabled: boolean }) {
  const [isOpen, setForm] = useState(false);
  const t = useTranslations();

  return (
    <div
      className="flex items-center"
      data-testid="change-email-btn"
      aria-label="change email"
    >
      <button disabled={disabled} onClick={() => setForm(true)}>
        {t("profile.userCard.changeEmail")}
      </button>
      {isOpen &&
        createPortal(
          <RequestEmailVerificationForm closeForm={() => setForm(false)} />,
          document.body,
        )}
    </div>
  );
}
