import React from "react";
import { clsx } from "clsx";

type Props = { children: React.ReactNode, color?: string, disabled?: boolean }

export default function Submit({ children, color='bg-slate-800', disabled=false }: Props){
    return (
        <button className={clsx(
            color, 'text-white p-4 rounded-xl font-bold'
        )} type="submit" disabled={disabled}>
            {children}
        </button>
    );
}