"use server";

import { auth } from "@/auth";

export default async function getAccessToken() {
  const session = await auth();
  return session?.access_token as string;
}
