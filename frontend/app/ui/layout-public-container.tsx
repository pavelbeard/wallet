import { LayoutProps } from "@/app/lib/types";
import { clsx } from "clsx";

export default function LayoutPublicContainer({ children, color }: LayoutProps) {
  return (
    <main
      className={clsx(
        color,
        "grid justify-items-center grid-row-[auto_1fr_auto] min-h-screen w-full mx-auto items-center",
      )}
    >
      {children}
    </main>
  );
}
