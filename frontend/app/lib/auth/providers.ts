import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/app/lib/helpers/constants";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";
import { User } from "next-auth";
import CustomHeaders from "../helpers/getHeaders";
import getUserDataJson from "../helpers/getUserDataJson";
import query from "../helpers/query";

const providers = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials): Promise<User | null> {
      const result = await query({
        url: "/auth/signin/",
        method: "POST",
        headers: await CustomHeaders.getHeaders(),
        body: credentials,
      });

      if (result instanceof Error) return null;

      if (!result?.ok) return null;

      const { access, refresh } = (await result.json()) as {
        access: string;
        refresh: string;
      };

      const {
        user: walletUser,
        access_token,
        refresh_token,
        access_token_exp,
        expires_at,
      } = await getUserDataJson(access, refresh);

      return {
        access_token,
        refresh_token,
        access_token_exp,
        expires_at,
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
