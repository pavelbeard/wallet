import { API_PATH } from "@/app/lib/helpers/constants";
import { CredentialInput } from "@auth/core/providers";
import { Account, Profile, User } from "next-auth";

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
      await fetch(`${API_PATH}/api/oauth2/signin_with_google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: account?.access_token }),
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export const SIGN_IN_PROVIDERS: string[] = Object.keys(SIGN_IN_HANDLERS);
