import { LocalesList } from "@/i18n/types";

function rewriteRoutes(protectedPaths: string[], locales: LocalesList) {
  let protectedIntlRoutes = [...protectedPaths];

  protectedPaths.forEach((route) => {
    locales.forEach((locale) => {
      protectedIntlRoutes = [...protectedIntlRoutes, `/${locale}${route}`];
    });
  });

  return protectedIntlRoutes;
}

export default rewriteRoutes;
