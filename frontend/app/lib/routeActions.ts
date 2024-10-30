"use server";

import { i18nConfig } from "@/i18n/routing";

export async function localizedRoutes(routes: string[]): Promise<string[]> {
  const locales = i18nConfig.locales;
  const mutatedRoutes: string[] = [];
  locales.forEach((locale) => {
    routes.forEach((route) => {
      mutatedRoutes.push(`/${locale}${route}`);
    });
  });
  return mutatedRoutes;
}

export async function localizedRoute(route: string): Promise<string> {
  const currentLocale = i18nConfig.defaultLocale;
  return `/${currentLocale}${route}`;
}
