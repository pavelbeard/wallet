"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/routes";
import { useI18n } from "@/locales/client";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/app/[lang]/_components/ui/button";
import { signOut } from "@/app/lib/actions";

export default function SignOutForm() {
    const t = useI18n();
    const navigation = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const signout = () => {
        startTransition(async () => {
            const result = await signOut();
            switch (result) {
                case 1: {
                    setSuccessMessage(t('auth.signOut'))
                    navigation.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
                    break;
                }
                case 2:
                    setError(t('auth.error.serverError')); break;
                default:
                    setError(t('auth.error.unknown'));
            }
        })
    };

    return (
        <form action={signout}>
            <Button
                labelText={t('auth.signOut')}
                disabled={isPending}
                type="submit"
            >
                <XCircleIcon className="size-4" />
            </Button>
            {error && <span className="text-danger">{error}</span>}
            {successMessage && <span className="text-success">{successMessage}</span>}
        </form>
    );
}