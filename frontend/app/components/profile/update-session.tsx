"use client";

import CustomButton from "@/app/ui/button-custom";
import { useSession } from "next-auth/react";

type Props = {};

export default function UpdateSession({}: Props) {
  const { update } = useSession();
  const session = useSession();
  return (
    <div>
      <CustomButton
        onClick={() =>
          update({ access_token: "ixmath900", access_token_exp: 900 })
        }
      >
        Update
      </CustomButton>
    </div>
  );
}
