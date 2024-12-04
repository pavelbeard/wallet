import getDevices from "@/app/lib/profile/getDevices";
import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import Device from "./device";

type DevicesProps = { params: { locale: string } };

export default async function Devices({ params: { locale } }: DevicesProps) {
  const t = await getTranslations({
    locale,
  });
  const { data, error } = await getDevices();

  return (
    <section className="col-span-2 flex flex-col gap-4">
      <div className="flex items-center gap-2 p-2">
        <DeviceTabletIcon className="size-6" />
        <h1 className="text-lg font-bold">{t("profile.devices.title")}</h1>
      </div>
      <div
        className={clsx(
          "flex flex-col gap-2 p-2",
          "rounded-xl border border-slate-800 bg-slate-300 dark:border-slate-600 dark:bg-slate-500",
        )}
      >
        {/* TODO: make the table responsive */}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {Array.isArray(data) &&
          data.map((device, index) => (
            <div key={`${device.wallet_user.public_id}${index}`}>
              <Device params={{ locale }} device={device} />
            </div>
          ))}
      </div>
    </section>
  );
}
