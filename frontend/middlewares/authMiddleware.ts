import { localizedRoute, localizedRoutes } from "@/app/lib/routeActions";
import { auth } from "@/auth";
import { authConfig } from "@/auth.config";
import { CustomMiddleware } from "@/middlewares/types";
import { AppRouteHandlerFnContext } from "@/node_modules/next-auth/lib/types";
import {
  DEFAULT_SIGNED_IN_PATH,
  DEFAULT_SIGNED_OUT_PATH,
  protectedRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function authMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const authResponse = (await auth(async (req) => {
      const isAuthenticated = !!req.auth;
      const currentPath = req.nextUrl.pathname;

      const isProtectedRoute = (
        await localizedRoutes(protectedRoutes)
      ).includes(currentPath);

      const signOutPath = await localizedRoute(DEFAULT_SIGNED_OUT_PATH);
      const signInPath = await localizedRoute(DEFAULT_SIGNED_IN_PATH);

      if (isProtectedRoute) {
        if (isAuthenticated) {
          return response;
        }

        return Response.redirect(new URL(signOutPath, req.nextUrl));
      } else if (isAuthenticated) {
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