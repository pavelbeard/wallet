"use server"

import i18nConfig from "@/i18nConfig";

export async function localizedRoutes(routes: string[]): Promise<string[]> {
    const defaultLocale = i18nConfig.defaultLocale;
    const locales = i18nConfig.locales;
    const mutatedRoutes: string[] = [];
    locales.forEach(locale => {
        routes.forEach(route => {
            if (locale == defaultLocale) {
                mutatedRoutes.push(route)
            } else {
                mutatedRoutes.push(`/${locale}${route}`);
            }
        });
    });
    return mutatedRoutes;
}

export async function localizedRoute(route: string): Promise<string> {
    const currentLocale = i18nConfig.defaultLocale;
    return `/${currentLocale}${route}`
}