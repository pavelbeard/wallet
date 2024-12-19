import { Link } from "@/i18n/routing";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function SideBarSignOut({
  liStyle,
  t,
  locale,
}: {
  liStyle: string;
  t: any;
  locale: any;
}) {
  return (
    <li className={clsx(liStyle)}>
      <Link
        locale={locale}
        href="/auth/sign-out"
        className="flex items-center gap-x-2 text-sm font-bold"
      >
        <ArrowLeftStartOnRectangleIcon className="size-6 group-hover:text-black" />
        {t("sidebar.signOut")}
      </Link>
    </li>
  );
}
