import { InputPropsWithRegister } from "@/app/lib/types";
import { clsx } from "clsx";

const CustomInput = ({
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
}) => {
  return (
    <label
      aria-label={ariaLabel}
      className="flex w-full flex-col"
      htmlFor={htmlFor}
    >
      <span className="pb-1 text-sm">{labelText}</span>
      <input
        className={clsx(
          "h-10 border-[1px] border-slate-700 p-2 text-sm outline-2 outline-gray-500",
          "dark:border-gray-300 dark:text-slate-800 dark:outline-gray-100",
          "rounded-xl",
        )}
        type="text"
        id={id}
        {...register(name)}
        {...rest}
        data-testid={testId}
      />
    </label>
  );
};

export default CustomInput;
