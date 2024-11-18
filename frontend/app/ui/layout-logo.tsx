import clsx from "clsx";
import LogoHeader from "./logo-header";

export function LayoutLogo() {
  return (
    <div
      className={clsx(
        "flex items-center justify-start",
        "p-4 border-b-[1px] border-gray-300 bg-slate-100 drop-shadow-md shadow-black",
        "dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600",
        "lg:border-r-[1px]",
      )}
    >
      <LogoHeader position="left" />
    </div>
  );
}
