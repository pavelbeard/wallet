import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { Link } from "@/i18n/routing";
import { UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function SideBarProfile({
  liStyle,
  t,
  locale,
}: {
  liStyle: string;
  t: any;
  locale: any;
}) {
  const isDesktop = useDesktopBreakpoint();

  return (
    !isDesktop && (
      <li className={clsx(liStyle)}>
        <Link
          locale={locale}
          href="/profile"
          className="flex items-center gap-x-2 text-sm font-bold"
        >
          <UserIcon className="size-5 group-hover:text-black" />
          {t("sidebar.profile")}
        </Link>
      </li>
    )
  );
}
