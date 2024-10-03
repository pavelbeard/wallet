import { ReactNode } from "react";
import { Props } from "@/types";

export default function Button({
    type, labelText, children, ...rest
}: {
    type?: "submit" | "button" | "reset" | undefined,
    labelText: string
    children?: ReactNode,
} & Props) {
    return (
        <div>
            {children}
            <button type={type} {...rest}>{labelText}</button>
        </div>
    );
}