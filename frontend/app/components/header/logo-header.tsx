import wallet from "@/app/assets/wallet.svg";
import { Link } from "@/i18n/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function LogoHeader({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <Link
      locale={locale}
      href={"/"}
      className={clsx("group relative z-50", className)}
    >
      <Image
        aria-label="Cartera Home Page | desktop"
        src={wallet}
        alt="wallet"
        className="hidden group-hover:opacity-75 lg:block"
        height={48}
        width={48}
      />
      <Image
        aria-label="Cartera Home Page | mobile"
        src={wallet}
        alt="wallet"
        className="block group-hover:opacity-75 lg:hidden"
        height={32}
        width={32}
      />
      <span className="ml-2 text-lg font-bold group-hover:text-slate-400 dark:group-hover:text-white">
        Cartera
      </span>
    </Link>
  );
}
