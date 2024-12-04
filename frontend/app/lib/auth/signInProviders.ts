import { API_PATH } from "@/app/lib/helpers/constants";
import { CredentialInput } from "@auth/core/providers";
import { Account, Profile, User } from "next-auth";
import getUserDataJson from "../helpers/getUserDataJson";

type Provider = {
  user: User;
  account: Account | null;
  profile: Profile | undefined;
  email: { verificationRequest?: boolean | undefined } | undefined;
  credentials: Record<string, CredentialInput> | undefined;
};

type Handler = ({
  user,
  account,
  profile,
  email,
  credentials,
}: Provider) => Promise<boolean | string>;

export const SIGN_IN_HANDLERS: { [index: string]: Handler } = {
  credentials: async ({
    user,
    account,
    profile,
    email,
    credentials,
  }): Promise<boolean | string> => {
    return true;
  },
  google: async ({ account }: Provider): Promise<boolean | string> => {
    try {
      const result = await fetch(`${API_PATH}/api/oauth2/signin_with_google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: account?.access_token }),
        credentials: "include",
      });

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

      // @ts-expect-error access_token is necessary
      account.access_token = access_token;
      // @ts-expect-error refresh_token is necessary
      account.refresh_token = refresh_token;
      // @ts-expect-error access token expiration is necessary
      account.access_token_exp = access_token_exp;
      // @ts-expect-error refresh token expiration is necessary as well
      account.expires_at = expires_at;
      // @ts-expect-error user is necessary
      account.user = walletUser;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export const SIGN_IN_PROVIDERS: string[] = Object.keys(SIGN_IN_HANDLERS);
