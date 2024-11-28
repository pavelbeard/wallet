export default function TwoFactorSkeleton() {
  return (
    <div className="w-full h-40 flex flex-col gap-4">
      <div className="w-full h-16 border border-yellow-500 bg-yellow-100 dark:bg-yellow-500/40 animate-pulse rounded-lg" />
      <div className="w-full h-16 border border-slate-600 bg-slate-100 dark:bg-slate-500/40 animate-pulse rounded-lg" />
    </div>
  );
}
