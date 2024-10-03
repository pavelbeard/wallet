"use client";

import { Props } from "@/types";
import { useI18n } from "@/locales/client";

export default function PasswordInput({
    htmlFor, id, name, ...rest
}: {
    htmlFor: string,
    id: string,
    name: string,
} & Props) {
    const t = useI18n();
    return (
        <label htmlFor={htmlFor}>
            <span>{t('ui.passwordInput')}</span>
            <input type="password" id={id} name={name} {...rest} />
        </label>
    );
}