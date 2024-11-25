"use client";

import clsx from "clsx";
import { User } from "next-auth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import ChangeEmailForm from "./change-email-form";

type Props = { user: User };

export default function ChangeEmailBtn({ user }: Props) {
  const [isOpen, setForm] = useState(false);
  const t = useTranslations();

  return (
    <>
      <br />
      <button
        onClick={() => setForm(true)}
        className={clsx(
          "text-sm font-light hover:text-gray-100 cursor-pointer text-start lg:justify-self-end",
          "dark:hover:text-slate-600",
        )}
      >
        {t("profile.userCard.changeEmail")}
      </button>
      {isOpen &&
        createPortal(
          <ChangeEmailForm closeForm={() => setForm(false)} />,
          document.body,
        )}
    </>
  );
}
