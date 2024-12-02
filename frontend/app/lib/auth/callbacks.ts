import refresh from "@/app/lib/auth/refresh";
import {
  SIGN_IN_HANDLERS,
  SIGN_IN_PROVIDERS,
} from "@/app/lib/auth/signInProviders";
import getCurrentEpochTime from "@/app/lib/helpers/getCurrentEpochTime";
import { NextAuthUserSchema, UpdateSessionSchema } from "@/app/lib/schemas.z";
import { Awaitable } from "@/app/lib/types";
import { WalletUser } from "@/auth";
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
    token.user = {
      ...user.user,
      id: user?.id as string,
      image: user.image as string,
      email: user.email as string,
      username: user.name as string,
      provider: account?.provider,
    };
    token.access_token = account?.access_token as string;
    token.access_token_exp = getCurrentEpochTime() + (account?.expires_in || 0);
    token.refresh_token = account?.refresh_token as string;

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

    token.user = { ...validatedSession.data.user, provider: "credentials" };
    token.access_token = validatedSession.data.access_token;
    token.access_token_exp = validatedSession.data.access_token_exp;
    token.refresh_token = validatedSession.data.refresh_token;
    token.expires_at = validatedSession.data.expires_at;

    return token;
  }

  /** One trouble is that refresh token is not working
   * After refresh the page is redirected to the login page
   * and backend is showing that, e.g:
   * Unauthorized: /api/refresh/
   * WARNING:django.request:Unauthorized: /api/refresh/
   * [30/Nov/2024 03:21:36] "POST /api/refresh/ HTTP/1.1" 401 90
   */
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

export { jwtCallback, sessionCallback, signInCallback };
