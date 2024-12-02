import { WalletUser } from "@/auth";
import protectedQuery from "../helpers/protectedQuery";

type WalletUserPartial = Partial<WalletUser>;

export interface UserDevice {
  wallet_user: WalletUserPartial;
  d_device: DDevice;
  operational_system: string;
  d_ip_address: string;
  location: string;
  created_at: Date;
  last_access: Date;
}

export interface DDevice {
  id: number;
  d_name: string;
  icon: string;
}

export default async function getDevices() {
  const response = await protectedQuery({
    url: "/devices/",
    method: "GET",
    credentials: "include",
  });

  if (response instanceof Error) {
    return {
      success: null,
      error: "Something went wrong...",
    };
  }

  if (!response?.response.ok) {
    return {
      success: null,
      error: "Unauthorized",
    };
  }

  return {
    success: true,
    data: response.json as UserDevice[],
    error: null,
  };
}
