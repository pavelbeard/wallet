import registration from "@/app/lib/auth/registration";
import { SignUpValidator } from "@/app/lib/schemas.z";
import { useState, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";

export default function useSignUp() {
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<SignUpValidator> = (data) => {
    setFormMessages({
      ...formMessages,
      success: null,
      error: null,
    });

    startTransition(() => {
      registration(data).then((result) => {
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