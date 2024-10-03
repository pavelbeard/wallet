import { ReactNode } from "react";
import LocaleProvider from "@/app/[lang]/provider";

export default function Layout({
    params: { lang },
    children
}: {
    params: { lang: string };
    children: ReactNode;
}) {
    return (
        <LocaleProvider locale={lang}>
            {children}
        </LocaleProvider>
    )
}