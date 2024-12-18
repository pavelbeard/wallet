import pathnameIndex from "@/app/lib/helpers/pathnameRegex";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import { publicRoutes } from "@/routes";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = pathnameIndex(publicRoutes);

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (auth as any)(req);
  }
}
