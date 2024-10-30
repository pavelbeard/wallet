import { AUTH_METHOD_LOGO } from "@/app/ui/auth-method-logo";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = { src?: string | null; provider: string | "Credentials" };

function UserAvatar({ src, provider }: Props) {
  return src ? (
    <>
      <div className="hidden lg:block relative">
        <Image
          className="rounded-full"
          src={src}
          alt="user-avatar"
          width={64}
          height={64}
        />
        {AUTH_METHOD_LOGO[provider]}
      </div>
      <div className="block lg:hidden relative">
        <Image
          className="rounded-full"
          src={src}
          alt="user-avatar"
          width={48}
          height={48}
        />
        {AUTH_METHOD_LOGO[provider]}
      </div>
    </>
  ) : (
    <div className="relative rounded-full flex justify-center items-center bg-gray-100 size-16 border-[1px] border-gray-300">
      <UserCircleIcon width={48} height={48} />
      {AUTH_METHOD_LOGO[provider]}
    </div>
  );
}

export default UserAvatar;
