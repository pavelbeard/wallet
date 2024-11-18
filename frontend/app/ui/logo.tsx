import wallet from "@/app/assets/wallet.svg";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="lg:absolute flex items-center top-8 left-8 max-lg:my-8">
      <Image src={wallet} alt="wallet" height={48} width={48} />
      <span className="ml-2 text-lg font-bold group-hover:text-gray-600 dark:text-gray-100">
        Cartera
      </span>
    </div>
  );
}
