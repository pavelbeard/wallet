import sendMasterPassword from "@/app/lib/auth/sendMasterPassword";
import { MasterPasswordValidator } from "@/app/lib/schemas.z";
import { useRouter } from "@/i18n/routing";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";

export default function useMasterPassword() {
  const router = useRouter();
  const { update } = useSession();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (formMessages.success) {
      const timer = setTimeout(() => {
        router.push(DEFAULT_SIGNED_IN_PATH);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formMessages]);

  const onSubmit: SubmitHandler<MasterPasswordValidator> = (data) => {
    setFormMessages({
      ...formMessages,
      success: null,
      error: null,
    });

    startTransition(async () => {
      const { success, error, userData } = await sendMasterPassword(data);

      await update({ ...userData });

      setFormMessages({
        ...formMessages,
        success: success,
        error: error,
      });
    });
  };

  return {
    onSubmit,
    formMessages,
    isPending,
  };
}
