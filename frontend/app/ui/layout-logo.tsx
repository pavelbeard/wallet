import clsx from "clsx";
import LogoHeader from "./logo-header";

export function LayoutLogo() {
  return (
    <div
      className={clsx(
        "p-4 border-b-[1px] border-gray-300 bg-slate-100 drop-shadow-md shadow-black",
        "lg:border-r-[1px]",
      )}
    >
      <LogoHeader position="left" />
    </div>
  );
}
