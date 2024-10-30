import React from "react";

type Props = { children: React.ReactNode }

export default function FormTitle({ children }: Props) {
    return (
        <h1 className="text-2xl pl-2 font-bold">{children}</h1>
    );
}