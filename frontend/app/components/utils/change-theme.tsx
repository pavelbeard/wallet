"use client";

import logger from "@/app/lib/helpers/logger";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useState } from "react";
import DarkMode from "../icons/dark-mode";
import LightMode from "../icons/light-mode";
import SystemMode from "../icons/system-mode";

export function Buttons({
  isOpen,
  colorScheme,
  setColorScheme,
}: {
  isOpen: boolean;
  colorScheme: string | undefined;
  setColorScheme: (scheme: string | undefined) => void;
}) {
  const buttons: { [key: string]: JSX.Element } = {
    dark: (
      <button key="dark" onClick={() => setColorScheme("dark")}>
        <DarkMode className="max-lg:size-5" />
      </button>
    ),
    system: (
      <button key="system" onClick={() => setColorScheme("system")}>
        <SystemMode className="max-lg:size-5" />
      </button>
    ),
    light: (
      <button key="light" onClick={() => setColorScheme("light")}>
        <LightMode className="max-lg:size-5" />
      </button>
    ),
  };

  return isOpen
    ? Object.values(buttons).map((button) => button)
    : buttons[colorScheme as string];
}

export default function ChangeTheme() {
  const { theme: colorScheme, setTheme: setColorScheme } = useTheme();
  const [isOpen, setOpen] = useState(false);
  const lsTheme = localStorage.getItem("theme");

  return (
    <div
      onClick={() => setOpen(!isOpen)}
      className={clsx(
        "relative flex h-[28px] lg:h-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800",
        "[&>button]:p-1 lg:[&>button]:p-2",
        isOpen || colorScheme == lsTheme
          ? [
              "[&>button:first-child]:rounded-l-md [&>button:hover]:bg-slate-600",
              "[&>button:hover]:text-slate-300 [&>button:last-child]:rounded-r-md",
            ]
          : "hover:bg-slate-600 hover:text-slate-100",
      )}
    >
      <Buttons
        isOpen={isOpen}
        colorScheme={colorScheme}
        setColorScheme={setColorScheme as (scheme: string | undefined) => void}
      />
    </div>
  );
}
