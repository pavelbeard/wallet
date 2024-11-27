import clsx from "clsx";

export default function TwoFactorTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-start md:grid md:grid-cols-[80px_1fr_120px] md:grid-rows-1 md:items-center gap-4 p-2 ",
        "border-t border-b border-slate-800 dark:border-slate-300",
      )}
    >
      {children}
    </div>
  );
}
