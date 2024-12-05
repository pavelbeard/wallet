import { useEffect, useState, useTransition } from "react";
import { UseFormClearErrors, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import createNewPassword from "../../queries/createNewPassword";
import { NewPasswordSchema, NewPasswordValidator } from "../../schemas.z";

export default function useResetPassword(
  token: string,
  watch: UseFormWatch<NewPasswordValidator>,
  clearErrors: UseFormClearErrors<NewPasswordValidator>,
) {
  const [isPending, startTransition] = useTransition();
  const [formMessages, setFormMessages] = useState({
    error: null as string | null,
    success: null as string | null,
  });

  useEffect(() => {
    if (watch("password")) {
      clearErrors("password");
    }
  }, [watch, clearErrors]);

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    startTransition(async () => {
      const { error, success } = await createNewPassword(data, token);

      setFormMessages({
        success: success ?? null,
        error: error ?? null,
      });
    });
  };

  return {
    onSubmit,
    isPending,
    formMessages,
  };
}
