import { routing } from "@/i18n/routing";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const locales = [...routing.locales] as const;
export type Locales = (typeof locales)[locale];
export type LocalesList = typeof routing.locales;
export type LocaleProps = { params: { locale: string } };
