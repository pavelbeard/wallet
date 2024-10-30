"use client";

import Card from "@/app/ui/card";
import { useRouter } from "@/i18n/routing";
import { DEFAULT_SIGNED_OUT_PATH } from "@/routes";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Page() {
  const t = useTranslations("auth");
  const router = useRouter();
  const signOutAction = async () => {
    await signOut({ redirect: false });
    router.push({ pathname: DEFAULT_SIGNED_OUT_PATH });
  };

  useEffect(() => {
    signOutAction();
  });

  return (
    <Card>
      <div className="p-6 flex justify-center">{t("page.signOut")}</div>
    </Card>
  );
}
