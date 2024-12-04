"use client";

import protectedQuery from "@/app/lib/helpers/protectedQuery";
import useUser from "@/app/lib/hooks/useUser";
import CustomButton from "@/app/ui/button-custom";
import FormTitle from "@/app/ui/form-title";
import Submit from "@/app/ui/submit";
import { LocaleProps } from "@/i18n/types";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormEvent, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Modal from "../layout/modal";

export default function DeleteAccountBtn({ params: { locale } }: LocaleProps) {
  const [isOpen, setForm] = useState(false);
  const t = useTranslations();
  const user = useUser();
  const public_id = user?.public_id;
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await protectedQuery({
        url: `/users/${public_id}/`,
        method: "DELETE",
      });

      if (result instanceof Error) {
        setFormMessages({
          success: null,
          error: t("error.somethingWentWrong"),
        });
        return;
      }

      if (!result?.ok) {
        setFormMessages({
          success: null,
          error: t("profile.userCard.deleteRequest.error"),
        });
        return;
      }

      if (result?.ok) {
        await signOut();
        return;
      }
    });
  };

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
              <p className="text-sm max-w-48">
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
