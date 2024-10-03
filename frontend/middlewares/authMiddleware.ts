import { cookies } from "next/headers";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import setCookie from "set-cookie-parser";
import {
    apiHandlerPrefix,
    authRoutes,
    DEFAULT_SIGN_IN_REDIRECT,
    DEFAULT_UNAUTHENTICATED_REDIRECT,
    publicRoutes
} from "@/routes";
import { API_URL } from "@/constants";
import { CustomMiddleware } from "@/types";
import locales from "@/locales/locales";

function isAuthenticated() {
    return !!cookies().get('__clientid');
}

function changeRoutes() {
    const publicRoutesWithLocales: string[] = [];
    publicRoutes.forEach(route => {
        locales.forEach(locale => {
            // here if route is a / that equals to ['/es', '/en']
            // otherwise ['/es/some_route', '/en/some_route']
            publicRoutesWithLocales.push(`/${locale}${route === '/' ? '' : route}`);
            // This is necessary too, because condition if (!isSignedIn && !isPublicRoute)
            // one must admit both e.g. '/es' and '/es/'.
            // Otherwise, if '/es/' isn't on public routes, the main page '/' won't be acceptable
            if(route === '/') publicRoutesWithLocales.push(`/${locale}/`);
        })
    });
    // This is necessary for adding locales to the beginning of the routes
    const authRoutesWithLocales: string[] = [];
    authRoutes.forEach(route => {
        locales.forEach(locale => {
            authRoutesWithLocales.push(`/${locale}${route}`);
        })
    });

    return [publicRoutesWithLocales, authRoutesWithLocales]
}

export default function authMiddleware(middleware: CustomMiddleware) {
    return async (
        req: NextRequest,
        event: NextFetchEvent,
        res: NextResponse,
    ) => {
        if (!isAuthenticated()) {
            const cookieStore = cookies();
            const refreshResponse = await fetch(`${API_URL}/stuff/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `__rclientid=${cookieStore.get('__rclientid')?.value}`
                },
                credentials: "include"
            });

            if (refreshResponse.status === 200) {
                refreshResponse.headers.getSetCookie().forEach(cookie => {
                    const parsedCookie = setCookie(cookie)[0];
                    res.cookies.set(parsedCookie as ResponseCookie)
                });
                return middleware(req, event, res);
            }
        }

        const [publicRoutesWithLocales, authRoutesWithLocales] = changeRoutes();
        const isApiAuthRoute = req.nextUrl.pathname.includes(apiHandlerPrefix);
        const isPublicRoute = publicRoutesWithLocales.includes(req.nextUrl.pathname);
        const isAuthRoute = authRoutesWithLocales.includes(req.nextUrl.pathname);

        if (isApiAuthRoute) return middleware(req, event, res);
        if (isAuthRoute) {
            if (isAuthenticated()) {
                return Response.redirect(new URL(
                    DEFAULT_SIGN_IN_REDIRECT,
                    req.nextUrl
                ));
            }
            return middleware(req, event, res);
        }
        if ((!isAuthenticated()) && !isPublicRoute) {
            return Response.redirect(new URL(
                DEFAULT_UNAUTHENTICATED_REDIRECT,
                req.nextUrl
            ));
        }

        return middleware(req, event, res);
    }
}