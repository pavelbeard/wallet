import { WalletUser } from "@/auth";
import CustomHeaders from "../helpers/getHeaders";
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
  is_actual_device: boolean;
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
    headers: await CustomHeaders.getHeaders(),
    credentials: "include",
  });

  if (response instanceof Error) {
    return {
      success: null,
      error: "Something went wrong...",
    };
  }

  if (!response?.ok) {
    return {
      success: null,
      error: "Unauthorized",
    };
  }

  const devices = (await response.json()) as UserDevice[];

  return {
    success: true,
    data: devices,
    error: null,
  };
}
