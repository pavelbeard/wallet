import { WalletUser } from "@/auth";
import { routing } from "@/i18n/routing";
import { LocalesList } from "@/i18n/types";
import {
  authRoutes,
  DEFAULT_SIGNED_IN_PATH,
  DEFAULT_VERIFICATION_ROUTE,
  protectedRoutes,
} from "@/routes";
import { getToken } from "next-auth/jwt";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { CustomMiddleware } from "./types";

function rewriteRoutes(protectedPaths: string[], locales: LocalesList) {
  let protectedIntlRoutes = [...protectedPaths];

  protectedPaths.forEach((route) => {
    locales.forEach((locale) => {
      protectedIntlRoutes = [...protectedIntlRoutes, `/${locale}${route}`];
    });
  });

  return protectedIntlRoutes;
}

export default function authjsMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next();
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // @ts-expect-error nextauth is not typed
    request.nextauth = request.nextauth ?? {};
    // @ts-expect-error nextauth is not typed
    request.nextauth.token = token;
    const walletUser = token?.user as WalletUser;
    const pathname = request.nextUrl.pathname;

    const protectedIntlRoutes = rewriteRoutes(protectedRoutes, routing.locales);
    const verificationIntlRoutes = rewriteRoutes(
      [DEFAULT_VERIFICATION_ROUTE],
      routing.locales,
    );
    const authIntlRoutes = rewriteRoutes(authRoutes, routing.locales);

    const isProtectedRoute = protectedIntlRoutes.includes(pathname);
    const isVerificationRoute = verificationIntlRoutes.includes(pathname);
    const isAuthRoute = authIntlRoutes.includes(pathname);

    // ** CASE 1: User is authenticated with 2FA and verified **
    if (
      token &&
      (isAuthRoute || (walletUser?.verified && isVerificationRoute))
    ) {
      return NextResponse.redirect(
        new URL(DEFAULT_SIGNED_IN_PATH, request.url),
      );
    }

    // ** CASE 2: User is authenticated with 2FA but without verification **
    if (
      walletUser?.is_two_factor_enabled &&
      !walletUser?.verified &&
      isProtectedRoute
    ) {
      const tokenVerifyPath = new URL(DEFAULT_VERIFICATION_ROUTE, request.url);
      tokenVerifyPath.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(tokenVerifyPath);
    }

    // ** CASE 3: User is not authenticated **
    if (!token && (isProtectedRoute || isVerificationRoute)) {
      const unauthenticatedPath = new URL("/api/auth/signin", request.url);
      unauthenticatedPath.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(unauthenticatedPath);
    }

    // ** CASE 4: User is accessing public route **
    // ** CASE 5: User is accessing protected route **
    // ** CASE 6: Fallback **
    return middleware(request, event, response);
  };
}
