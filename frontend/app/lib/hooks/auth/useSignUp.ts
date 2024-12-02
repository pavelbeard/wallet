"use client";

import registration from "@/app/lib/auth/registration";
import { SignUpValidator } from "@/app/lib/schemas.z";
import { useState, useTransition } from "react";
import { SubmitHandler, UseFormWatch } from "react-hook-form";
import useUsernameSuggestions from "./useUsernameSuggestions";

export default function useSignUp(watch: UseFormWatch<SignUpValidator>) {
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();
  const { error, data, loading, isTaken } = useUsernameSuggestions(
    watch("username"),
  );

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
    usernameSuggestions: {
      error,
      data,
      loading,
      isTaken,
    },
  };
}
