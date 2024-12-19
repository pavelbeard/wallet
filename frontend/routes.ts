/**
 * Routes, which middleware should ignore by default
 */
export const publicRoutes: string[] = ["/", "/verify-password"];

/**
 * Routes, which middleware should protect by default
 */
export const protectedRoutes: string[] = [
  "/dashboard",
  "/profile",
  "/profile/2fa",
  "/verify-email",
];
/**
 * Routes, which middleware should protect by OTP only
 */
export const OTPProtectedRoutes: string[] = ["/passwords", "/cards"];

/**
 * Route, which user should be proceed to verify 2FA
 */
export const DEFAULT_VERIFICATION_ROUTE = "/auth/sign-in/verify";

/**
 * Fallback route, which user should be proceed to create 2FA
 */
export const TWO_FACTOR_ATTENTION_ROUTE = "/profile/2fa/attention";

/**
 * Routes, which middleware should ignore by default, but if you is authenticated - skip these routes
 */
export const authRoutes: string[] = ["/auth/sign-in", "/auth/sign-up"];

/**
 * Default paths for authorized and anonymous user
 */
export const DEFAULT_SIGNED_IN_PATH = "/dashboard";
export const DEFAULT_SIGNED_OUT_PATH = "/auth/sign-in";
