/**
 * Routes, which middleware should protect by default
 */
export const protectedRoutes: string[] = ["/dashboard"];

/**
 * Routes, which middleware should ignore by default
 */
export const authRoutes: string[] = ["/auth/sign-in", "/auth/sign-up"];

/**
 * Default paths for authorized and anonymous user
 */
export const DEFAULT_SIGNED_IN_PATH = "/dashboard";
export const DEFAULT_SIGNED_OUT_PATH = "/auth/sign-in";
