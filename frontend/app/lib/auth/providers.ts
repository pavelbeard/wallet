import {
  API_PATH,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/app/lib/helpers/constants";
import getUserData from "@/app/lib/helpers/getUserData";
import parseCookies from "@/app/lib/helpers/parseCookies";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";
import { User } from "next-auth";

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

      if (!response.ok) return null;

      const cookies = await parseCookies(response);
      const {
        user: walletUser,
        access_token,
        refresh_token,
        access_token_exp,
        refresh_token_exp,
      } = await getUserData(cookies);

      return {
        access_token,
        refresh_token,
        access_token_exp,
        refresh_token_exp,
        user: {
          ...walletUser,
        },
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

export default providers;
