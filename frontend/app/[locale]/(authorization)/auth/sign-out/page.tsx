"use client";

import protectedQuery from "@/app/lib/helpers/protectedQuery";
import Card from "@/app/ui/card";
import { useRouter } from "@/i18n/routing";
import { DEFAULT_SIGNED_OUT_PATH } from "@/routes";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Page() {
  const session = useSession();
  const t = useTranslations("auth");
  const router = useRouter();
  const signOutAction = async () => {
    await signOut({ redirect: false });

    await protectedQuery({
      url: "/auth/signout/",
      method: "POST",
      body: {
        refresh_token: session.data?.refresh_token,
      },
    });

    router.push({ pathname: DEFAULT_SIGNED_OUT_PATH });
  };

  useEffect(() => {
    signOutAction();
  });

  return (
    <Card className="my-12 w-3/4 p-6 lg:w-1/3">
      <div className="flex justify-center p-6">{t("page.signOut")}</div>
    </Card>
  );
}
