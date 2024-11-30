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
  ...rest
}: InputPropsWithRegister & { [x: string]: unknown }) {
  const [revealed, setRevealed] = useState<boolean>();

  return (
    <label
      aria-label={labelText}
      className="flex flex-col w-full relative"
      htmlFor={htmlFor}
      role="password"
    >
      <span className="pb-1 text-sm">{labelText}</span>
      <div
        className={clsx(
          "flex rounded-xl",
          "outline-gray-500 outline-2 border border-slate-700 bg-white",
          "dark:outline-gray-100 dark:border-gray-300 dark:text-slate-800",
          "focus-within:outline"
        )}
      >
        <input
          className={clsx(
            "flex flex-grow basis-0 p-2 h-10 outline-none bg-transparent",
          )}
          type={revealed ? "text" : "password"}
          id={id}
          {...register(name)}
          {...rest}
        />
        <div className="flex flex-col justify-center pr-2 bg-transparent">
          {revealed ? (
            <EyeSlashIcon
              aria-expanded={revealed}
              onClick={() => setRevealed(false)}
              className={clsx(
                "size-6 transition-all hover:scale-110 input-password-icon",
                "dark:text-slate-800",
              )}
            />
          ) : (
            <EyeIcon
              aria-expanded={revealed}
              onClick={() => setRevealed(true)}
              className={clsx(
                "size-6 transition-all hover:scale-110 input-password-icon",
                "dark:text-slate-800",
              )}
            />
          )}
        </div>
      </div>
    </label>
  );
}
