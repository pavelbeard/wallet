import { clsx } from "clsx";
import React from "react";

type Props = {
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  [x: string]: unknown;
};

export default function Submit({
  children,
  color = "bg-slate-800",
  disabled = false,
  testId,
  ariaLabel,
  ...rest
}: Props & { testId?: string; ariaLabel: string }) {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx(
        color,
        "h-10 w-full rounded-xl p-2 text-sm font-bold text-white",
        "dark:bg-gray-100 dark:text-slate-800",
      )}
      type="submit"
      disabled={disabled}
      data-testid={testId}
      {...rest}
    >
      {children}
    </button>
  );
}
