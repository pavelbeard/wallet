import { ReactNode } from "react";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { NextMiddlewareResult } from "next/dist/server/web/types";

type Props = {
    [x:string]: any;
}

type ProviderProps = {
    locale: string;
    children: ReactNode;
}

type SuccessResponse = {
    detail: string;
}

type ErrorResponse = {
    error: { message: string };
}

type RefreshToken = {
    name: string;
    value: string;
}

export type CustomMiddleware = (
    req: NextRequest,
    event: NextFetchEvent,
    res: NextResponse,
) => NextMiddlewareResult | Promise<NextMiddlewareResult>

type MiddlewareFactory = (middleware: CustomMiddleware) => CustomMiddleware

type Cookie = {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    maxAge?: string | number | undefined;
    size?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none" | undefined;
    partitionKeySite?: any
    crossSite?: any;
    priority?: any;
}
