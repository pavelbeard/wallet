"use client";

import signOutAction from "@/app/lib/auth/signOutAction";
import Card from "@/app/ui/card";
import { useRouter } from "@/i18n/routing";
import { DEFAULT_SIGNED_OUT_PATH } from "@/routes";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Page() {
  const session = useSession();
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    signOutAction({
      refresh_token: session?.data?.refresh_token as string,
    }).finally(() => {
      router.push({ pathname: DEFAULT_SIGNED_OUT_PATH });
    });
  });

  return (
    <Card className="my-12 w-3/4 p-6 lg:w-1/3">
      <div className="flex justify-center p-6">{t("auth.page.signOut")}</div>
    </Card>
  );
}
