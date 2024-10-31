import { NextRequest, NextResponse } from "next/server";
import { Middleware } from "./types";

export default function combineMiddlewares(...middlewares: Middleware[]) {
  return async (req: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(req, NextResponse.next(), () => {});
      if (result instanceof (Response || NextResponse)) {
        return result;
      }
    }

    return NextResponse.next();
  };
}
