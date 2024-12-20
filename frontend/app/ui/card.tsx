import clsx from "clsx";
import React, { forwardRef } from "react";

type CardProps = { children: React.ReactNode; className?: string };

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          "rounded-xl bg-white shadow-black drop-shadow-lg lg:drop-shadow-xl",
          "dark:border dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100",
        )}
      >
        {children}
      </div>
    );
  },
);

export default Card;
