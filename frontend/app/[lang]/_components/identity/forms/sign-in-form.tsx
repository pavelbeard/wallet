"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/routes";
import EmailInput from "@/app/[lang]/_components/ui/email-input";
import PasswordInput from "@/app/[lang]/_components/ui/password-input";
import Button from "@/app/[lang]/_components/ui/button";
import { signIn } from "@/app/lib/actions";


export default function SignInForm() {
    const t = useI18n();
    const navigate = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>();
    const [successMessage, setSuccessMessage] = useState<string | null>();

    const signin = (formData: FormData) => {
        setError(null);
        setSuccessMessage(null);
        startTransition(async () => {
            const result = await signIn(formData);
            switch (result) {
                case 1: {
                    setSuccessMessage(t('auth.success'));
                    navigate.push(DEFAULT_SIGN_IN_REDIRECT);
                    break;
                }
                case 2:
                    setError(t('auth.error.badCredentials')); break;
                case 3:
                    setError(t('auth.error.serverError')); break;
                default:
                    setError(t('auth.error.unknown'));
            }
        })
    };

    return (
        <form action={signin}>
            <EmailInput
                id="email"
                htmlFor="email"
                name="email"
                disabled={isPending}
                required
            />
            <PasswordInput
                id="password"
                htmlFor="password"
                name="password"
                disabled={isPending}
                required
            />
            <Button
                labelText={t('auth.signIn')}
                type="submit"
                disabled={isPending}
            >
            </Button>
            {error && <span className="text-danger">{error}</span>}
            {successMessage && <span className="text-success">{successMessage}</span>}
        </form>
    )
};
