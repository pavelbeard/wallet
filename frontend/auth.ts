import NextAuth, { type DefaultSession } from "next-auth";
import { Cookie } from "set-cookie-parser";
import { authConfig } from "./auth.config";

export interface WalletUser {
  public_id: string;
  username: string;
  email: string;
  orig_iat: number;
  otp_device_id: string | null;
  created_at: string | null;
}

declare module "next-auth" {
  interface User extends WalletUser {
    access_token?: Cookie;
    refresh_token?: Cookie;
    provider?: string;
  }

  interface Session extends DefaultSession {
    access_token?: string;
    access_token_exp?: number;
    refresh_token?: string;
    refresh_token_exp?: number;
    user?: User;
  }

  interface JWT {
    access_token: Cookie;
    refresh_token: Cookie;
    access_token_exp: number;
    refresh_token_exp: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
});
