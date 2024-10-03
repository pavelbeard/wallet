'use client';

import { I18nProviderClient } from "@/locales/client";
import type { ProviderProps } from "@/types";

export default function Provider({ locale, children }: ProviderProps ) {
    return (
        <I18nProviderClient locale={locale}>
            {children}
        </I18nProviderClient>
    );
}