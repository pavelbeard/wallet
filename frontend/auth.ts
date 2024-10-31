import NextAuth from "next-auth";
import { Cookie } from "set-cookie-parser";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface User {
    access_token?: Cookie;
    refresh_token?: Cookie;
    provider?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
});
