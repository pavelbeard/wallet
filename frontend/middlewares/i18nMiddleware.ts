import { CustomMiddleware } from "@/types";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import locales from "@/locales/locales";

export default function localeMiddleware(middleware: CustomMiddleware) {
    return async (
        req: NextRequest,
        event: NextFetchEvent,
        res: NextResponse
    ) => {
        const _localeMiddleware = createI18nMiddleware({
            locales,
            defaultLocale: "en-US",
        });
        const modifiedRes = _localeMiddleware(req);

        return middleware(req, event, modifiedRes);
    }
}