"use server";

import { localizedRoute } from "@/app/lib/routeActions";
import { signIn } from "@/auth";
import { DEFAULT_SIGNED_IN_PATH } from "@/routes";

export default async function signInWithOauth(provider: string) {
  const signedInDefaultRoute = await localizedRoute(DEFAULT_SIGNED_IN_PATH);
  await signIn(provider, { redirectTo: signedInDefaultRoute });
}
