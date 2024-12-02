import getDevices from "@/app/lib/profile/getDevices";
import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";

type DevicesProps = { params: { locale: string } };

export default async function Devices({ params: { locale } }: DevicesProps) {
  const t = await getTranslations({
    locale,
  });
  const { data, error } = await getDevices();

  return (
    <section className="flex flex-col gap-4 col-span-2">
      <div className="p-2 flex gap-2 items-center">
        <DeviceTabletIcon className="size-6" />
        <h1 className="text-lg font-bold">{t("profile.devices.title")}</h1>
      </div>
      <div
        className={clsx(
          "p-2 flex flex-col gap-2",
          "bg-slate-300 dark:bg-slate-600 rounded-xl",
        )}
      >
        {/* TODO: make the table responsive */}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {Array.isArray(data) && (
          <table className="w-full text-sm text-left text-gray-500">
            <thead>
              <tr className="[&>th]:text-sm [&>th]:text-slate-800 dark:[&>th]:text-slate-200">
                <th className="p-2 font-bold">{t("profile.devices.device")}</th>
                <th className="p-2 font-bold">
                  {t("profile.devices.operationalSystem")}
                </th>
                <th className="p-2 font-bold">
                  {t("profile.devices.ipAddress")}
                </th>
                <th className="p-2 font-bold">
                  {t("profile.devices.location")}
                </th>
                <th className="p-2 font-bold">
                  {t("profile.devices.lastAccess")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((device, index) => (
                <tr
                  className={clsx(
                    "[&>td]:text-sm [&>td]:text-slate-800 dark:[&>td]:text-slate-200",
                    "odd:bg-slate-100 dark:odd:bg-slate-800 rounded-lg",
                  )}
                  key={`${device.wallet_user.public_id}${index}`}
                >
                  <td className="p-2 flex items-center gap-x-2">
                    <img
                      src={device.d_device.icon}
                      alt="device icon"
                      width={16}
                      height={16}
                    />
                    {device.d_device.d_name}
                  </td>
                  <td className="p-2">{device.operational_system}</td>
                  <td className="p-2">{device.d_ip_address}</td>
                  <td className="p-2">{device.location}</td>
                  <td className="p-2">
                    {new Date(device.last_access).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
