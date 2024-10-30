"use client"

import React from "react";
import EmailInput from "@/app/components/ui/email-input";
import { useIntl } from "react-intl";
import PasswordInput from "@/app/components/ui/password-input";
import FormTitle from "@/app/components/ui/form-title";
import Submit from "@/app/components/ui/submit";

export default function SignInForm() {
    const t = useIntl();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        console.log(formData.get('password'))
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
            <FormTitle>{t.formatMessage({ id: 'form.formTitle' })}</FormTitle>
            <EmailInput
                labelText={t.formatMessage({ id: 'form.emailInput' })}
                htmlFor="credentials-email"
                name="email"
                id="credentials-email"
            />
            <PasswordInput
                labelText={t.formatMessage({ id: 'form.passwordInput' })}
                htmlFor="credentials-password"
                name="password"
                id="credentials-password"
            />
            <Submit color="bg-slate-800 hover:bg-slate-300 hover:text-black">
                {t.formatMessage({ id: 'form.signIn' })}
            </Submit>
        </form>
    );
}