import { clsx } from "clsx";

// It necessary to have 'group' in the className attribute of the element,
// that wraps the component
export default function Underline() {
  return (
    <span
      className={clsx(
        "block h-[0.8px] max-w-0 group-hover:max-w-full",
        "bg-slate-800 dark:bg-slate-100 transition-all duration-500",
      )}
    />
  );
}
