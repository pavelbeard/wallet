import {
  ResetPasswordRequestSchema,
  ResetPasswordRequestValidator,
} from "@/app/lib/schemas.z";
import { useEffect, useState, useTransition } from "react";
import { UseFormClearErrors, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import requestResetPassword from "../../queries/requestResetPassword";

export default function useResetPasswordRequest(
  watch: UseFormWatch<ResetPasswordRequestValidator>,
  clearErrors: UseFormClearErrors<ResetPasswordRequestValidator>,
) {
  const [isPending, startTransition] = useTransition();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });

  useEffect(() => {
    if (watch("email")) {
      clearErrors("email");
    }
  }, [clearErrors, watch]);

  const onSubmit = (data: z.infer<typeof ResetPasswordRequestSchema>) => {
    startTransition(async () => {
      const { success, error } = await requestResetPassword(data);

      setFormMessages({
        success: success ?? null,
        error: error ?? null,
      });
    });
  };

  return {
    isPending,
    formMessages,
    onSubmit,
  };
}
