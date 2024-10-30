import {
  API_PATH,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/app/lib/constants";
import getCurrentEpochTime from "@/app/lib/getCurrentEpochTime";
import parseCookies from "@/app/lib/parseCookies";
import refreshToken from "@/app/lib/refreshToken";
import { SIGN_IN_HANDLERS, SIGN_IN_PROVIDERS } from "@/app/lib/signInProviders";
import { JWT } from "@auth/core/jwt";
import Credentials from "@auth/core/providers/credentials";
import NextAuth, { AuthError, User } from "next-auth";
import Google from "next-auth/providers/google";
import { Cookie } from "set-cookie-parser";

declare module "next-auth" {
  interface User {
    access_token?: Cookie;
    refresh_token?: Cookie;
    provider?: string;
  }
}

const providers = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials): Promise<User | null> {
      try {
        const response = await fetch(`${API_PATH}/api/stuff/auth/signin/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });

        if (!response.ok) {
          throw new AuthError("Bad credentials");
        }

        const cookies = await parseCookies(response);
        const [access_token, refresh_token] = cookies.map((cookie) => {
          if (cookie.name === "__clientid" || cookie.name === "__rclientid") {
            return cookie;
          }
        });

        return {
          access_token: access_token,
          refresh_token: refresh_token,
        };
      } catch (e) {
        throw e;
      }
    },
  }),
  Google({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
];

const refresh = async (token: JWT) => {
  const accessTokenExpiration = token?.access_token_exp as number;
  const refreshTokenValue = token?.api_refresh_token as string;
  const refreshTokenExpiration = token?.refresh_token_exp as number;
  const dateNow = Date.now();

  console.log(accessTokenExpiration);
  

  // if the refresh token is expired, the session is down.
  if (dateNow > refreshTokenExpiration * 1000) {
    return null;
  }

  // it necessary to have access token exp and refresh token value
  if (
    accessTokenExpiration &&
    refreshTokenValue &&
    dateNow > accessTokenExpiration * 1000
  ) {
    const refreshResult = await refreshToken(refreshTokenValue);
    if (refreshResult.success) {
      const accessTokenMaxAge = refreshResult.tokens?.accessToken
        .maxAge as number;
      const refreshTokenMaxAge = refreshResult.tokens?.refreshToken
        .maxAge as number;

      token.api_access_token = refreshResult.tokens?.accessToken.value;
      token.api_refresh_token = refreshResult.tokens?.refreshToken.value;
      token.access_token_exp = getCurrentEpochTime() + accessTokenMaxAge;
      token.refresh_token_exp = getCurrentEpochTime() + refreshTokenMaxAge;
    } else {
      return null;
    }
  }

  return token;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
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
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        const accessTokenMaxAge = account?.expires_in as number;
        const idTokenMaxAge = account?.expires_at as number;

        token.access_token = account?.access_token;
        token.access_token_exp = getCurrentEpochTime() + accessTokenMaxAge;

        token.refresh_token = account?.refresh_token;

        token.id_token = account?.id_token;
        token.id_token_exp = getCurrentEpochTime() + idTokenMaxAge;

        token.provider = account?.provider;
      } else if (user) {
        const accessTokenMaxAge = user?.access_token?.maxAge as number;
        const refreshTokenMaxAge = user.refresh_token?.maxAge as number;

        token.api_access_token = user.access_token?.value;
        token.access_token_exp = getCurrentEpochTime() + accessTokenMaxAge;

        token.api_refresh_token = user.refresh_token?.value;
        token.refresh_token_exp = getCurrentEpochTime() + refreshTokenMaxAge;

        token.provider = "credentials";
        return token;
      }

      const refreshResult = await refresh(token);
      return refreshResult ? refreshResult : null;
    },
    session({ session, token }) {
      session.user.provider = token?.provider as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
});

export const oauthProviders = providers.filter(
  (provider) => provider.id !== "credentials",
);
