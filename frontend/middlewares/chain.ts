import { CustomMiddleware, MiddlewareFactory } from "@/middlewares/types";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function chain(
  functions: MiddlewareFactory[],
  index = 0,
): CustomMiddleware {
  const current = functions[index];
  if (current) {
    const next = chain(functions, index + 1);
    return current(next);
  }

  return (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    return response;
  };
}
