"use server";

import { signOut } from "next-auth/react";
import protectedQuery from "../helpers/protectedQuery";

const signOutAction = async ({ refresh_token }: { refresh_token: string }) => {
  await protectedQuery({
    url: "/auth/signout/",
    method: "POST",
    body: {
      refresh_token: refresh_token,
    },
  });

  await signOut({ redirect: false });
};

export default signOutAction;
