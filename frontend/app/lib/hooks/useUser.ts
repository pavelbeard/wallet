import { useSession } from "next-auth/react";

/**
 * Abstracts the user data from the session object.
 */
export default function useUser() {
  const session = useSession();

  return session?.data?.user;
}
