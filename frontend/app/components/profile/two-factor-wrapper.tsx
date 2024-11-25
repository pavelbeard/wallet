import getUser from "@/app/lib/getUser";
import { TOTPData } from "@/app/lib/types";
import TwoFactorConfiguration from "./two-factor";

export default async function TwoFactorCard({ totpData }: { totpData: TOTPData }) {
  const user = await getUser();
  if (user?.provider == "credentials") {
    return (
      <TwoFactorConfiguration
        config_key={totpData.config_key}
        detail={totpData.detail}
      />
    );
  }

  return null;
}
