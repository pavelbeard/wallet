
/**
 * This is an array with routes without any protection.
 * @type{string[]}
 */
export const publicRoutes: string[] = [
    "/",
];

/**
 * This is an array with auth routes.
 * They have to be without any protection.
 * @type{string[]}
 */
export const authRoutes: string[] = [
    "/identity/signin",
    "/identity/signup",
];

/**
 * That path also doesn't need any protection;
 * @type{string}
 */
export const apiHandlerPrefix: string = "/api"

/**
 * Default sign in redirect.
 */
export const DEFAULT_SIGN_IN_REDIRECT = '/dashboard';

/**
 * Default unauthenticated redirect.
 */
export const DEFAULT_UNAUTHENTICATED_REDIRECT = '/';
