import { routing } from "@/i18n/routing";
import { Locales } from "@/i18n/types";
import {
  authRoutes,
  DEFAULT_VERIFICATION_ROUTE,
  protectedRoutes,
} from "@/routes";
import { User } from "next-auth";
import { getToken } from "next-auth/jwt";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { CustomMiddleware } from "./types";

function rewriteRoutes(protectedPaths: string[], locales: Locales) {
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

    // @ts-ignore
    request.nextauth = request.nextauth ?? {};
    // @ts-ignore
    request.nextauth.token = token;
    const user = token?.user as User;
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

    // If user is authenticated with 2FA but without verification
    if (user?.otp_device_id && !user?.verified && isProtectedRoute) {
      const tokenVerifyPath = new URL(DEFAULT_VERIFICATION_ROUTE, request.url);
      tokenVerifyPath.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(tokenVerifyPath);
    }

    // If user is not authenticated
    if (!token && (isProtectedRoute || isVerificationRoute)) {
      const unauthenticatedPath = new URL("/api/auth/signin", request.url);
      unauthenticatedPath.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(unauthenticatedPath);
    }

    // if (token && (isAuthRoute || isVerificationRoute)) {
    //   // User with 2FA and verified
    //   if (user.otp_device_id && user.verified) {
    //     const authenticatedPath = new URL(DEFAULT_SIGNED_IN_PATH, request.url);
    //     authenticatedPath.searchParams.set("callbackUrl", pathname);
    //     return NextResponse.redirect(authenticatedPath);
    //   }

    //   // User with 2FA and not verified
    //   if (user.otp_device_id && !user.verified) {
    //     const unverifiedPath = new URL(DEFAULT_VERIFICATION_ROUTE, request.url);
    //     unverifiedPath.searchParams.set("callbackUrl", pathname);
    //     return NextResponse.redirect(unverifiedPath);
    //   }

    //   if (!user.otp_device_id) {
    //     // User without 2FA
    //     const authenticatedPath = new URL(DEFAULT_SIGNED_IN_PATH, request.url);
    //     authenticatedPath.searchParams.set("callbackUrl", pathname);
    //     return NextResponse.redirect(authenticatedPath);
    //   }
    // }

    return middleware(request, event, response);
  };
}
