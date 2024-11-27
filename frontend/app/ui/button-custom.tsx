import clsx from "clsx";
import { ReactNode } from "react";

type Props = { children: ReactNode; onClick: () => void };

export default function CustomButton({ children, onClick }: Props) {
  return (
    <button
      className={clsx(
        "px-2 py-1 w-full bg-slate-300 dark:bg-slate-600 rounded-lg",
        "hover:bg-slate-400 hover:text-slate-100",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
