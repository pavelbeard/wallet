import {
  API_PATH,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/app/lib/helpers/constants";
import parseCookies from "@/app/lib/helpers/parseCookies";
import { WalletUser } from "@/auth";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";
import { jwtDecode } from "jwt-decode";
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
        created_at: decodedToken.created_at,
      } as WalletUser;

      return {
        ...walletUser,
        access_token,
        refresh_token,
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
