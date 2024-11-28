import refresh from "@/app/lib/auth/refresh";
import {
  SIGN_IN_HANDLERS,
  SIGN_IN_PROVIDERS,
} from "@/app/lib/auth/signInProviders";
import getCurrentEpochTime from "@/app/lib/helpers/getCurrentEpochTime";
import logger from "@/app/lib/helpers/logger";
import setAuthData from "@/app/lib/helpers/setAuthData";
import { UpdateSessionSchema } from "@/app/lib/schemas.z";
import { Awaitable } from "@/app/lib/types";
import { JWT } from "@auth/core/jwt";
import { Account, DefaultSession, Profile, Session, User } from "next-auth";
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
}) => Awaitable<JWT | null>;

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
    token.user = { ...user, username: user.name };
    token.provider = account?.provider;
    token.access_token = account?.access_token;
    token.access_token_exp = getCurrentEpochTime() + (account?.expires_in || 0);
    token.refresh_token = account?.refresh_token;

    return token;
  }

  if (user) {
    const { access_token, access_token_exp, refresh_token, refresh_token_exp } =
      setAuthData({ user });

    token.user = user;
    token.provider = "credentials";
    token.access_token = access_token;
    token.access_token_exp = access_token_exp;
    token.refresh_token = refresh_token;
    token.refresh_token_exp = refresh_token_exp;

    return token;
  }

  // updating session after 2fa verification/deletion
  if (trigger === "update" && session) {
    const validatedSession = UpdateSessionSchema.safeParse(session);
    if (!validatedSession.success) return token;

    const { access_token, access_token_exp, refresh_token, refresh_token_exp } =
      setAuthData({ session: validatedSession.data });

    token.user = validatedSession.data.user;
    token.provider = "credentials";
    token.access_token = access_token;
    token.access_token_exp = access_token_exp;
    token.refresh_token = refresh_token || session?.refresh_token;
    token.refresh_token_exp = refresh_token_exp || session?.refresh_token_exp;

    return token;
  }

  const refreshResult = await refresh(token);
  return refreshResult ? refreshResult : null;
};

const sessionCallback: SessionCallback = ({ session, token }) => {
  logger("session callback | session: ", session);
  logger("session callback | token: ", token);

  return {
    ...session,
    user: {
      ...(token?.user as User),
      provider: token?.provider as string,
    },
    access_token: token?.access_token as string,
    access_token_exp: token?.access_token_exp as number,
    refresh_token: token?.refresh_token as string,
    refresh_token_exp: token?.refresh_token_exp as number,
  };
};

export { jwtCallback, sessionCallback, signInCallback };
