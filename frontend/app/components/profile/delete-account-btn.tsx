"use client";

import useDeleteProfile from "@/app/lib/hooks/profile/useDeleteProfile";
import useUser from "@/app/lib/hooks/ui/useUser";
import CustomButton from "@/app/ui/button-custom";
import FormTitle from "@/app/ui/form-title";
import Submit from "@/app/ui/submit";
import { LocaleProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import Modal from "../layout/modal";

export default function DeleteAccountBtn({}: LocaleProps) {
  const [isOpen, setForm] = useState(false);
  const t = useTranslations();
  const user = useUser();
  const public_id = user?.public_id;

  const { handleSubmit, formMessages, isPending } = useDeleteProfile(public_id);

  return (
    <section className="col-span-2 row-start-3 flex h-fit w-full flex-col items-center rounded-xl border border-slate-700 bg-slate-400 p-4 dark:border-slate-600 dark:bg-slate-800">
      <div className="flex w-full flex-col items-center gap-4">
        <h1 className="text-md">{t("profile.userCard.deleteAccountTitle")}</h1>
        <CustomButton
          onClick={() => setForm(true)}
          color="bg-red-500 dark:bg-red-600 text-slate-100 hover:bg-red-400 dark:hover:bg-red-500 disabled:bg-slate-400 disabled:text-slate-100 disabled:cursor-not-allowed"
        >
          {user?.is_oauth_user
            ? t("profile.userCard.deleteOauth2Account")
            : t("profile.userCard.deleteAccount")}
        </CustomButton>
      </div>
      {isOpen &&
        createPortal(
          <Modal closeCallback={() => setForm(false)}>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col items-center gap-4 border-t border-slate-800 p-4 dark:border-slate-600"
            >
              <FormTitle textSize="md">
                {t("profile.userCard.deleteAccountQuestion")}
              </FormTitle>
              <p className="max-w-48 text-sm">
                {user?.is_oauth_user
                  ? t("profile.userCard.deleteOauth2Note")
                  : t("profile.userCard.deleteAccountNote")}
              </p>
              <Submit
                ariaLabel="Delete account"
                color="bg-red-500 dark:bg-red-600 text-slate-100 hover:bg-red-400 dark:hover:bg-red-500"
                disabled={isPending}
              >
                {user?.is_oauth_user
                  ? t("profile.userCard.deleteOauth2Account")
                  : t("profile.userCard.deleteAccount")}
              </Submit>
            </form>
          </Modal>,
          document.body,
        )}
    </section>
  );
}
