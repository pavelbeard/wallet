import SystemMode from "@/app/components/icons/system-mode";
import useClickOutside from "@/app/lib/hooks/useClickOutside";
import useDesktopBreakpoint from "@/app/lib/hooks/useDesktopBreakpoint";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { RefObject, useState } from "react";
import { createPortal } from "react-dom";

export default function ChangeTheme() {
  const isDesktop = useDesktopBreakpoint();
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const [isOpen, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const buttons: { [x: string]: JSX.Element } = {
    light: <SunIcon className="size-5" />,
    dark: <MoonIcon className="size-5" />,
    system: <SystemMode className="size-5" />,
  };

  return isDesktop ? (
    <button onClick={() => setOpen(!isOpen)}>
      {buttons[theme as string]}
      {isOpen &&
        createPortal(
          <div
            ref={ref as RefObject<HTMLDivElement>}
            className={clsx(
              "absolute right-2 top-28 z-50",
              "flex flex-col gap-2",
              "rounded-lg border border-slate-300 bg-slate-100 p-2 dark:border-slate-600 dark:bg-slate-800",
            )}
          >
            {Object.entries(buttons).map(([key, icon]) => (
              <button
                key={key}
                className={clsx(
                  "flex items-center gap-2 p-2 text-xs",
                  "bar-item",
                )}
                onClick={() => setTheme(key)}
              >
                {icon} {t("topbar.theme." + key)}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </button>
  ) : isOpen ? (
    <div className="flex items-center">
      {Object.entries(buttons).map(([key, icon]) => (
        <button
          className="p-2 text-xs"
          key={key}
          onClick={() => {
            setTheme(key);
            setOpen(false);
          }}
        >
          {icon}
        </button>
      ))}
    </div>
  ) : (
    <button className="p-2" onClick={() => setOpen(!isOpen)}>
      {buttons[theme as string]}
    </button>
  );
}
