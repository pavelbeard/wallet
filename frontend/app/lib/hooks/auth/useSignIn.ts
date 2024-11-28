import authenticate from "@/app/lib/auth/authenticate";
import { SignInValidator } from "@/app/lib/schemas.z";
import { useRouter } from "@/i18n/routing";
import { useState, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";

export default function useSignIn() {
  const router = useRouter();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<SignInValidator> = async (data) => {
    setFormMessages({
      ...formMessages,
      success: null,
      error: null,
    });

    startTransition(() => {
      authenticate(data).then((result) => {
        router.push("/dashboard");
        setFormMessages({
          ...formMessages,
          success: result?.success,
          error: result?.error,
        });
      });
    });
  };

  return {
    onSubmit,
    isPending,
    formMessages,
  };
}
