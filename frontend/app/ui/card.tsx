import React from "react";

type CardProps = { children: React.ReactNode }

export default function Card({ children }: CardProps) {
    return (
        <div className="bg-slate-100 rounded-xl mt-12 w-3/4 lg:w-1/3">
            {children}
        </div>
    );
}