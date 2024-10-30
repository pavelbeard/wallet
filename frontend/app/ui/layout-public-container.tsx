import { LayoutProps } from "@/app/lib/types";
import { clsx } from "clsx";

export default function LayoutContainer({ children, color }: LayoutProps) {
  return (
    <main
      className={clsx(
        color,
        "grid justify-items-center grid-row-3-auto-1fr-auto min-h-screen w-full mx-auto items-center",
      )}
    >
      {children}
    </main>
  );
}
