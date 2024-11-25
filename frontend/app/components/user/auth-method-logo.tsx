import wallet from "@/app/assets/wallet.svg";
import { OAUTH_LOGOS } from "@/app/components/auth/oauth-logos";
import { providersList } from "@/auth.config";
import clsx from "clsx";
import Image from "next/image";
import { ReactNode } from "react";
import "./style.css";

export function AbsoluteLayout({
  children,
  position,
}: {
  children: ReactNode;
  position: string;
}) {
  return (
    <div
      className={clsx(
        "appear-from-void",
        "absolute size-6 flex justify-center items-center rounded-full",
        "bg-slate-300 dark:text-slate-600",
        position,
      )}
    >
      {children}
    </div>
  );
}

function CarteraAuthMethodLogo() {
  return (
    <AbsoluteLayout position="top-12 left-10">
      <Image src={wallet} width={20} height={20} alt="auth-method-logo" />
    </AbsoluteLayout>
  );
}

function OauthAuthMethodLogo({ provider }: { provider: string }) {
  return (
    <AbsoluteLayout position="top-8 left-6 lg:top-12 lg:left-10">
      {OAUTH_LOGOS[provider]}
    </AbsoluteLayout>
  );
}

type Props = {
  provider: (typeof providersList)[number];
};

export default function AuthMethodLogo({ provider }: Props) {
  if (provider == "credentials") {
    return <CarteraAuthMethodLogo />;
  }

  return <OauthAuthMethodLogo provider={provider} />;
}
