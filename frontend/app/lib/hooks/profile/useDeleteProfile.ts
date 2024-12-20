import deleteProfile from "@/app/lib/profile/deleteProfile";
import { signOut } from "next-auth/react";
import { FormEvent, useState, useTransition } from "react";

export default function useDeleteProfile(public_id: string) {
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      deleteProfile(public_id).then(({ success, error }) => {
        setFormMessages({
          success: success || null,
          error: error || null,
        });

        if (success) {
          signOut({ callbackUrl: "/" });
        }
      });
    });
  };

  return {
    handleSubmit,
    formMessages,
    isPending,
  };
}
