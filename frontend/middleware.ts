import middlewareChain from "@/chain";
import localeMiddleware from "@/middlewares/i18nMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";

export default middlewareChain([localeMiddleware, authMiddleware])

export const config = {
    // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
