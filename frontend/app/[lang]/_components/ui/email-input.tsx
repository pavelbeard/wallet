"use client";

import { Props } from "@/types";
import { useI18n } from "@/locales/client";

export default function EmailInput({
    htmlFor, id, name, ...rest
}: {
    htmlFor: string,
    id: string,
    name: string,
} & Props) {
    const t = useI18n();
    return (
        <label htmlFor={htmlFor}>
            <span>{t('ui.emailInput')}</span>
            <input type="email" id={id} name={name} {...rest} />
        </label>
    );
}