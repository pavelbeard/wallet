"use client";

import Card from "@/app/ui/card";
import { Link } from "@/i18n/routing";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function DashboardCard({
  href,
  locale,
  children,
}: {
  href: string;
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={clsx(
        "group col-start-2 flex h-full w-full",
        "outline outline-slate-200 hover:outline-2 hover:outline-blue-400/60 dark:hover:outline-blue-400/60",
        "transition-all duration-200",
      )}
    >
      <Link
        className="flex flex-grow flex-col justify-between"
        href={href}
        locale={locale}
      >
        {children}
        <div
          className={clsx(
            "flex items-center justify-end p-4",
            "border-t border-slate-200",
            "group-hover:border-t-2 group-hover:border-blue-400/60 dark:group-hover:border-blue-400/60",
            "transition-all duration-200",
          )}
        >
          <ArrowRightIcon className="size-5 transition duration-200 group-hover:scale-110 group-hover:text-blue-400" />
        </div>
      </Link>
    </Card>
  );
}
