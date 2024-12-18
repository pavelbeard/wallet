// import { chain } from "@/middlewares/chain";
// import authjsMiddleware from "./middlewares/authjsMiddleware";
// import intlMiddleware from "./middlewares/intlMiddleware";

// export default chain([authjsMiddleware, intlMiddleware]);

// export const config = {
//   matcher: "/((?!api|static|.*\\..*|_next).*)",
// };

import unitedMiddleware from "@/middlewares/unitedMiddleware";

export default unitedMiddleware;

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
