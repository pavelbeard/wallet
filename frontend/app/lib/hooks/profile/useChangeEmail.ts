import changeEmail from "@/app/lib/profile/changeEmail";
import { ChangeEmailValidator } from "@/app/lib/schemas.z";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, UseFormReset, UseFormWatch } from "react-hook-form";

export default function useChangeEmail(
  watch: UseFormWatch<ChangeEmailValidator>,
  reset: UseFormReset<ChangeEmailValidator>,
) {
  const { data: session, update } = useSession();
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

  const onSubmit: SubmitHandler<ChangeEmailValidator> = async (data) => {
    setFormMessages({
      success: null,
      error: null,
      pending: null,
    });

    startTransition(async () => {
      const { success, error, newEmail } = await changeEmail(data);

      if (error) {
        setFormMessages({
          ...formMessages,
          error: "profile.userCard.changeEmail.error",
        });
        return;
      }

      if (success) {
        update({
          ...session,
          user: {
            ...session?.user,
            email: newEmail,
          },
        });

        setFormMessages({
          ...formMessages,
          success: "profile.userCard.changeEmail.success",
        });

        reset();
        return;
      }

      setFormMessages({
        ...formMessages,
        pending: "Check your email for confirmation link...",
      });
    });
  };

  return {
    onSubmit,
    isPending,
    formMessages,
  };
}
