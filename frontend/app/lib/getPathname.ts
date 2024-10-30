import { headers } from "next/headers";

export default async function getPathname() {
  return headers().get("x-pathname");
}
