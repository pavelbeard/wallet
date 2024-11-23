import CopyrightIcon from "@/app/components/icons/copyright-icon";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
  });
  return (
    <footer className="h-32 flex items-center justify-between w-full max-lg:mt-8 px-8 lg:px-32">
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
      <p className="flex items-center gap-2 text-sm"><CopyrightIcon /> heavycream9090.</p>
        <p className="text-sm">Cartera.</p>
        <p className="text-sm">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
