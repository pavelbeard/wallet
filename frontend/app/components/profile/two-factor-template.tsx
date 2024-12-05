import useUser from "@/app/lib/hooks/ui/useUser";
import clsx from "clsx";

export default function TwoFactorTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  return (
    <div
      className={clsx(
        "h-16 flex flex-col items-start md:grid",
        user?.is_two_factor_enabled
          ? "md:grid-cols-[80px_1fr_120px_120px]"
          : "md:grid-cols-[80px_1fr_120px]",
        "md:grid-rows-1 md:items-center gap-4 p-2 ",
        "border border-slate-600 bg-slate-100 dark:bg-slate-500/40 rounded-lg",
        "[&>button]:text-sm",
      )}
    >
      {children}
    </div>
  );
}
