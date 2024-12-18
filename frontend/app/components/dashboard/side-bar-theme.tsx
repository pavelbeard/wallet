import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import ChangeTheme from "../utils/change-theme";

export default function SideBarTheme({
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
        <div className="flex items-center justify-between gap-x-2 text-sm font-bold">
          <div className="flex items-center gap-x-2">
            <LightBulbIcon className="size-5 group-hover:text-black" />
            {t("sidebar.theme")}
          </div>
          <ChangeTheme />
        </div>
      </li>
    )
  );
}
