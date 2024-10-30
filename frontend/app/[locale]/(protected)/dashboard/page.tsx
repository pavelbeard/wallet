import Client from "@/app/components/dashboard/client";
import { auth } from "@/auth";
import { LocaleProps } from "@/i18n/types";

export default async function Page({ params: { locale } }: LocaleProps) {
  const session = await auth();
  return (
    <div>
      <div className="p-4">Dashboard</div>
      <div className="p-4">Server:</div>
      <div className="break-all max-w-64">{JSON.stringify(session)}</div>
      <div className="p-4">Client:</div>
      <Client />
    </div>
  );
}
