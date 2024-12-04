import { InputPropsWithRegister } from "@/app/lib/types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useState } from "react";

export default function PasswordInput({
  htmlFor,
  name,
  id,
  labelText,
  register,
  testId,
  ariaLabel,
  ...rest
}: InputPropsWithRegister & { [x: string]: unknown } & {
  testId?: string;
  ariaLabel: string;
}) {
  const [revealed, setRevealed] = useState<boolean>();

  return (
    <label
      aria-label={ariaLabel}
      className="relative flex w-full flex-col"
      htmlFor={htmlFor}
    >
      <span className="pb-1 text-sm">{labelText}</span>
      <div
        className={clsx(
          "flex rounded-xl",
          "border border-slate-700 bg-white outline-2 outline-gray-500",
          "dark:border-gray-300 dark:text-slate-800 dark:outline-gray-100",
          "focus-within:outline",
        )}
      >
        <input
          className={clsx(
            "flex h-10 flex-grow basis-0 bg-transparent p-2 text-sm outline-none",
          )}
          type={revealed ? "text" : "password"}
          id={id}
          data-testid={testId}
          {...register(name)}
          {...rest}
        />
        <div className="flex flex-col justify-center bg-transparent pr-2">
          {revealed ? (
            <EyeSlashIcon
              aria-expanded={revealed}
              onClick={() => setRevealed(false)}
              className={clsx(
                "input-password-icon size-6 transition-all hover:scale-110",
                "dark:text-slate-800",
              )}
            />
          ) : (
            <EyeIcon
              aria-expanded={revealed}
              onClick={() => setRevealed(true)}
              className={clsx(
                "input-password-icon size-6 transition-all hover:scale-110",
                "dark:text-slate-800",
              )}
            />
          )}
        </div>
      </div>
    </label>
  );
}
