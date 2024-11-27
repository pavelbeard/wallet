import { InputPropsWithRegister } from "@/app/lib/types";
import { clsx } from "clsx";
import { forwardRef } from "react";

const CustomInput = forwardRef<HTMLInputElement, InputPropsWithRegister>(
  function CustomInput(
    {
      htmlFor,
      name,
      id,
      labelText,
      textSize,
      register,
      ...rest
    }: InputPropsWithRegister & { [x: string]: unknown },
    ref,
  ) {
    return (
      <label className="flex flex-col w-full" htmlFor={htmlFor}>
        <span className="pb-1">{labelText}</span>
        <input
          ref={ref}
          className={clsx(
            "p-4 outline-gray-500 outline-2 border-slate-700 border-[1px]",
            "dark:outline-gray-100dark:border-gray-300 dark:text-slate-800",
            "rounded-xl",
          )}
          type="text"
          id={id}
          {...register(name)}
          {...rest}
        />
      </label>
    );
  },
);

export default CustomInput;
