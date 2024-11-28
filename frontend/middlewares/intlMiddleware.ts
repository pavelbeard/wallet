import { routing } from "@/i18n/routing";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./types";

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = routing.locales.map((locale) => locale);
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = match(languages, locales, routing.defaultLocale);
  return locale;
}

export default function intlMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const { pathname } = request.nextUrl;
    const pathnameIsMissingLocale = routing.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}`) && pathname !== `/${locale}`,
    );

    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      const url = new URL(`/${locale}${pathname}`, request.url);
      return NextResponse.redirect(url);
    }

    return middleware(request, event, response);
  };
}
