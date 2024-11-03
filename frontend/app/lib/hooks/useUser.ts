import { useSession } from "next-auth/react";

export default function useUser() {
  const session = useSession();

  return session?.data?.user;
}
