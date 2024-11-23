import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse,
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

export type MiddlewareFactory = (
  middleware: CustomMiddleware,
) => CustomMiddleware;

type Callback = () => void;
export type Middleware = (
  req: NextRequest,
  res: NextResponse,
  callback: Callback,
) => Promise<Response | NextResponse>;
