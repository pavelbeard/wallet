import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import { getTranslations } from "next-intl/server";

type DevicesProps = { params: { locale: string } };

export default async function Devices({ params: { locale } }: DevicesProps) {
  const t = await getTranslations({
    locale,
  });
  return (
    <section className="flex flex-col gap-4">
      <div className="p-2 flex gap-2 items-center">
        <DeviceTabletIcon className="size-6" />
        <h1 className="text-lg font-bold">{t("profile.devices.title")}</h1>
      </div>
    </section>
  );
}
