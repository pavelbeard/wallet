"use client";

import logger from "@/app/lib/helpers/logger";
import changePassword from "@/app/lib/profile/changePassword";
import { ChangePasswordValidator } from "@/app/lib/schemas.z";
import { useState, useTransition } from "react";
import { SubmitHandler, UseFormReset } from "react-hook-form";

export default function useChangePassword(
  reset: UseFormReset<ChangePasswordValidator>,
) {
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<ChangePasswordValidator> = (data) => {
    startTransition(async () => {
      logger(data);
      const { success, error } = await changePassword(data);

      setFormMessages({
        success: success ?? null,
        error: error ?? null,
      });

      if (success) {
        reset();
      }
    });
  };

  return {
    onSubmit,
    isPending,
    formMessages,
  };
}
