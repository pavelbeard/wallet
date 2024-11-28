const row =
  "flex flex-col md:flex-row md:justify-between md:items-center [&>span]:h-[20px]";

export default function UserCardEmailSkeleton() {
  return <div className={row}>
    <span className="w-40 animate-pulse bg-slate-200 dark:bg-slate-400 rounded-lg"></span>
    <span className="w-40 animate-pulse bg-slate-200 dark:bg-slate-400 rounded-lg"></span>
  </div>;
}
