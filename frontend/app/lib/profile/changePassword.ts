"use server";

import query from "@/app/lib/helpers/query";
import { ChangePasswordSchema } from "@/app/lib/schemas.z";
import { z } from "zod";
import getUser from "../getUser";

export default async function changePassword(
  data: z.infer<typeof ChangePasswordSchema>,
) {
  const user = await getUser();
  const result = await query({
    url: `/users/${user?.public_id}/change_password/`,
    method: "POST",
    body: data,
  });

  if (result instanceof Error) {
    return {
      error: "Something went wrong...",
      success: null,
    };
  }

  if (result?.response.ok) {
    return {
      error: null,
      success: "Password changed!",
    };
  }

  if (result?.response.status === 400) {
    return {
      error: "Passwords aren't match.",
      success: null,
    };
  }

  return {
    success: null,
    error: null,
  };
}
