import { CustomMiddleware, MiddlewareFactory } from "@/types";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function middlewareChain(
    functions: MiddlewareFactory[],
    index = 0,
) : CustomMiddleware {
    const current = functions[index];

    if (current) {
        const next = middlewareChain(functions, index + 1);
        return current(next);
    }

    return (
        req: NextRequest,
        event: NextFetchEvent,
        res: NextResponse
    ) => {
        return res;
    };
}