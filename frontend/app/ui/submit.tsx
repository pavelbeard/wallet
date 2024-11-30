import { clsx } from "clsx";
import React from "react";

type Props = { children: React.ReactNode; color?: string; disabled?: boolean };

export default function Submit({
  children,
  color = "bg-slate-800",
  disabled = false,
}: Props) {
  return (
    <button
      className={clsx(
        color,
        "text-white w-full p-2 h-10 text-sm rounded-xl font-bold",
        "dark:text-slate-800 dark:bg-gray-100",
      )}
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
