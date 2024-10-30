import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const i18nConfig = defineRouting({
    locales: ['en', 'es'],
    defaultLocale: 'es',
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(i18nConfig);