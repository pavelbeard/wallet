import wallet from "@/app/assets/wallet.svg";
import { OAUTH_LOGOS } from "@/app/components/auth/oauth-logos";
import Image from "next/image";
import { ReactNode } from "react";

function AbsoluteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-12 left-10 size-6 flex justify-center items-center rounded-full bg-slate-300">
      {children}
    </div>
  );
}

function CarteraAuthMethodLogo() {
  return (
    <AbsoluteLayout>
      <Image src={wallet} width={20} height={20} alt="auth-method-logo" />
    </AbsoluteLayout>
  );
}

function OauthAuthMethodLogo({ provider }: { provider: string }) {
  return <AbsoluteLayout>{OAUTH_LOGOS[provider]}</AbsoluteLayout>;
}

export const AUTH_METHOD_LOGO: { [x: string]: ReactNode } = {
  credentials: <CarteraAuthMethodLogo />,
  google: <OauthAuthMethodLogo provider="Google" />,
};
