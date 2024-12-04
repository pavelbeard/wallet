"use client";

import useClickOutside from "@/app/lib/hooks/useClickOutside";
import Card from "@/app/ui/card";
import clsx from "clsx";
import { useEffect } from "react";
import CloseModalButton from "./close-btn";

type Props = { closeCallback: () => void; children: React.ReactNode };

export default function Modal({ closeCallback, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const ref = useClickOutside<HTMLDivElement>(closeCallback);
  return (
    <div
      className={clsx(
        "fixed left-0 top-0 z-[100] flex h-full w-full flex-col items-center justify-center overflow-y-auto",
        "bg-black/40",
      )}
    >
      <Card
        ref={ref}
        className={clsx(
          "row-start-2 flex flex-col gap-y-4 bg-slate-200 dark:bg-slate-800",
          "text-slate-800 dark:border-[0.5px] dark:border-slate-600 dark:text-slate-300",
          "mx-4",
          "rounded-md",
        )}
      >
        <CloseModalButton onClose={closeCallback} />
        {children}
      </Card>
    </div>
  );
}

export function FullscreenModal({ closeCallback, children }: Props) {
  return (
    <div
      className={clsx(
        "absolute left-0 top-0 min-h-screen w-full bg-slate-300 dark:bg-slate-800",
        "text-slate-800 dark:text-gray-100",
      )}
    >
      <CloseModalButton onClose={closeCallback} />
      {children}
    </div>
  );
}
