import { InputPropsWithRegister } from "@/app/lib/types";
import { clsx } from "clsx";

export default function EmailInput({
  htmlFor,
  name,
  id,
  labelText,
  register,
  ...rest
}: InputPropsWithRegister & { [x:string]: unknown }) {
  return (
    <label className="flex flex-col w-full" htmlFor={htmlFor}>
      <span className="pb-1 text-sm">{labelText}</span>
      <input
        className={clsx(
          "p-2 h-10 outline-gray-500 outline-2 border-slate-700 border-[1px]",
          "dark:outline-gray-100 dark:border-gray-300 dark:text-slate-800",
          "rounded-xl",
        )}
        type="email"
        id={id}
        {...register(name)}
        {...rest}
      />
    </label>
  );
}
