import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import emailVerify from "../../queries/emailVerify";

export default function useEmailVerify(token: string) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [formMessages, setFormMessages] = useState({
    success: null as string | null,
    error: null as string | null,
  });

  const handleSubmit = async () => {
    startTransition(async () => {
      const { success, error, newEmail } = await emailVerify(token);

      setFormMessages({
        success: success ?? null,
        error: error ?? null,
      });

      if (success) {
        const newSession = {
          ...session,
          user: { ...session?.user, email: newEmail },
        };
        update({ session: newSession });
        router.push("/profile");
      }
    });
  };

  return {
    isPending,
    formMessages,
    handleSubmit,
  };
}
