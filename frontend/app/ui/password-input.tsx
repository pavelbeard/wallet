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
}: InputPropsWithRegister & { [x:string]: any }) {
  const [revealed, setRevealed] = useState<boolean>();

  return (
    <label className="flex flex-col relative" htmlFor={htmlFor}>
      <span className="pl-2 pb-1">{labelText}</span>
      <input
        className={clsx(
          "p-4 outline-gray-500 outline-2 border-slate-700 border-[1px]",
          "dark:outline-gray-100dark:border-gray-300 dark:text-slate-800",
          "rounded-xl",
        )}
        type={revealed ? "text" : "password"}
        id={id}
        {...register(name)}
        {...rest}
      />
      {revealed ? (
        <EyeSlashIcon
          onClick={() => setRevealed(false)}
          className={clsx(
            "size-6 transition-all hover:scale-110 absolute right-2 translate-y-[185%]",
            "dark:text-slate-800"
          )}
        />
      ) : (
        <EyeIcon
          onClick={() => setRevealed(true)}
          className={clsx(
            "size-6 transition-all hover:scale-110 absolute right-2 translate-y-[185%]",
            "dark:text-slate-800"
          )}
        />
      )}
    </label>
  );
}
