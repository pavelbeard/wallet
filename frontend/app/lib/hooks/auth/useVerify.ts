import { useRouter } from "@/i18n/routing";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";
import verify2fa from "../../queries/profile/verify2fa";
import { TwoFactorValidator } from "../../schemas.z";

export default function useVerify() {
  const { update } = useSession();
  const router = useRouter();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<TwoFactorValidator> = (data) => {
    startTransition(async () => {
      const { error, success, userData } = await verify2fa(data);

      if (success) {
        update({ ...userData }).then(() => router.push(DEFAULT_SIGNED_IN_PATH));
      }

      setFormMessages({
        ...formMessages,
        success: success || null,
        error: error || null,
      });
    });
  };

  return {
    onSubmit,
    isPending,
    formMessages,
  };
}
