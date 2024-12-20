import refresh from "@/app/lib/auth/refresh";
import {
  SIGN_IN_HANDLERS,
  SIGN_IN_PROVIDERS,
} from "@/app/lib/auth/signInProviders";
import rewriteRoutes from "@/app/lib/helpers/rewriteRoutes";
import { NextAuthUserSchema, UpdateSessionSchema } from "@/app/lib/schemas.z";
import { Awaitable } from "@/app/lib/types";
import { WalletUser } from "@/auth";
import { routing } from "@/i18n/routing";
import { LocalesList } from "@/i18n/types";
import {
  authRoutes,
  DEFAULT_SIGNED_IN_PATH,
  DEFAULT_SIGNED_OUT_PATH,
  DEFAULT_VERIFICATION_MASTER_PASSWORD_ROUTE,
  DEFAULT_VERIFICATION_ROUTE,
  protectedRoutes,
} from "@/routes";
import {
  Account,
  DefaultSession,
  JWT,
  Profile,
  Session,
  User,
} from "next-auth";
import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import { CredentialInput } from "next-auth/providers";
import { NextRequest, NextResponse } from "next/server";

type AuthorizedCallback = (params: {
  request: NextRequest;
  auth: Session | null;
}) => Awaitable<boolean | NextResponse | Response | undefined>;

type SignInCallback = (params: {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: {
    verificationRequest?: boolean;
  };
  credentials?: Record<string, CredentialInput>;
}) => Awaitable<boolean | string>;

type JWTCallback = (params: {
  token: NextAuthJWT;
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  trigger?: "signIn" | "signUp" | "update";
  isNewUser?: boolean;
  session?: Session;
}) => Promise<JWT | NextAuthJWT | null>;

type SessionCallback = (
  params: ({
    session: {
      user: AdapterUser;
    } & AdapterSession;
    user: AdapterUser;
  } & {
    session: Session;
    token: NextAuthJWT;
  }) & {
    newSession: Session;
    trigger?: "update";
  },
) => Awaitable<Session | DefaultSession>;

const routeMatcher = (
  routes: string[],
  locales: LocalesList,
  pathname: string,
) => {
  const rewrittenRoutes = rewriteRoutes(routes, locales);
  return rewrittenRoutes.includes(pathname);
};

const authorizedCallback: AuthorizedCallback = ({ request, auth }) => {
  const user = auth?.user as WalletUser;
  const { pathname, search } = request.nextUrl;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? "es";

  const isProtectedRoute = routeMatcher(
    protectedRoutes,
    routing.locales,
    pathname,
  );

  const isErrorRoute = "/auth/error" == pathname;

  const isVerificationRoute = routeMatcher(
    [DEFAULT_VERIFICATION_ROUTE],
    routing.locales,
    pathname,
  );

  const isAuthRoute = routeMatcher(authRoutes, routing.locales, pathname);

  const redirectTo = (path: string, callbackUrl?: string) => {
    const url = new URL(`/${locale}${path}`, request.url);
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl);
    }
    return NextResponse.redirect(url);
  };

  if (isErrorRoute) {
    return redirectTo(`{pathname}${search}`);
  }

  if (isProtectedRoute) {
    if (!user) {
      return redirectTo(DEFAULT_SIGNED_OUT_PATH);
    }

    if (
      (!user?.verified && !user?.is_two_factor_enabled) ||
      user?.is_oauth_user
    ) {
      return redirectTo(DEFAULT_VERIFICATION_MASTER_PASSWORD_ROUTE, pathname);
    }

    if (user?.is_two_factor_enabled && !user?.verified) {
      return redirectTo(DEFAULT_VERIFICATION_ROUTE, pathname);
    }
  }

  if (user) {
    if (isAuthRoute && user?.verified && isVerificationRoute) {
      return redirectTo(DEFAULT_SIGNED_IN_PATH);
    }
  }

  if (pathname == "/verify-email" && isProtectedRoute) {
    return redirectTo("/verify-email");
  }

  return NextResponse.next();
};

const signInCallback: SignInCallback = ({
  user,
  account,
  profile,
  email,
  credentials,
}) => {
  const provider: string | undefined = account?.provider;
  if (provider == undefined || !account) return false;

  if (!SIGN_IN_PROVIDERS.includes(provider)) return false;
  return SIGN_IN_HANDLERS[provider]({
    user,
    account,
    profile,
    email,
    credentials,
  });
};

const jwtCallback: JWTCallback = async ({
  token,
  user,
  account,
  trigger,
  session,
}) => {
  if (user && account?.type !== "credentials") {
    // HERE IS THE PROBLEM
    // TOKEN IS TAKING FROM THE GOOGLE DIRECTLY
    // need to request a new token from backend
    const newUser = {
      ...user.user,
      // @ts-expect-error user is necessary
      ...account?.user,
    };

    token.user = {
      ...newUser,
      id: user?.id as string,
      image: user.image as string,
      email: user.email as string,
      username: user.name as string,
      provider: account?.provider,
    };
    token.access_token = account?.access_token as string;
    token.access_token_exp = account?.access_token_exp as number;
    token.refresh_token = account?.refresh_token as string;
    token.expires_in = account?.expires_in as number;

    return token;
  }

  if (user) {
    const validatedData = NextAuthUserSchema.safeParse(user);
    if (!validatedData.success) return token;

    token.user = { ...validatedData.data?.user, provider: "credentials" };
    token.access_token = validatedData.data.access_token;
    token.access_token_exp = validatedData.data.access_token_exp;
    token.refresh_token = validatedData.data.refresh_token;
    token.expires_at = validatedData.data.expires_at;

    return token;
  }

  // updating session after 2fa verification/deletion
  if (trigger === "update" && session) {
    const validatedSession = UpdateSessionSchema.safeParse(session);
    if (!validatedSession.success) return token;

    // @ts-expect-error | Token includes provider, because that calls in the trigger update
    const provider = token?.user?.provider;

    token.user = { ...validatedSession.data.user, provider };
    token.access_token = validatedSession.data.access_token;
    token.access_token_exp = validatedSession.data.access_token_exp;
    token.refresh_token = validatedSession.data.refresh_token;
    token.expires_at = validatedSession.data.expires_at;

    return token;
  }

  const tokens = await refresh(token);
  return tokens ? tokens : null;
};

const sessionCallback: SessionCallback = ({ session, token }) => {
  session.user = token.user as WalletUser & AdapterUser;
  session.access_token = token?.access_token as string;
  session.access_token_exp = token?.access_token_exp as number;
  session.refresh_token = token?.refresh_token as string;
  session.expires_at = token?.expires_at as number;

  return session;
};

export { authorizedCallback, jwtCallback, sessionCallback, signInCallback };
