import { UserDevice } from "@/app/lib/profile/getDevices";
import { LocaleProps } from "@/i18n/types";
import { getTranslations } from "next-intl/server";

type DeviceProps = { device: UserDevice } & LocaleProps;

export default async function Device({
  params: { locale },
  device,
}: DeviceProps) {
  const t = await getTranslations({
    locale,
  });
  return (
    <div className="flex flex-col gap-2 p-2 lg:flex-row">
      <img
        src={device.d_device.icon}
        alt={device.d_device.d_name}
        className="size-8 lg:size-12"
      />
      <section className="flex flex-col gap-1 [&>p]:text-xs [&>p]:text-slate-500 dark:[&>p]:text-slate-300">
        <div className="grid grid-cols-2 items-center justify-between [&>p]:text-xs">
          <p>{device.d_device.d_name}</p>
          {device.is_actual_device && <p>{t("profile.devices.active")}</p>}
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-1 [&>p]:text-xs [&>p]:text-slate-500 dark:[&>p]:text-slate-300">
            <p className="text-sm">
              <b>{t("profile.devices.location")}:</b> {device.location}
            </p>
            <p>
              <b>{t("profile.devices.ipAddress")}:</b> {device.d_ip_address}
            </p>
          </div>
          <div className="flex flex-col gap-1 [&>p]:text-xs [&>p]:text-slate-500 dark:[&>p]:text-slate-300">
            <p>
              <b>{t("profile.devices.operationalSystem")}:</b>{" "}
              {device.operational_system}
            </p>
            <p className="text-sm">
              <b>{t("profile.devices.lastAccess")}:</b>{" "}
              {new Date(device.last_access).toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
