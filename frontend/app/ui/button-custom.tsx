import clsx from "clsx";
import { ReactNode } from "react";

type Props = { color?: string; children: ReactNode; onClick: () => void };

export default function CustomButton({
  color,
  children,
  onClick,
  disabled,
}: Props & { disabled?: boolean }) {
  return (
    <button
      className={clsx(
        !color ? "bg-slate-300 dark:bg-slate-500" : color,
        "w-full rounded-lg px-2 py-1",
        "hover:bg-slate-400 hover:text-slate-100",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
