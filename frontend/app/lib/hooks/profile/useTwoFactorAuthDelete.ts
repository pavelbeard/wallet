import delete2fa from "@/app/lib/queries/delete2fa";
import { PasswordValidator } from "@/app/lib/schemas.z";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import logger from "../../helpers/logger";

export default function useTwoFactorAuthDelete() {
  const t = useTranslations();
  const { update } = useSession();
  const [delete2faState, setDelete2faState] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const deleteTwoFactorAuth = (data: PasswordValidator) => {
    startTransition(async () => {
      logger(data);
      // TODO: figure out with incorrect user data update
      const {
        success: delete2faSuccess,
        error: delete2faError,
        userData,
      } = await delete2fa(data);

      if (delete2faSuccess && userData) {
        update({ ...userData });
      }

      setDelete2faState({
        ...delete2faState,
        success: delete2faSuccess ? t(delete2faSuccess) : null,
        error: delete2faError ? t(delete2faSuccess) : null,
      });
    });
  };

  return {
    delete2faState,
    deleteTwoFactorAuth,
    isPending,
  };
}
