import query from "./helpers/query";
import { TOTPData } from "./types";

export default async function getTotpData(): Promise<TOTPData> {
  const data = await query({ url: "/2fa/create_totp_device/", method: "POST" });
  return data;
}
