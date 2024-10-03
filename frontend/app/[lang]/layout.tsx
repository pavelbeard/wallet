import { ReactNode } from "react";
import { getCurrentLocale } from "@/locales/server";
import "./globals.css";
import NavBar from "@/app/[lang]/_components/home/nav-bar";
import Provider from "@/app/[lang]/provider";
import { Lexend } from "next/font/google";
import { clsx } from "clsx";

const lexend = Lexend({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
    display: "swap",
})


export default function RootLayout({
    params: { lang },
    children,
} : {
    children?: ReactNode;
    params: { lang: string };

}) {
    const currentLocale = getCurrentLocale();

    return (
        <html lang={currentLocale}>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Cartera</title>
            </head>
            <body className={clsx("__Glaze-blue-grad min-h-screen", lexend.className)}>
                <Provider locale={lang}>
                    <NavBar />
                    {children}
                </Provider>
            </body>
        </html>
    );
}
