import CopyrightIcon from "@/app/components/icons/copyright-icon";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import ChangeLanguageSkeleton from "../utils/change-language-skeleton";

const ChangeLanguage = dynamic(
  () => import("@/app/components/utils/change-language"),
  {
    ssr: false,
    loading: () => {
      return <ChangeLanguageSkeleton />;
    },
  },
);

type FooterProps = {
  params: { locale: string };
};

export default async function Footer({ params: { locale } }: FooterProps) {
  const t = await getTranslations({
    locale,
  });
  return (
    <footer className="flex h-64 lg:h-32 w-full flex-col items-start justify-between p-8 gap-4 text-sm lg:flex-row lg:items-center lg:px-32">
      <section className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
        <p className="flex items-center gap-2">
          <CopyrightIcon /> heavycream9090.
        </p>
        <p className="text-sm">Cartera.</p>
        <p className="text-sm">{t("footer.rights")}</p>
      </section>
      <section className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
        <ChangeLanguage href="/" params={{ locale }} />
        <div>Change theme</div>
      </section>
    </footer>
  );
}
