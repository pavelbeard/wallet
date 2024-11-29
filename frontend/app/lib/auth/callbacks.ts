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
  token: JWT;
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  trigger?: "signIn" | "signUp" | "update";
  isNewUser?: boolean;
  session?: Session;
}) => Promise<JWT | null>;

type SessionCallback = (
  params: ({
    session: {
      user: AdapterUser;
    } & AdapterSession;
    user: AdapterUser;
  } & {
    session: Session;
    token: JWT;
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
      ...user,
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
    token.refresh_token_exp = validatedData.data.refresh_token_exp;

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
    token.refresh_token_exp = validatedSession.data.refresh_token_exp;

    return token;
  }

  const refreshResult = await refresh(token);
  return refreshResult ? refreshResult : null;
};

const sessionCallback: SessionCallback = ({ session, token }) => {
  session.user = token.user as WalletUser & AdapterUser;
  session.access_token = token?.access_token as string;
  session.access_token_exp = token?.access_token_exp as number;
  session.refresh_token = token?.refresh_token as string;
  session.refresh_token_exp = token?.refresh_token_exp as number;

  return session;
};

export { jwtCallback, sessionCallback, signInCallback };
