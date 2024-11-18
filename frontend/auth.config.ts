import {
  API_PATH,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/app/lib/constants";
import parseCookies from "@/app/lib/parseCookies";
import { JWT } from "@auth/core/jwt";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";
import { jwtDecode } from "jwt-decode";
import { NextAuthConfig, User } from "next-auth";
import getCurrentEpochTime from "./app/lib/getCurrentEpochTime";
import refreshToken from "./app/lib/refreshToken";
import { SIGN_IN_HANDLERS, SIGN_IN_PROVIDERS } from "./app/lib/signInProviders";

export interface WalletUser {
  public_id: string;
  username: string;
  email: string;
  orig_iat: number;
  otp_device_id: string | null;
}

const providers = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials): Promise<User | null> {
      const response = await fetch(`${API_PATH}/api/auth/signin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const cookies = await parseCookies(response);
      const [access_token, refresh_token] = cookies.map((cookie) => {
        if (cookie.name === "__clientid" || cookie.name === "__rclientid") {
          return cookie;
        }
      });

      const decodedToken = jwtDecode(
        access_token?.value as string,
      ) as WalletUser;
      const walletUser = {
        public_id: decodedToken.public_id,
        email: decodedToken.email,
        username: decodedToken.username,
        orig_iat: decodedToken.orig_iat,
        otp_device_id: decodedToken.otp_device_id,
      } as WalletUser;

      return {
        ...walletUser,
        access_token: access_token,
        refresh_token: refresh_token,
      } as User;
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

  // console.log('refresh() access token age: ', accessTokenExpiration);
  // console.log('refresh() refresh token age: ', refreshTokenExpiration);

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

export const authConfig = {
  callbacks: {
    // async authorized({ auth, request: { nextUrl } }) {
    //   const isAuthenticated = !!auth?.user;

    //   const isProtectedRoute = (
    //     await localizedRoutes(protectedRoutes)
    //   ).includes(nextUrl.pathname);

    //   const signOutPath = await localizedRoute(DEFAULT_SIGNED_OUT_PATH);
    //   const signInPath = await localizedRoute(DEFAULT_SIGNED_IN_PATH);

    //   if (isProtectedRoute) {
    //     if (isAuthenticated) {
    //       return true;
    //     }

    //     return Response.redirect(new URL(signOutPath, nextUrl));
    //   } else if (isAuthenticated) {
    //     return Response.redirect(new URL(signInPath, nextUrl));
    //   }

    //   return true;
    // },
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
      if (user && account?.type !== "credentials") {
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
        token.user = user;
        return token;
      }

      const refreshResult = await refresh(token);
      return refreshResult ? refreshResult : null;
    },
    session({ session, token }) {
      session.user.provider = token?.provider as string;
      const user = token.user as WalletUser;
      session.user = { ...session.user, ...user };
      return session;
    },
  },
  providers,
} satisfies NextAuthConfig;

export const providersList: string[] = providers.map((provider) => provider.id);
export const oauthProviders = providers.filter(
  (provider) => provider.id !== "credentials",
);
