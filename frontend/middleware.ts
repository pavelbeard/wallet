import authMiddleware from "@/middlewares/authMiddleware";
import { chain } from "@/middlewares/chain";
import i18nMiddleware from "@/middlewares/i18nMiddleware";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import combineMiddlewares from "./middlewares/combineMiddlewares";

export default chain([i18nMiddleware, authMiddleware]);

// const { auth } = NextAuth(authConfig);

// export default combineMiddlewares(
//   i18nMiddleware,
//   auth,
// )

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
