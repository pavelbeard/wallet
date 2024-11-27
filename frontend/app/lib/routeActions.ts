"use server";

import { routing } from "@/i18n/routing";

export async function localizedRoutes(routes: string[]): Promise<string[]> {
  const locales = routing.locales;
  const mutatedRoutes: string[] = [];
  locales.forEach((locale) => {
    routes.forEach((route) => {
      mutatedRoutes.push(`/${locale}${route}`);
    });
  });
  return mutatedRoutes;
}

export async function localizedRoute(route: string): Promise<string> {
  const currentLocale = routing.defaultLocale;
  return `/${currentLocale}${route}`;
}
