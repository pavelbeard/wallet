import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export interface WalletUser {
  id?: string;
  public_id: string;
  username: string;
  email: string;
  image?: string;
  orig_iat: number;
  otp_device_id?: string;
  created_at?: string;
  verified?: boolean;
  provider?: string;
  is_oauth_user: boolean;
  is_two_factor_enabled: boolean;
  is_email_verified: boolean;
}

export interface AuthTokens {
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  expires_at: number;
}

declare module "next-auth" {
  interface User extends AuthTokens {
    user: WalletUser;
  }

  interface Session extends AuthTokens {
    user: WalletUser;
    refresh_token_err?: "RefreshTokenError";
  }

  interface JWT extends AuthTokens {
    user: WalletUser;
    refresh_token_err?: "RefreshTokenError";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
    verifyRequest: "/auth/sign-in/verify",
  },
});
