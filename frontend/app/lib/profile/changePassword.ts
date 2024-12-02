"use server";

import { ChangePasswordSchema } from "@/app/lib/schemas.z";
import { z } from "zod";
import getUser from "../getUser";
import protectedQuery from "../helpers/protectedQuery";

export default async function changePassword(
  data: z.infer<typeof ChangePasswordSchema>,
) {
  const user = await getUser();
  const result = await protectedQuery({
    url: `/users/${user?.public_id}/change_password/`,
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: data,
  });

  if (result instanceof Error) {
    return {
      error: "Something went wrong...",
      success: null,
    };
  }

  if (!result?.response.ok) {
    const errorData = await result.json;
    return {
      // @ts-expect-error itemType as {error: {<field>: [ '<message>' ]}}
      error: Object.values(Object.values(errorData)[0])[0][0],
      success: null,
    };
  }

  if (result?.response.ok) {
    return {
      error: null,
      success: "Password changed!",
    };
  }

  return {
    success: null,
    error: null,
  };
}
