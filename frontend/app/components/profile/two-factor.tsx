"use client";

import useUser from "@/app/lib/hooks/useUser";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import TwoFactorConfiguration from "./two-factor-configuration";
import TwoFactorDelete from "./two-factor-delete";
import TwoFactorTemplate from "./two-factor-template";

export default function TwoFactor() {
  const user = useUser();
  const t = useTranslations();
  const active = t("profile.twofactor.active");
  const notActive = t("profile.twofactor.notActive");
  return (
    <>
      <div
        className={clsx(
          "rounded-lg w-full px-4 py-2",
          "border h-16",
          user?.otp_device_id
            ? "border-green-500 bg-green-100 dark:bg-green-500/40"
            : "border-yellow-500 bg-yellow-100 dark:bg-yellow-500/40",
        )}
      >
        {t.rich("profile.twofactor.2faState", {
          bold: user?.otp_device_id ? active : notActive,
          important: (chunks) => <b>{chunks}</b>,
        })}
      </div>
      {user?.otp_device_id ? (
        <TwoFactorTemplate>
          <TwoFactorDelete />
        </TwoFactorTemplate>
      ) : (
        user?.provider == "credentials" && (
          <div className="flex flex-col gap-4 items-center justify-center">
            <p className="text-center text-lg font-bold">
              {t("profile.twofactor.2faStartConfig")}
            </p>
            <div className="w-full">
              <TwoFactorTemplate>
                <TwoFactorConfiguration />
              </TwoFactorTemplate>
            </div>
          </div>
        )
      )}
    </>
  );
}
