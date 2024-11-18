import clsx from "clsx";
import React from "react";

type CardProps = { children: React.ReactNode, className?: string };

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx(
      className,
      "shadow-black drop-shadow-lg lg:drop-shadow-2xl bg-white rounded-xl",
      "dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600 dark:border-[1px]"
    )}>
      {children}
    </div>
  );
}
