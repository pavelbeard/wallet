import clsx from "clsx";
import { ReactNode } from "react";

type Props = { color?: string; children: ReactNode; onClick: () => void };

export default function CustomButton({ color, children, onClick }: Props) {
  return (
    <button
      className={clsx(
        !color ? "bg-slate-300 dark:bg-slate-500" : color,
        "px-2 py-1 w-full  rounded-lg",
        "hover:bg-slate-400 hover:text-slate-100",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
