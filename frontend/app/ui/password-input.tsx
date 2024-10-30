import { InputProps } from "@/app/components/ui/types";
import { clsx } from "clsx";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordInput({ htmlFor, name, id, labelText }: InputProps) {
    const [revealed, setRevealed] = useState<boolean>();

    return (
        <label className="flex flex-col relative" htmlFor={htmlFor}>
            <span className="pl-2 pb-1">{labelText}</span>
            <input className={clsx(
                'p-4 outline-gray-500 outline-2 border-slate-700 border-[1px]',
                'rounded-xl'
            )} type={revealed ? "text" : "password"} id={id} name={name} />
            {revealed
                ? <EyeSlashIcon
                    onClick={() => setRevealed(false)}
                    className="size-6 hover:stroke-2 absolute right-2 translate-y-[185%]"
                />
                : <EyeIcon
                    onClick={() => setRevealed(true)}
                    className="size-6 hover:stroke-2 absolute right-2 translate-y-[185%]"
                />
            }
        </label>
    );
}