import {
  jwtCallback,
  sessionCallback,
  signInCallback,
} from "@/app/lib/auth/callbacks";
import providers from "@/app/lib/auth/providers";
import { NextAuthConfig } from "next-auth";

export const authConfig = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const result = await signInCallback({
        user,
        account,
        profile,
        email,
        credentials,
      });
      return result;
    },
    async jwt({ token, user, account, session, trigger }) {
      const result = await jwtCallback({
        token,
        user,
        account,
        session,
        trigger,
      });

      if (result) {
        const newToken = { ...token, ...result };
        return newToken;
      }

      return null;
    },
    session({ session, token, user, trigger, newSession }) {
      const result = sessionCallback({
        session,
        token,
        user,
        trigger,
        newSession,
      });
      const updatedSession = { ...session, ...result };
      return updatedSession;
    },
  },
  providers,
} satisfies NextAuthConfig;

export const providersList: string[] = providers.map((provider) => provider.id);
export const oauthProviders = providers.filter(
  (provider) => provider.id !== "credentials",
);
