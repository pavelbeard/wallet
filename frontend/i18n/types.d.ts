import { routing } from "@/i18n/routing";

export type Locales = (typeof routing)["locales"];
export type LocaleProps = { params: { locale: string } };
