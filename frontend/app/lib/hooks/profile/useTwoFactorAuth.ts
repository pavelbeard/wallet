import verify2fa from "@/app/lib/queries/verify2fa";
import { TwoFactorValidator } from "@/app/lib/schemas.z";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";

export default function useTwoFactorAuth() {
  const { update } = useSession();
  const [copied, setCopied] = useState<string | null>(null);
  const [verify2faState, setVerify2faState] = useState({
    success: null as string | null,
    error: null as string | null,
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit2FA: SubmitHandler<TwoFactorValidator> = (data) => {
    startTransition(async () => {
      const { success, error, userData } = await verify2fa(data);

      if (success && userData) {
        await update({ ...userData });
      }

      setVerify2faState((prev) => ({
        ...prev,
        success: success || null,
        error: error || null,
      }));
    });
  };

  const resetCopied = () => setCopied(null);

  return {
    verify2faState,
    handleSubmit2FA,
    copied,
    setCopied,
    resetCopied,
    isPending,
  };
}
