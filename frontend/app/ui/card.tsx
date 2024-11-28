import clsx from "clsx";
import React, { forwardRef } from "react";

type CardProps = { children: React.ReactNode; className?: string };

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        className,
        "shadow-black drop-shadow-lg lg:drop-shadow-2xl bg-white rounded-xl",
        "dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600",
      )}
    >
      {children}
    </div>
  );
});

export default Card;
