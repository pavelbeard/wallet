"use client";

import useClickOutside from "@/app/lib/hooks/useClickOutside";
import { useOverflow } from "@/app/lib/store/useOverflowControlStore";
import Card from "@/app/ui/card";
import clsx from "clsx";
import { useEffect } from "react";
import CloseModalButton from "./close-btn";

type Props = { closeCallback: () => void; children: React.ReactNode };

export default function Modal({ closeCallback, children }: Props) {
  const { setOverflowAuto, setOverflowHidden, isOverflowHidden } =
    useOverflow();

  useEffect(() => {
    setOverflowHidden();
  }, [setOverflowHidden]);

  const ref = useClickOutside<HTMLDivElement>(closeCallback);
  return (
    <div
      className={clsx(
        "absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center",
        " bg-black/40 ",
      )}
    >
      <Card
        ref={ref}
        className={clsx(
          "row-start-2flex flex-col gap-y-4 bg-slate-200 dark:bg-slate-800",
          "text-slate-800 dark:border-[0.5px] dark:border-slate-600 dark:text-slate-300",
          "mx-4",
          "rounded-md",
        )}
      >
        <CloseModalButton toggleForm={closeCallback} />
        {children}
      </Card>
    </div>
  );
}

export function FullscreenModal({ closeCallback, children }: Props) {
  return (
    <div
      className={clsx(
        "absolute top-0 left-0 w-full min-h-screen bg-slate-300 dark:bg-slate-800",
        "text-slate-800 dark:text-gray-100",
      )}
    >
      <CloseModalButton toggleForm={closeCallback} />
      {children}
    </div>
  );
}
