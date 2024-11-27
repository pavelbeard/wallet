"use client";

import { useSession } from "next-auth/react";

type Props = {};

export default function Client({}: Props) {
  const session = useSession();
  return (
    <div className="break-all max-w-64">{JSON.stringify(session)}</div>
  );
}
