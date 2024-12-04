import createChangeEmailRequest from "@/app/lib/profile/createChangeEmailRequest";
import { RequestEmailValidator } from "@/app/lib/schemas.z";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, UseFormReset, UseFormWatch } from "react-hook-form";

export default function useCreateEmailVerificationRequest(
  watch: UseFormWatch<RequestEmailValidator>,
  reset: UseFormReset<RequestEmailValidator>,
) {
  const [isPending, startTransition] = useTransition();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
    pending: null as string | null,
  });

  useEffect(() => {
    if (watch("email")) {
      setFormMessages({
        success: null,
        error: null,
        pending: null,
      });
    }
  }, [watch("email")]);

  const onSubmit: SubmitHandler<RequestEmailValidator> = async (data) => {
    setFormMessages({
      success: null as string | null,
      error: null as string | null,
      pending: null as string | null,
    });

    startTransition(async () => {
      const { success, error } = await createChangeEmailRequest(data);

      if (error) {
        setFormMessages({
          success: null,
          error,
          pending: null,
        });
        return;
      }

      if (success) {
        setFormMessages({
          error: null,
          success,
          pending: null,
        });

        reset();
        return;
      }
    });
  };

  return {
    onSubmit,
    isPending,
    formMessages,
  };
}
