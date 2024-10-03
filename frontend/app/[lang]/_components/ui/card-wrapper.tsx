import { Props } from "@/types";
import { clsx } from "clsx";

export default function CardWrapper({ children }: Props) {
    return (
        <div className={clsx(
            'bg-gray-50 my-6 p-6 lg:my-12 lg:p-12 rounded-2xl',
            'flex justify-center'
        )}>
            {children}
        </div>
    );
}