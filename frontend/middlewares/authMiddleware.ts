import { localizedRoute, localizedRoutes } from "@/app/lib/routeActions";
import { auth } from "@/auth";
import { CustomMiddleware } from "@/middlewares/types";
import { AppRouteHandlerFnContext } from "@/node_modules/next-auth/lib/types";
import {
  authRoutes,
  DEFAULT_SIGNED_IN_PATH,
  DEFAULT_SIGNED_OUT_PATH,
  protectedRoutes,
} from "@/routes";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function authMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const authResponse = (await auth(async (req) => {
      const isAuthenticated = !!req.auth;
      const protectedPaths = await localizedRoutes(protectedRoutes);
      const authPaths = await localizedRoutes(authRoutes);
      const signOutPath = await localizedRoute(DEFAULT_SIGNED_OUT_PATH);
      const signInPath = await localizedRoute(DEFAULT_SIGNED_IN_PATH);
      const currentPath = req.nextUrl.pathname;

      if (protectedPaths.includes(currentPath) && !isAuthenticated) {
        return Response.redirect(new URL(signOutPath, req.nextUrl));
      }

      if (authPaths.includes(currentPath) && isAuthenticated) {
        return Response.redirect(new URL(signInPath, req.nextUrl));
      }
    })(request, event as AppRouteHandlerFnContext)) as NextResponse;

    if (authResponse) {
      const responseHeaders = response.headers;
      responseHeaders.forEach((value, key) => {
        authResponse.headers.set(key, value);
      });

      return middleware(request, event, authResponse);
    }

    middleware(request, event, response);
  };
}
