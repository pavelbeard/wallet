import { InputProps } from "@/app/components/ui/types";
import { clsx } from "clsx";


export default function EmailInput({ htmlFor, name, id, labelText }: InputProps) {
    return (
        <label className="flex flex-col" htmlFor={htmlFor}>
            <span className="pl-2 pb-1">{labelText}</span>
            <input className={clsx(
                'p-4 outline-gray-500 outline-2 border-slate-700 border-[1px]',
                'rounded-xl'
            )} type="email" id={id} name={name} />
        </label>
    );
}