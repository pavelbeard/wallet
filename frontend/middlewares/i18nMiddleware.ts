import { routing } from "@/i18n/routing";
import { CustomMiddleware } from "@/middlewares/types";
import createMiddleware from "next-intl/middleware";
import { NextFetchEvent, NextRequest } from "next/server";

export default function i18nMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const i18nResponse = createMiddleware(routing)(request);

    return middleware(request, event, i18nResponse);
  };
}
