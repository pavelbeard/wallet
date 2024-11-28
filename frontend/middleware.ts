import { chain } from "@/middlewares/chain";
import authjsMiddleware from "./middlewares/authjsMiddleware";
import intlMiddleware from "./middlewares/intlMiddleware";

export default chain([authjsMiddleware, intlMiddleware]);

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
