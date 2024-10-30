import authMiddleware from "@/middlewares/authMiddleware";
import { chain } from "@/middlewares/chain";
import i18nMiddleware from "@/middlewares/i18nMiddleware";

export default chain([i18nMiddleware, authMiddleware]);

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
