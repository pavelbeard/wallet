import { API_PATH } from "@/app/lib/constants";
import { Account, Profile, User } from "next-auth";

const SIGN_IN_HANDLERS = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  credentials: async (
    user: User,
    account: Account,
    profile: Profile,
    email: string,
    credentials: unknown,
  ) => {
    return true;
  },
  google: async (
    user: User,
    account: Account,
    profile: Profile,
    email: string,
    credentials: unknown,
  ) => {
    try {
      const response = await fetch(`${API_PATH}/api/stuff/auth-google/`, {
        method: "POST",
        body: JSON.stringify({ data: { access_token: account.id_token } }),
      });

      const json = await response.json();
      return json.data();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export const 
