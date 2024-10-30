import wallet from "@/app/assets/wallet.svg";
import { Link } from "@/i18n/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function LogoHeader({
  position,
}: {
  position: "center" | "left" | "right";
}) {
  const locale = useLocale();
  return (
    <Link
      locale={locale}
      href={"/"}
      className={clsx(
        "group relative z-10 flex items-center",
        position == "center" && "justify-self-center",
        position == "left" && "justify-self-start",
        position == "right" && "justify-self-end"
      )}
    >
      <Image
        src={wallet}
        alt="wallet"
        className="block lg:hidden group-hover:opacity-75"
        height={32}
        width={32}
      />
      <Image
        src={wallet}
        alt="wallet"
        className="hidden lg:block group-hover:opacity-75"
        height={48}
        width={48}
      />
      <span className="ml-2 text-lg font-bold group-hover:text-white">
        Cartera
      </span>
    </Link>
  );
}
