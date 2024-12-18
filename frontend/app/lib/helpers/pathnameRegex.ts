import { routing } from "@/i18n/routing";

const pathnameIndex = (routes: string[]) =>
  RegExp(
    `^(/(${routing.locales.join("|")}))?(${routes
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );

export default pathnameIndex;
