import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const i18nConfig = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "es",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(i18nConfig);
