import wallet from "@/app/assets/wallet.svg";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col justify-center items-center max-lg:my-8">
      <Image src={wallet} alt="wallet" height={256} width={256} />
      <span className="text-2xl font-bold group-hover:text-gray-600">
        Cartera
      </span>
    </div>
  );
}
