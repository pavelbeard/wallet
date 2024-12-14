"use server";

import protectedQuery from "../helpers/protectedQuery";

const signOutAction = async ({ refresh_token }: { refresh_token: string }) => {
  await protectedQuery({
    url: "/auth/signout/",
    method: "POST",
    body: {
      refresh_token: refresh_token,
    },
  });
};

export default signOutAction;
